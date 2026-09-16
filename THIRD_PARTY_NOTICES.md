# Third-party notices

This file records the principal third-party software and model assets used by this project. It is not a project-wide license.

## Google MediaPipe Tasks Vision

Component: `@mediapipe/tasks-vision`

Upstream: https://github.com/google-ai-edge/mediapipe

MediaPipe source code is distributed under the Apache License, Version 2.0. The production site includes MediaPipe WebAssembly/runtime files copied from the npm package during the build.

License: https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE

## MediaPipe Pose Landmarker / BlazePose GHUM model

The build downloads the Pose Landmarker Lite task bundle from Google's documented MediaPipe model URL:

`https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`

Google's Pose Landmarker documentation identifies this as a downloadable model bundle. The associated BlazePose GHUM model card states that the model is licensed under the Apache License, Version 2.0.

Documentation: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker

Model card: https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf

## React / React DOM

Components: `react`, `react-dom`

Upstream: https://github.com/facebook/react

License: MIT

## Tailwind CSS

Used to generate application CSS at build time.

Upstream: https://github.com/tailwindlabs/tailwindcss

License: MIT

## Other build tooling

Vite, the Vite React plugin, TypeScript, PostCSS, Autoprefixer, and Node.js type definitions are used as development/build tooling. Their licenses remain with their respective copyright holders and packages.

## Google AI Studio Dino Jump provenance

The application source originated from / was adapted from the Dino Jump example distributed through the Google AI Studio App Gallery and was subsequently modified for standalone hosting, local MediaPipe assets, stricter runtime networking, explicit camera cleanup, and offline caching.

Google AI Studio's documentation supports remixing gallery apps with **Copy App** and exporting/syncing projects to GitHub:

https://ai.google.dev/gemini-api/docs/aistudio-build-mode

No statement in this file is intended to grant rights in Google's trademarks, branding, or other materials beyond rights provided by the applicable source licenses and terms.
