# 02_draft -- turn the approved approach into a file-by-file plan
Last updated: 2026-09-03

One job: produce a plan concrete enough to execute without re-deciding anything.

## Inputs
- Working (this run): ../01_research/output/[slug]-research.md
- Reference (every run): ../../_shared/engineering/conventions.md

Do NOT load: the market research (its decisions are already carried in the research
output), other runs, `components/ui/`.

## Process
1. Read the approved research and extract the accepted approach.
2. Map it to concrete files. Name every file that changes, including the second locale.
3. Order the steps so the tree stays buildable at each one, and note how to undo it.
4. Put assumptions and open questions at the top of the plan, not buried.

## Outputs
- [slug]-implementation-plan.md -> output/

## Human check
Read the file list top to bottom. Confirm it touches only what the research approved,
and that every `messages/es/` edit has its `messages/en/` twin. Edit in place.
