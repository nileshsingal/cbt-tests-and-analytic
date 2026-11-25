# CBT Based Test Platform

Practice. Analyse. Improve.

## Local setup

Use Node.js 22.13 or later for supported development tooling. From this project folder run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run lint`, `npm test` and `npm run build` for verification.

## Exam workflow

Start the MPSC Rajyaseva Prelims demo from Available Tests and accept the instructions. Select answers and use Save & Next or Mark for Review & Next to record them. Draft changes survive refresh and navigation. Scoring uses the last saved answer, including saved answers flagged for review. Clear Response removes both the draft and saved answer and preserves the review flag. Save & Next clears the review flag. The absolute deadline persists across page reloads. Open a completed attempt from Test History to see its score and detailed solutions.

## Architecture

- `src/data` contains the JSON question bank and test configuration. The five questions are demonstration material.
- `src/types` and `src/utils/exam.ts` define the exam model, transitions, deadline calculations and scoring.
- `src/services/attempts.ts` owns LocalStorage persistence. Hooks subscribe to persisted changes and synchronize the displayed countdown with the deadline.
- `src/pages` and `src/components` implement the dashboard, CBT flow and results with React Router, Tailwind CSS and Lucide React.
- Tests exercise scoring, palette state transitions, expiry and persistence.

A future FastAPI/PostgreSQL integration can replace local attempt storage and deliver a public question projection without answer keys. Keep grading and deadlines server-authoritative at that point. Use stable question IDs to add year-wise and subject-wise collections, and extend the question type for localized content and richer question formats. Persist a test revision or question snapshot before supporting editable test banks and historical analytics.
