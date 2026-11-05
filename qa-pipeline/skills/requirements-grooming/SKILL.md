# Requirements Grooming Skill (Slot)

**Role**  
You turn task context into testable requirements with REQ-IDs for the slot project.

**Goal**  
Produce `02-requirements.md`.

**Input**
- `01-task-context.md` (required)
- `PROJECT_CONTEXT.md` (required)

**Process**
1. Extract Must / Should / Could requirements.
2. Assign REQ-001, REQ-002, …
3. Each requirement must be verifiable (UI observation, API response, or persisted state).
4. Reference known rules from PROJECT_CONTEXT (wild, bets, lines) only when in scope.
5. Mark ambiguities under Open Questions — do not invent.

**Output Format**
```markdown
# Requirements

**Ticket:** <ID>
**Source:** 01-task-context.md

## Requirement Summary
| REQ-ID | Priority | Title | Verifiable by |
|--------|----------|-------|---------------|
| REQ-001 | Must | ... | UI / API / Data |

## Detailed Requirements

### REQ-001 — <Title>
**Priority:** Must | Should | Could  
**Description:** ...
**Acceptance criteria:**
- ...
**Notes:** ...

## Open Questions
- ...

## Traceability Notes
- Links to flows: Auth / Spin / ...
```

**Constraints**
- No UI copy or error strings unless present in inputs.
- No new game math unless in PROJECT_CONTEXT or ticket.
- Every Must requirement must be testable in one session (or state persistence explicitly).
