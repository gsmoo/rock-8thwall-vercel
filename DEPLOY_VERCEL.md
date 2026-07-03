# Deploy to Vercel

This folder is the Vercel-specific copy of the WebAR project.

## Vercel settings

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`
- Install Command: leave default

## Why this copy is different

- It does not include the duplicated Azure `dist/` folder.
- It does not include the original embedded-texture `rock_preview.glb`.
- It uses `src/assets/rock_preview_external_textures.glb`.
- Model textures are external PNG files in `src/assets/rock_preview_textures/`.
- `vercel.json` provides the CSP headers needed for scripts, workers, media, `blob:` URLs, and same-origin assets.

## After deploy

Open the Vercel HTTPS URL on mobile Chrome/Safari. The browser should ask for camera permission, then the image target can trigger the experience.
