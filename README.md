# Rock 8th Wall Vercel

Static Vercel-ready copy of the recovered 8th Wall/A-Frame WebAR experience.

## Deploy

Import this folder/repository in Vercel and deploy with:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`

Vercel serves the site over HTTPS automatically, which is required for mobile camera access.

## Important

- The app uses `src/assets/rock_preview_external_textures.glb`.
- The original embedded-texture GLB is intentionally not included in this Vercel copy.
- Model textures are normal PNG files in `src/assets/rock_preview_textures/`.
- `vercel.json` includes the CSP needed for 8th Wall/A-Frame runtime scripts, workers, media, and textures.

## Local Preview

```sh
npm run serve
```

Then open `http://localhost:8080`.
