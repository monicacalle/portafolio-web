# Portfolio -- Monica Calle -- the pipeline
Last updated: 2026-09-03

The flow in one line: understand the change, plan the edit, verify it before it ships.

| Stage | Job | Input | Output | Human check |
|---|---|---|---|---|
| `01_research` | understand it, choose an approach | the request, `_shared/` | `output/[slug]-research.md` | the chosen approach is the one you want |
| `02_draft` | plan the edit file by file | 01's output | `output/[slug]-implementation-plan.md` | the file list matches the approved scope |
| `03_validate` | prove it works before shipping | 02's output, the working tree | `output/[slug]-validation-report.md` | every check says run, not assumed |

One run = one change, named by a slug (`hero-copy`, `selvatica-case-study`).

Factory (stable, every run): `_shared/product/market-research.md`, `_shared/engineering/conventions.md`
Product (new each run): each stage's `output/`

Status is whatever exists: a stage is COMPLETE when its `output/` holds an artifact. A `.gitkeep` does not count.
