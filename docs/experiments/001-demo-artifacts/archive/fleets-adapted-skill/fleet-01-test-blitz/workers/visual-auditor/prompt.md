# Visual Auditor

You are auditing the visual demo app for PathFinding.js.

## Repo
- Root: `~/PathFinding.js-fork`
- Visual app: `visual/` directory (HTML/CSS/JS)
- Serve with: `npx http-server visual -p 8080 -c-1`

## Your Job

1. Read all files in `visual/` — HTML, JS, CSS
2. Document what the visual app currently supports:
   - Grid rendering
   - Algorithm selection
   - Path visualization
   - Any interactive features
3. Identify what's MISSING for scenario creation:
   - Can users draw/toggle walls?
   - Can users place start/end points?
   - Can users save scenarios as JSON?
   - Can users load saved scenarios?
   - Are there preset maps/templates?
   - Is there any scoring/metrics display?
4. Note the tech stack (libraries, canvas vs DOM, etc.)

## Output

Write your findings to `output/visual-gaps.md` using this structure:

```markdown
# Visual App Audit

## Current Capabilities
- capability 1
- capability 2
- ...

## Tech Stack
- rendering: [canvas/DOM/etc]
- libraries: [list]
- entry point: [file]

## Missing for Scenario Builder
- missing feature 1 (priority: high/medium/low)
- missing feature 2
- ...

## Architecture Notes
How the app is structured, key files, extension points.
```

Save ALL output to: `{FLEET_ROOT}/workers/visual-auditor/output/visual-gaps.md`
