# TRIANGO — installable iPhone web app (Windows-friendly)

This is an installable Progressive Web App (PWA), based on the HTML game, NOT a native Swift/iOS application. It runs in Safari and opens in its own Home Screen window once installed. It requires no Mac, Xcode, or paid Apple Developer membership.

## Publish from Windows (GitHub Pages)

1. Extract this ZIP on your Windows computer.
2. Sign in to https://github.com and create a new **public** repository (for example `triango-game`). Do not add a README at creation.
3. On the new repository page, choose **uploading an existing file**, then drag the **contents** of this extracted folder into GitHub (index.html, manifest.webmanifest, service-worker.js, and the icons folder), and commit. Keep the files at the repository root, not inside a nested `TRIANGO_iPhone_PWA` directory.
4. Go to **Settings > Pages**. Under Build and deployment, select **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
5. Open the published URL shown on the Pages screen. For a project repository it generally looks like `https://YOUR-USERNAME.github.io/triango-game/`.

## Install on iPhone

1. Open the published HTTPS URL in **Safari on your iPhone**.
2. Tap **Share**, then **Add to Home Screen** (or locate this through the Share menu actions).
3. Enable **Open as Web App** if the option is shown, then tap **Add**.
4. Launch TRIANGO using its Home Screen icon. After its first successful load, the app works offline.

Game progress is stored on the device in local browser/Web App storage. It may be lost if you clear website data or remove the web app. It is not synced across devices. GitHub Pages is public hosting: do not upload secrets.

## Try on Windows without publishing

Open `index.html` in a browser. The game is playable immediately, but install/offline caching generally requires HTTPS (or localhost). You can also preview the folder using `python -m http.server 8000` on Windows, then visit http://localhost:8000.

## Updating

Replace the hosted files with the updated versions. For service-worker cache updates, change `triango-pwa-v1` in `service-worker.js` to a new version number to trigger cache refresh. Avoid clearing site data if you want to retain saved progress.
