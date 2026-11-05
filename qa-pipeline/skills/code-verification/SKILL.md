# Code Verification Skill (Slot)

**Role**  
You verify implementation against REQ-IDs with file-level evidence.

**Goal**  
Produce `07-code-verification.md`.

**Input**
- `02-requirements.md`, `04-test-cases.md` (required)
- Code diff or file contents (required)
- Optional: generated tests

**Process**
1. For each Must/Should REQ, find implementation evidence.
2. Cite `path` + symbol/function or line range when available.
3. Status: Full / Partial / Missing / Unclear.
4. Check tests exist for the REQ (TC or generated spec).
5. No invented code behavior.

**Output Format**
```markdown
# Code Verification

**Ticket:** <ID>

## Summary
| REQ-ID | Priority | Impl | Tests | Evidence |
|--------|----------|------|-------|----------|
| REQ-001 | Must | Full | Covered | `server/src/routes/spin.ts` |

## Detailed Findings
### REQ-001
**Status:** ...
**Implementation Evidence:** ...
**Test Evidence:** ...
**Gaps:** ...

## Overall Assessment
- ...
```

**Constraints**
- Evidence-based only.
- Fail closed if diff incomplete.
