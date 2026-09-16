# Dino Jump - standalone GitHub Pages edition

A camera-controlled jumping game adapted for standalone hosting. Pose detection runs in the visitor's browser with MediaPipe; there is no Gemini API call at runtime.

## Privacy-oriented runtime design

- Camera frames are processed in the browser.
- The application code does not record or upload camera video, pose landmarks, names, scores, or student IDs.
- MediaPipe JavaScript/WASM and the Pose Landmarker model are served from the same GitHub Pages site.
- The Content Security Policy restricts application network connections to the same origin.
- GitHub, as the web host, can still receive ordinary web-request metadata such as visitor IP addresses.

## Offline mode

The production build installs a service worker that caches the complete site, including the MediaPipe WASM files and Pose Landmarker model.

On the first visit, stay online until the lower-right badge says **Offline ready**. After that, the page can be refreshed or reopened without Wi-Fi, subject to normal browser cache/storage eviction. If a browser clears site data or evicts the cache, reconnect once and reload the site.

Camera processing remains local whether the device is online or offline.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload or push **everything in this folder**, including the hidden `.github` folder.
3. Use `main` as the default branch.
4. Open **Settings -> Pages** in the repository.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Open the **Actions** tab and wait for **Deploy Dino Jump to GitHub Pages** to finish.
7. Open the Pages URL shown by GitHub and allow camera access.

A project repository named `dino-jump` would normally publish at:

`https://YOUR-USERNAME.github.io/dino-jump/`

The GitHub Actions build downloads Google's documented MediaPipe Pose Landmarker Lite model during the build, copies the MediaPipe runtime files into the site, builds the application, and creates the offline cache. Visitors do not need Node.js or GitHub accounts.

## Updating

Push changes to `main`. GitHub Actions rebuilds and republishes the Pages site automatically. A new service-worker cache is generated from the contents of each build.

## Local development

First-time setup while online:

```bash
npm install
npm run setup
```

Development server:

```bash
npm run dev
```

Production/offline test:

```bash
npm run build
npm run preview
```

## Project provenance

This project is a modified standalone adaptation of the **Dino Jump** example distributed through the Google AI Studio App Gallery. Google AI Studio documentation describes gallery projects as remixable with **Copy App** and supports syncing/exporting AI Studio projects to GitHub.

Reference: https://ai.google.dev/gemini-api/docs/aistudio-build-mode

The pose technology is Google's MediaPipe Pose Landmarker. Google's documentation provides the downloadable Pose Landmarker model bundles used by this project.

Reference: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker

This repository is not an official Google product and is not endorsed by Google.

## Licensing / notices

**There is intentionally no project-wide `LICENSE` file in this repository.** This avoids asserting that the entire adapted project is available under a license that Google did not explicitly attach to the AI Studio gallery app source provided for this project.

Third-party components and model files retain their own licenses. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
