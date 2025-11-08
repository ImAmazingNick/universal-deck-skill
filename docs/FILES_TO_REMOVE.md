# Files to Remove - Unused Files Analysis

## Analysis Results

### Files Currently Used:
- `scripts/cli.js` - ✅ Used (main CLI entry point)
- `scripts/context-preview.js` - ✅ Used (qa:context script)
- `scripts/exportPptx.ts` - ✅ Used (source file, compiled to dist/)
- `scripts/exportPptx.js` - ✅ Used (fallback in cli.js line 118)
- `scripts/dist/` - ✅ Used (build output)
- `scripts/tsconfig.scripts.json` - ✅ Used (TypeScript config)

### Files NOT Used (Can Remove):

1. **scripts/scripts/exportPptx.js** - ❌ Duplicate/nested directory, not referenced
2. **scripts/src/lib/deck-types.js** - ❌ Old compiled file, not referenced
3. **scripts/test-pptx-rendering.ts** - ❌ Test file, not referenced in any scripts
4. **SKILL.md** (root) - ❌ Redirect file, .claude/SKILL.md is the actual skill

### Files to Keep (Used as Fallback):
- `scripts/exportPptx.js` - ✅ Kept (used as fallback when dist/ doesn't exist)

## Removal Plan

Remove these files:
1. `scripts/scripts/` directory (entire directory)
2. `scripts/src/` directory (entire directory)
3. `scripts/test-pptx-rendering.ts`
4. `SKILL.md` (root redirect file)

