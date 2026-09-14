#!/usr/bin/env node
/**
 * The interactive launcher behind `make` — tooling, not part of the site.
 *
 * WHY THIS IS NODE AND NOT A MAKEFILE RECIPE. The Makefile has to run under GNU
 * Make 3.81 — what macOS still ships, from 2006 — and under `cmd.exe` on
 * Windows, where `sh` may not exist at all. Anything with a pipe, a conditional
 * or a `$(shell ...)` in it stops being portable immediately, and `lsof` does
 * not exist on Windows while `netstat -ano` does not exist anywhere else. Node
 * is already a hard dependency of this repository, so every platform difference
 * lives in one file that can be read and tested, and each Make recipe stays a
 * single plain command that both shells understand.
 *
 *   node scripts/servidor.mjs --mode dev            interactive, from port 3000
 *   node scripts/servidor.mjs --mode start          the same for `next start`
 *   node scripts/servidor.mjs --mode dev --port N   skip the questions
 *   node scripts/servidor.mjs --mode dev --yes      first free port, no prompts
 *   node scripts/servidor.mjs --inspect             report only, launch nothing
 *   node scripts/servidor.mjs --free --port N       free a port, then stop
 */

import { spawn, execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import net from "node:net";
import readline from "node:readline/promises";
import process from "node:process";

const PUERTO_BASE = Number(process.env.PORT) || 3000;
/* Five is enough to get past a couple of stale servers and a Vite on 3001
   without turning one question into a list nobody reads. */
const CUANTOS = 5;
const ES_WINDOWS = process.platform === "win32";

/*
  TWO DIFFERENT QUESTIONS, and running them together is a bug in both
  directions.

  "Can I ask?" is about STDIN — a launcher that prompts into a closed pipe waits
  for an answer that cannot arrive, which on CI is a hung build and the hardest
  kind to read from a log. Both streams have to be a terminal: stdout alone is
  true for `make dev < /dev/null`.

  "Can I colour?" is about what stdout will render. `hasColors()` is Node's own
  answer and it already knows about Windows consoles with VT processing off,
  where the alternative is escape codes printed as text. NO_COLOR is the
  cross-tool convention and costs one condition to honour.
*/
const interactivo = Boolean(process.stdin.isTTY && process.stdout.isTTY);
const tty =
  Boolean(process.stdout.isTTY) &&
  !process.env.NO_COLOR &&
  (typeof process.stdout.hasColors === "function" ? process.stdout.hasColors() : true);
/* Written as an escape sequence rather than a literal control byte: this file
   is read far more often than it is run, and a raw ESC is invisible in a diff
   and easy for an editor to eat. */
const ESC = "\u001b[";
const pintar = (codigo) => (texto) => (tty ? `${ESC}${codigo}m${texto}${ESC}0m` : texto);
const negrita = pintar("1");
const rojo = pintar("31");
const verde = pintar("32");
const ambar = pintar("33");
const tenue = pintar("2");

function argumentos(argv) {
  const out = { mode: "dev", port: null, yes: false, inspect: false, free: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--mode") out.mode = argv[++i];
    else if (a === "--port") out.port = Number(argv[++i]);
    else if (a === "--yes" || a === "-y") out.yes = true;
    else if (a === "--inspect") out.inspect = true;
    else if (a === "--free") out.free = true;
  }
  if (out.mode !== "dev" && out.mode !== "start") out.mode = "dev";
  if (out.port !== null && !esPuerto(out.port)) out.port = null;
  return out;
}

function esPuerto(n) {
  return Number.isInteger(n) && n > 0 && n < 65536;
}

/**
 * Is this port free?
 *
 * Asked by BINDING it rather than by scanning, because binding is the same
 * question the server is about to ask and a scan is not: a port can answer a
 * connection and still refuse a second listener, and can refuse a connection
 * and still be held. Both host families are tried — a stale IPv6 listener is
 * invisible to an IPv4-only check, which is the failure that puts "the port is
 * free" and "EADDRINUSE" in the same second of output.
 */
function puedeEscuchar(puerto, host) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(false));
    s.once("listening", () => s.close(() => resolve(true)));
    try {
      s.listen({ port: puerto, host, exclusive: true });
    } catch {
      resolve(false);
    }
  });
}

