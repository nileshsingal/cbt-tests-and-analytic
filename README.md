# MPSC Test Series

Practice. Analyse. Improve.

## Local setup

Use Node.js 22.13 or later for supported development tooling. From this project folder run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run lint`, `npm test` and `npm run build` for verification.

## Exam workflow

Choose a test under Available Tests and accept the instructions. The 2025 Paper 1, Series A exam is also listed under Previous Year Papers. Select answers and use Save & Next or Mark for Review & Next to record them. Draft changes survive refresh and navigation. Scoring uses the last saved answer, including saved answers flagged for review. Clear Response removes both the draft and saved answer and preserves the review flag. Save & Next clears the review flag. The absolute deadline persists across page reloads. Open a completed attempt from Test History to see its score and detailed solutions.

The 2025 paper has 100 questions and a 120-minute timer. Correct responses earn 2 marks and incorrect responses deduct 0.5 marks. The printed maximum is 200. The practice score is out of 196 because the Series A final key cancels Questions 48 and 87. Cancelled questions remain available for review.

## Architecture

- `src/data` contains the JSON question bank and test configuration. The five-question demo and the 2025 Series A paper have separate banks and stable test IDs. The Series A bank was transcribed from the English paper and uses the final answer key.
- `src/types` and `src/utils/exam.ts` define the exam model, transitions, deadline calculations and scoring.
- `src/services/attempts.ts` owns LocalStorage persistence. Hooks subscribe to persisted changes and synchronize the displayed countdown with the deadline.
- `src/pages` and `src/components` implement the dashboard, CBT flow and results with React Router, Tailwind CSS and Lucide React.
- Tests exercise scoring, palette state transitions, expiry, persistence, and Series A answer-key integrity.

A future FastAPI/PostgreSQL integration can replace local attempt storage and deliver a public question projection without answer keys. Keep grading and deadlines server-authoritative at that point. Use stable question IDs to add year-wise and subject-wise collections, and extend the question type for localized content and richer question formats. Persist a test revision or question snapshot before supporting editable test banks and historical analytics.
