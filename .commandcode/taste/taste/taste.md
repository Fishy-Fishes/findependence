# Taste
- Does Figma design work through a local MCP server ("figma-console") configured in Cline's settings at `C:\Users\sadiq\.cline\data\settings\cline_mcp_settings.json`, with the companion Figma plugin running in the desktop app; expects Figma tasks to be executed via this server/plugin connection. Confidence: 0.9
- For Figma operations, prefer the plugin runtime bridge (`figma_execute`, node reads/writes) over the REST API — the REST API gets rate-limited while the plugin bridge works independently. Confidence: 0.8
- Figma screenshot capture can time out on large/heavy frames; fall back by retrying at reduced scale (e.g., 0.5 → 0.25) and using JPG format before abandoning visual verification. Confidence: 0.6
- Uses very terse, context-dependent follow-up instructions (e.g., a single word like "equalise" or a short "bezel looks a bit off") and expects the assistant to carry forward the ongoing task's context without re-explaining. Confidence: 0.75
- Works on Windows; user home directory is `C:\Users\sadiq`. Confidence: 0.8
- Uses SF Symbols (Pro) as the icon library for UI icons in Figma designs. Confidence: 0.8
- Prefers a "liquid glass" (glassmorphism) aesthetic for cards and surfaces in UI designs. Confidence: 0.8
- Maintains a consistent design system across screens — reuse existing components (e.g., Background, established color palette, typography) rather than introducing new styles; related screens within the same product should share identical styling, including the background gradient and device bezel/frame rendering (e.g., matching `clipsContent` so the bezel isn't clipped). Confidence: 0.85
