## Agent skills

When grilling, ask me one question at a time.

### Issue tracker

Issues are tracked in GitHub Issues for `Y-io/effect-foldkit-stack`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses the single-context layout. See `docs/agents/domain.md`.

### Documentation language

面向人的核心文档、规格、GitHub issue、ADR、任务说明与验收标准默认使用简体中文。代码标识符、包名、API/CSS 名称及不可替代的技术术语保留英文；关键术语首次出现时可附简短中文解释。

## Vendored repositories

This project vendors external repositories under `repos/`.

- Use vendored repositories as read-only reference material when working with related libraries.
- Prefer examples and patterns from vendored source code over generated guesses or web search results.
- Do not edit files under `repos/` unless explicitly asked.
- Do not import from `repos/`; application code must continue importing from normal package dependencies.

### Effect

Before writing or changing Effect code, always read `repos/effect/LLMS.md`.

Inspect `repos/effect/` for idiomatic usage, tests, module structure, and API design. Treat the vendored source as the source of truth for Effect patterns used by this project.

### Foldkit

Before writing or changing Foldkit code, always read `repos/foldkit/AGENTS.md`.

Inspect `repos/foldkit/examples/` and `repos/foldkit/packages/` for idiomatic usage, tests, module structure, and API design. Treat the vendored source as the source of truth for Foldkit patterns used by this project.
