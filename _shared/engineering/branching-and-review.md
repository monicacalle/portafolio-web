# Branching and the epic review gate
Last updated: 2026-09-04

How work reaches `main`. This is a hard rule, not a preference.

## Branching

```
main
 └── epic/MP-1-urgent-fixes          one branch per epic
      ├── MP-3-site-url              one branch per ticket
      ├── MP-4-graphic-portfolio
      └── ...
```

1. Every epic gets a branch off `main`, named `epic/MP-N-short-slug`.
2. Every ticket gets a branch off the epic branch, named `MP-N-short-slug`.
3. **A ticket PR targets the epic branch. Never `main`.**
4. When every ticket in the epic is merged into the epic branch, open one PR from the
   epic branch to `main`.
5. That PR does not merge until the review gate below has run and everything it found
   is fixed.

Why: the tickets in an epic are small and interdependent, and reviewing them one at a
time hides the thing that matters, which is whether the epic as a whole left the site
better. The gate runs once, against the finished result.

## Remotes
- `origin` -> `monicacalle/portafolio-web`. The official repository. This is what deploys.
- `upstream` -> `tomas-fw/monica-portfolio`. Private fallback and reference only.

Keep both in step. A mirror that has drifted is worse than no mirror, because it is
trusted and wrong.

## The review gate

Run all six against the epic branch diff before merging to `main`. Run the first five
in parallel; the adversary runs last, because its job is to attack their output.

| Pass | What it looks for | Run it with |
| --- | --- | --- |
| Front end | Correctness, regressions, dead code, bundle cost, React and Next misuse | `10x-developer:tenx-reviewer` |
| Security | Secrets, injection, unsafe rendering, dependency risk, exposed data | `/security-review` |
| Design | Visual consistency, spacing, hierarchy, rhythm, generic AI patterns | `/design-review` |
| UX | Flows, states, error and empty cases, whether a task can be completed | `impeccable:critique` |
| UI | Alignment, type, colour, contrast, focus states, responsive behaviour | `impeccable:audit` |
| Adversary | Attacks the other five: what did they miss, what did they wave through, which finding is wrong | a fresh agent given the diff and all five reports |

The adversary is the point of the gate, not a formality. Five agreeable reviewers produce
five agreeable reports. Its brief is to assume the reviews were lazy and prove it.

## What counts as done
- Every finding is fixed, or explicitly declined in writing with a reason on the ticket.
- "Fixed" means re-verified against the live behaviour, not against the diff.
- A pass that was not run is recorded as not run. It is never reported as clean.

That last line matters more than the rest of this file. A review that quietly skipped the
security pass and said nothing is worse than no review, because the merge that follows it
is made with false confidence.