async function estaLibre(puerto) {
  if (!(await puedeEscuchar(puerto, "0.0.0.0"))) return false;
  /* A host without IPv6 fails this for the wrong reason, so an ENOTSUP-style
     refusal on :: is not evidence the port is taken — only the v4 answer is
     load-bearing when v6 is absent. Trying v4 first and treating a v6 failure
     as "busy" would make every dual-stackless container think 3000 is held. */
  const v6 = await puedeEscuchar(puerto, "::");
  if (v6) return true;
  return !(await tieneOyenteV6(puerto));
}

/* Does anything actually hold the v6 socket, or is v6 simply unavailable?
   `pidsEn` answers with names; no names means nothing is listening. */
async function tieneOyenteV6(puerto) {
  return pidsEn(puerto).length > 0;
}

/** Every PID listening on a port. Empty when the port is free, and also when
 *  the platform will not say — which is not the same thing, so the menu drops
 *  the option to stop a process it cannot name rather than offering it. */
function pidsEn(puerto) {
  try {
    if (ES_WINDOWS) {
      const salida = execFileSync("netstat", ["-ano", "-p", "TCP"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const pids = new Set();
      for (const linea of salida.split(/\r?\n/)) {
        if (!/LISTENING/i.test(linea)) continue;
        const campos = linea.trim().split(/\s+/);
        const local = campos[1] || "";
        /* `:3000` and not `3000`, or 13000 and 23000 match too. */
        if (!local.endsWith(`:${puerto}`)) continue;
        const pid = Number(campos[campos.length - 1]);
        if (Number.isInteger(pid) && pid > 0) pids.add(pid);
      }
      return [...pids];
    }
    const salida = execFileSync(
      "lsof",
      ["-nP", `-iTCP:${puerto}`, "-sTCP:LISTEN", "-t"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
    return [...new Set(salida.split(/\s+/).filter(Boolean).map(Number))].filter((n) =>
      Number.isInteger(n),
    );
  } catch {
    /* lsof exits 1 when nothing matches, and it is absent from some minimal
       Linux images. Either way there are no names to offer. */
    return [];
  }
}

/** A one-line description of a PID, for the confirmation. Stopping something
 *  the reader cannot identify is the one thing here that must not happen. */
function describir(pid) {
  try {
    if (ES_WINDOWS) {
      const salida = execFileSync(
        "tasklist",
        ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      );
      const nombre = (salida.split(",")[0] || "").replace(/"/g, "").trim();
      return nombre || `PID ${pid}`;
    }
    const salida = execFileSync("ps", ["-p", String(pid), "-o", "args="], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return salida.trim().slice(0, 110) || `PID ${pid}`;
  } catch {
    return `PID ${pid}`;
  }
}

/** Never signal ourselves, our own shell, or init. */
function esNuestro(pid) {
  return pid === process.pid || pid === process.ppid || pid <= 1;
}

/**
 * Stop whatever holds a port, politely first.
 *
 * SIGTERM, three seconds to shut down, then SIGKILL: a Next dev server has a
 * cache to flush and child workers to reap, and killing it outright leaves both
 * behind. Windows has no SIGTERM worth the name, so `taskkill /T` takes the
 * tree and `/F` is the only mode that reliably returns the socket.
 */
async function liberar(puerto) {
  const pids = pidsEn(puerto).filter((p) => !esNuestro(p));
  if (pids.length === 0) return { ok: await estaLibre(puerto), pids: [] };

  for (const pid of pids) {
    try {
      if (ES_WINDOWS) {
        execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
      } else {
        process.kill(pid, "SIGTERM");
      }
    } catch {
      /* Already gone, or not ours to signal. The re-check below is the answer
         that matters, not this one. */
    }
  }

  for (let intento = 0; intento < 12; intento += 1) {
    await new Promise((r) => setTimeout(r, 250));
    if (await estaLibre(puerto)) return { ok: true, pids };
  }

  if (!ES_WINDOWS) {
    for (const pid of pids) {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        /* see above */
      }
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return { ok: await estaLibre(puerto), pids };
}

async function escanear(base, cuantos) {
  const filas = [];
  for (let p = base; p < base + cuantos && p < 65536; p += 1) {
    const ok = await estaLibre(p);
    filas.push({ puerto: p, libre: ok, pids: ok ? [] : pidsEn(p) });
  }
  return filas;
}

function arrancar(mode, puerto) {
  const require = createRequire(import.meta.url);
  let binario;
  try {
    binario = require.resolve("next/dist/bin/next");
  } catch {
    console.error(
      rojo("\n  next is not installed. Run `make install` (or `pnpm install`) first.\n"),
    );
    process.exit(1);
  }

  console.log(
    `\n  ${verde("\u25b8")} ${negrita(`next ${mode}`)} on ${negrita(`http://localhost:${puerto}`)}  ${tenue("(ctrl-c to stop)")}\n`,
  );

  /* `process.execPath`, not a package-manager shim: `pnpm exec` puts a process
     between the terminal and Next that swallows ctrl-c on Windows, and the shim
     is `next.cmd` there and a symlink here. Node's own path is the one thing
     that is identical on all three platforms. */
  const hijo = spawn(process.execPath, [binario, mode, "-p", String(puerto)], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(puerto) },
  });
  hijo.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
  hijo.on("error", (e) => {
    console.error(rojo(`\n  could not start next: ${e.message}\n`));
    process.exit(1);
  });
}

function imprimirEscaneo(filas) {
  console.log(`\n  ${negrita("Ports")}`);
  for (const f of filas) {
    const etiqueta = f.libre
      ? verde("free")
      : rojo(`in use${f.pids.length ? ` - pid ${f.pids.join(", ")}` : ""}`);
    console.log(`    ${String(f.puerto).padEnd(6)} ${etiqueta}`);
    if (!f.libre) for (const pid of f.pids) console.log(`           ${tenue(describir(pid))}`);
  }
  console.log("");
}

const SI = new Set(["y", "yes", "s", "si", "sí"]);

async function main() {
  const args = argumentos(process.argv.slice(2));

  if (args.free) {
    const puerto = args.port || PUERTO_BASE;
    const pids = pidsEn(puerto);
    if (pids.length === 0 && (await estaLibre(puerto))) {
      console.log(`\n  ${verde("\u2713")} ${puerto} is already free.\n`);
      return;
    }
    console.log(`\n  Freeing ${negrita(String(puerto))}:`);
    for (const pid of pids) console.log(`    ${tenue(`pid ${pid}  ${describir(pid)}`)}`);
    const { ok } = await liberar(puerto);
    console.log(
      ok ? `  ${verde("\u2713")} ${puerto} is free.\n` : `  ${rojo("\u2717")} ${puerto} is still held.\n`,
    );
    process.exit(ok ? 0 : 1);
  }

  const filas = await escanear(PUERTO_BASE, CUANTOS);

  if (args.inspect) {
    imprimirEscaneo(filas);
    return;
  }

  /* An explicit port is an instruction, not an opening bid. */
  if (args.port) {
    if (!(await estaLibre(args.port))) {
      console.error(
        `\n  ${rojo("\u2717")} ${args.port} is in use. \`make free PORT=${args.port}\` frees it.\n`,
      );
      process.exit(1);
    }
    arrancar(args.mode, args.port);
    return;
  }

  const primeroLibre = filas.find((f) => f.libre)?.puerto;

  /* No terminal to ask: CI, a git hook, a task runner. Take the first free port
     and say which one — a launcher that blocks on a prompt nobody can see is a
     hung build, and that is the failure mode this branch is least able to
     debug from a log. */
  if (!interactivo || args.yes) {
    if (!primeroLibre) {
      console.error(
        `\n  ${rojo("\u2717")} ${PUERTO_BASE}-${PUERTO_BASE + CUANTOS - 1} are all in use.\n`,
      );
      process.exit(1);
    }
    arrancar(args.mode, primeroLibre);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let cerrado = false;
  const cerrar = () => {
    if (!cerrado) {
      cerrado = true;
      rl.close();
    }
  };

  try {
    const base = filas[0];

    if (base.libre) {
      const r = (
        await rl.question(
          `\n  Run ${negrita(`next ${args.mode}`)} on ${negrita(String(base.puerto))}? ${tenue("[Y/n]")} `,
        )
      )
        .trim()
        .toLowerCase();
      if (r === "" || SI.has(r)) {
        cerrar();
        arrancar(args.mode, base.puerto);
        return;
      }
      const otro = (await rl.question(`  Port? ${tenue(`[${primeroLibre}]`)} `)).trim();
      const elegido = otro === "" ? primeroLibre : Number(otro);
      if (!esPuerto(elegido)) {
        cerrar();
        console.error(`\n  ${rojo("\u2717")} Not a port.\n`);
        process.exit(1);
      }
      if (!(await estaLibre(elegido))) {
        cerrar();
        console.error(`\n  ${rojo("\u2717")} ${elegido} is in use.\n`);
        process.exit(1);
      }
      cerrar();
      arrancar(args.mode, elegido);
      return;
    }

    /* The port they asked for is held. Show WHAT holds it before offering to
       end it: the whole risk in this script is stopping something that was not
       a stale dev server. */
    console.log(`\n  ${ambar("!")} ${negrita(String(base.puerto))} is in use.`);
    for (const pid of base.pids) console.log(`      ${tenue(`pid ${pid}  ${describir(pid)}`)}`);
    if (base.pids.length === 0) {
      console.log(`      ${tenue("held by a process this platform will not name")}`);
    }

    const siguiente = filas.find((f) => f.libre)?.puerto;
    const porDefecto = siguiente ? "2" : "3";
    console.log("");
    if (base.pids.length > 0) console.log(`    ${negrita("1")}  stop it and use ${base.puerto}`);
    if (siguiente) console.log(`    ${negrita("2")}  use ${siguiente} instead`);
    console.log(`    ${negrita("3")}  another port`);
    console.log(`    ${negrita("q")}  cancel\n`);

    const bruto = (await rl.question(`  Choice ${tenue(`[${porDefecto}]`)} `)).trim().toLowerCase();
    const eleccion = bruto === "" ? porDefecto : bruto;

    if (eleccion === "q") {
      cerrar();
      console.log("");
      return;
    }

    if (eleccion === "1" && base.pids.length > 0) {
      const seguro = (
        await rl.question(
          `  Stop ${base.pids.length} process(es) on ${base.puerto}? ${tenue("[y/N]")} `,
        )
      )
        .trim()
        .toLowerCase();
      if (!SI.has(seguro)) {
        cerrar();
        console.log("\n  Nothing stopped.\n");
        return;
      }
      const { ok } = await liberar(base.puerto);
      if (!ok) {
        cerrar();
        console.error(`\n  ${rojo("\u2717")} ${base.puerto} is still held. Try another port.\n`);
        process.exit(1);
      }
      console.log(`  ${verde("\u2713")} ${base.puerto} is free.`);
      cerrar();
      arrancar(args.mode, base.puerto);
      return;
    }

    if (eleccion === "3") {
      const otro = Number((await rl.question("  Port? ")).trim());
      if (!esPuerto(otro)) {
        cerrar();
        console.error(`\n  ${rojo("\u2717")} Not a port.\n`);
        process.exit(1);
      }
      if (!(await estaLibre(otro))) {
        cerrar();
        console.error(`\n  ${rojo("\u2717")} ${otro} is in use too.\n`);
        process.exit(1);
      }
      cerrar();
      arrancar(args.mode, otro);
      return;
    }

    if (!siguiente) {
      cerrar();
      console.error(
        `\n  ${rojo("\u2717")} ${PUERTO_BASE}-${PUERTO_BASE + CUANTOS - 1} are all in use.\n`,
      );
      process.exit(1);
    }
    cerrar();
    arrancar(args.mode, siguiente);
  } finally {
    /* Leaving it open on an exception hangs the terminal with the raw-mode
       handler still installed. Closing twice is a no-op. */
    cerrar();
  }
}

main().catch((e) => {
  /* Ctrl-D at a prompt is a cancel, not a failure — readline rejects with
     "Aborted with Ctrl+D" and the old handler printed that in red and exited 1,
     so `make dev` reported an error for someone who simply changed their mind.
     Ctrl-C is the same decision and arrives as an AbortError. Both leave with
     an empty line and a zero, like answering `q`. */
  const msg = String(e?.message || e);
  if (e?.name === "AbortError" || /Ctrl\+[CD]/i.test(msg)) {
    console.log("");
    process.exit(0);
  }
  console.error(rojo(`\n  ${msg}\n`));
  process.exit(1);
});
