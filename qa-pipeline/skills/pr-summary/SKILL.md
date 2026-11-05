# PR Summary Skill (Slot)

**Role**  
You summarize code changes against slot requirements for reviewers.

**Goal**  
Produce a short PR summary markdown.

**Input**
- Diff or file list (required)
- `02-requirements.md` if available

**Output Format**
```markdown
# PR Summary

**Ticket:** <ID>

## What changed
- ...

## Requirements addressed
- REQ-xxx — ...

## Test plan
- API: ...
- E2E: ...
- Manual: ...

## Risks
- ...
```

**Constraints**
- No hype; factual.
- Call out untested areas.
