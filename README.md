# Joint Friendly Workouts

A dark-mode, mobile-friendly, static workout website designed for two profiles:

- **Person A — Sciatica**
- **Person B — Knee / Hip**

The current site includes a 5-day Week 1 plan, per-exercise modifications, simple movement illustrations, treadmill guidance, and browser-only progress tracking.

## Live hosting with GitHub Pages

Repository target: `wikedawsum/joint-friendly-workout`

1. Create a new **public** GitHub repository named `joint-friendly-workout`.
2. Upload all files and folders from this project to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then save.
6. GitHub will show the published site URL after deployment completes.

For this username/repository combination, the expected Pages URL is:

`https://wikedawsum.github.io/joint-friendly-workout/`

## Local preview

You can simply open `index.html` in a browser, or run a local static web server.

## Adding future weeks

Workout data lives in `data/workouts.js`.

The Week 1 structure is:

```js
window.WORKOUT_WEEKS = {
  1: {
    title: "Week 1 — Baseline & Comfort",
    days: [ /* five workout days */ ]
  }
};
```

Add future weeks using the same shape. The current interface shows placeholders for Weeks 2–4; the navigation can be enabled as new week data is added.

## Progress storage

Checkmarks, pain ratings, difficulty, and notes are saved with browser `localStorage`. This means:

- No account is required.
- No personal data is sent anywhere.
- Each person/device has its own progress.
- Clearing browser/site data resets progress.

## Medical note

This project is educational and is not medical advice. Exercises should be adjusted or stopped when they cause sharp joint pain, increasing swelling, or worsening/radiating nerve symptoms. People with severe joint disease, planned joint replacement, or persistent sciatica should follow guidance from their physician or physical therapist when available.
