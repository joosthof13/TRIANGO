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

## Logical difficulty calibration (v3)

New puzzles are **rated by deduction difficulty**, not only clue count. TRIANGO generates a candidate, verifies that it has one solution, then solves it repeatedly using the same rule-by-rule hint deduction engine available to players.

At every step, the grader chooses an available move with the shortest complete deduction proof and records the number of placements, the longest proof, and how many multi-step proofs were needed. No guessing or backtracking is permitted in the grading path.

The resulting logic score determines the level:

| Level | Accepted logic score |
| --- | ---: |
| Relaxed | 0–34 |
| Standard | 35–49 |
| Expert | 50–66 |
| Master | 67+ |

The generator retries with deterministic, seed-derived candidates until a puzzle fits the chosen range. Each puzzle also shows its logic score under the grid. This creates **non-overlapping measured difficulty bands**, although individual people can still experience specific puzzles differently.

### Saved games and updates

Saved games created with the original puzzle generator remain playable after this update: unversioned saved puzzles are reconstructed with the original generator, while new ones use v3. Once you start a new puzzle, TRIANGO automatically uses the calibrated generator. The service worker caches `difficulty.js` for offline play; if your installed Home Screen version still looks old, fully close the app and reopen it after the Pages deployment, or refresh it online.

### Validation

Test the generator from a local checkout using `node tests/difficulty.test.cjs`. The test checks reproducibility, uniqueness, deduction-only solvability, and whether each generated puzzle falls within the correct non-overlapping score band. No npm install is necessary.

## Pause and placement sounds (v4)

- Tap **Ⅱ Pause** to freeze the timer and completely cover the grid. Nothing on the board, including given shapes or relation clues, remains visible.
- Tap **Resume game** (or the top Resume button) to reveal the existing grid again and continue from the frozen elapsed time. Keyboard shortcut: **P** to pause or resume.
- Moves, notes, undo, hints, and checks are disabled during a pause.
- A pause persists across Safari reloads and Home Screen app relaunches. The clock does not run while paused, including between sessions.
- Each shape placement now plays its own lower-pitched, bassier Cream-keyboard sound. Click **♫** in the header to mute or unmute (the preference is saved). The 3 sounds are embedded in `soundbank.js`, which is precached for offline play.
- Sounds are modified recordings from the MIT-licensed `kbsim` project by Thomas Lai; see `SOUND-LICENSE.txt`. No other third-party services or network calls are necessary to play them.

After a release, if your installed iPhone version still looks older, fully close and reopen it online to allow the updated `triango-pwa-v5` service worker to install and activate. Progress is preserved.
