## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `Y-io/effect-foldkit-stack`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses the single-context layout. See `docs/agents/domain.md`.

## Vendored repositories

This project vendors external repositories under `repos/`.

- Use vendored repositories as read-only reference material when working with related libraries.
- Prefer examples and patterns from vendored source code over generated guesses or web search results.
- Do not edit files under `repos/` unless explicitly asked.
- Do not import from `repos/`; application code must continue importing from normal package dependencies.

### Effect

Before writing or changing Effect code, always read `repos/effect/LLMS.md`.

Inspect `repos/effect/` for idiomatic usage, tests, module structure, and API design. Treat the vendored source as the source of truth for Effect patterns used by this project.
