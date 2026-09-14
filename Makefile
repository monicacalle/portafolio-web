# Portfolio — Mónica Calle
#
# `make` starts the dev server and asks which port to use. Everything else is a
# one-word verb: `make help` lists them.
#
# THIS FILE IS DELIBERATELY THIN. It has to run under GNU Make 3.81 — what macOS
# still ships, from 2006, with no `.ONESHELL` and no `$(file ...)` — and under
# `cmd.exe` on Windows, where `sh` may not exist. So every recipe below is ONE
# plain command: no pipes, no `&&`, no shell conditionals, and no `VAR=x cmd`
# prefix, which is Bourne syntax that `cmd.exe` reads as a command name. The one
# conditional here is `$(if ...)`, which Make itself expands before the shell
# ever sees the line. Anything needing real logic lives in
# `scripts/servidor.mjs`, in Node, which behaves the same on all three.
#
# Windows: Make is not installed by default. Either
#   winget install ezwinports.make      (or: choco install make / scoop install make)
# or skip Make entirely — every target here has a package-manager twin:
#   pnpm serve   pnpm serve:prod   pnpm ports   pnpm free
#   pnpm build   pnpm lint         pnpm typecheck

# The port to try FIRST, not an instruction: the launcher still asks, and still
# offers the next one when that is taken.
#   make PORT=4000        make free PORT=3001
PORT ?=
PUERTO := $(if $(PORT),--port $(PORT),)

# `?=` so a CI image can pass PM=npm without editing this file.
PM ?= pnpm
NODE ?= node
LANZADOR := $(NODE) scripts/servidor.mjs

.DEFAULT_GOAL := dev

.PHONY: help dev serve start prod build install lint typecheck check clean ports free reset

## dev            start the dev server, asking which port  (the default target)
dev:
	@$(LANZADOR) --mode dev $(PUERTO)

## serve          alias for dev, for anyone who reaches for that word first
serve: dev

## prod           serve an existing production build, asking which port
prod:
	@$(LANZADOR) --mode start $(PUERTO)

## start          build, then serve the production bundle
start: build prod

## build          production build
build:
	@$(PM) run build

## install        install dependencies exactly as the lockfile says
install:
	@$(PM) install --frozen-lockfile

## lint           eslint
lint:
	@$(PM) run lint

## typecheck      tsc, no emit
typecheck:
	@$(PM) run typecheck

## check          lint, then typecheck, then build
check: lint typecheck build

## ports          what is listening on 3000 and the four above it
ports:
	@$(LANZADOR) --inspect

## free           stop whatever holds a port:  make free PORT=3000
free:
	@$(LANZADOR) --free $(PUERTO)

## clean          delete the build cache; the next build rebuilds it
clean:
	@$(NODE) -e "require('node:fs').rmSync('.next',{recursive:true,force:true});console.log('  removed .next')"

## reset          clean, then reinstall from the lockfile
reset: clean install

# The help text IS the `##` comments above, read back out of this file, so a
# target and its description cannot drift apart — adding one without the other
# shows up the moment anyone runs `make help`. Node does the parsing because
# `sed` and `awk` are not on a stock Windows PATH.
help:
	@$(NODE) -e "const t=require('node:fs').readFileSync('Makefile','utf8');console.log('\n  make <target>\n');for(const l of t.split('\n'))if(l.startsWith('## '))console.log('    '+l.slice(3));console.log('\n  PORT=n  try that port first:  make PORT=4000\n')"
