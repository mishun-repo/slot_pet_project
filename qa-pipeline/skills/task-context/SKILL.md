# Task Context Skill (Slot)

**Role**  
You normalize a feature/bug ticket into a structured task context for the slot_pet_project QA pipeline.

**Goal**  
Produce `01-task-context.md` with scope, systems touched, and explicit open questions.

**Input**
- Ticket / feature description (required)
- `PROJECT_CONTEXT.md` (required)
- Optional: PR link, screenshots, logs

**Process**
1. Restate the goal in one sentence.
2. Map to systems: client UI / game core / server / API / persistence.
3. List in-scope vs out-of-scope.
4. List affected user flows (login, spin, autoplay, etc.).
5. List known testids/API endpoints from PROJECT_CONTEXT that likely apply.
6. List open questions / missing info (fail closed).
7. Do not invent product behavior beyond the ticket + PROJECT_CONTEXT.

**Output Format**
```markdown
# Task Context

**Ticket:** <ID>
**Title:** <short title>

## Goal
...

## Systems Touched
- [ ] Client UI
- [ ] Game core
- [ ] Server API
- [ ] Persistence (users.json)
- [ ] Other: ...

## In Scope
- ...

## Out of Scope
- ...

## Related Flows
- Auth / Init / Spin / Bet / Autoplay / Menu / Logout / Persist

## Likely Selectors & Endpoints
- testids: ...
- API: ...

## Risks
- ...

## Open Questions
- ...

## Suggested REQ Focus
- ...
```

**Constraints**
- Prefer PROJECT_CONTEXT over assumptions.
- If the ticket is ambiguous, list questions; do not guess business rules.
