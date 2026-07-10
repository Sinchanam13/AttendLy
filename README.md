# AttendLy



A small attendance and leave tracker. Employees mark daily attendance and

request leave; managers approve or reject requests and see a live dashboard

across the team. Built with Angular (TypeScript, strict mode) and Firebase

(Firestore + Auth).



## Login



There are no pre-seeded accounts — Firebase Auth needs a real project before

any account can exist. Open the app and use **"Don't have an account? Sign

up"** to create one. At sign-up you choose a role (Employee or Manager),

which is stored on your profile and decides which dashboard you land on.



Suggested demo accounts, if you want two side by side:



| Role     | Email                  | Password   |

| -------- | ----------------------- | ---------- |

| Employee | employee@gmail.com | employee@123 |

| Manager  | manager@gmail.com  | manager@123 |



Create both through the sign-up form once, then sign in with either at any

time. Firebase Auth password rules require at least 6 characters.



## Using the app



**As an employee** (`/employee`):

- Mark attendance for a date with a status of present, absent.

  Marking the same date again overwrites that day's record (edit), and a

  delete button removes it.

- Submit a leave request with a date range and a reason. It starts as

  "pending" and updates live once a manager decides on it.

- The top summary shows present days for the selected month and your

  pending request count. Switch months with the month picker.



**As a manager** (`/manager`):

- See every leave request across the team and approve or reject each pending

  one. Approvals/rejections write back instantly and the employee sees the

  new status live.

- See attendance records for the whole team, filterable by month and by

  employee.

- The top summary shows total present days for the current filter and how

  many requests are still pending.



Everything updates live: Firestore's `onSnapshot` listeners push changes to

every open tab without a refresh.



## Project structure



```

src/app/

  core/

    firebase.ts              Firebase app/auth/firestore initialization

    models/                  AppUser, AttendanceRecord, LeaveRequest types

    services/                AuthService, AttendanceService, LeaveService

    guards/                  authGuard, managerGuard

  features/

    login/                   Sign in / sign up

    employee/employee-dashboard/   Mark attendance + request leave + own history

    manager/manager-dashboard/     Team-wide attendance + leave approvals

  shared/navbar/              Top bar with role + sign out

firestore.rules               Security rules (see below)

firestore.indexes.json        Composite index for attendance queries

firebase.json                 Hosting + Firestore deploy config

```



Kept deliberately flat: one service per collection, one component per

screen, no state-management library. See the written explanation (Part 2)

for the reasoning behind that and what would change at higher scale.



## Data model



**`attendance/{uid}_{date}`** — one document per employee per day, so

re-marking a day is a single `setDoc` overwrite rather than a query-then-update:

```

{ uid, employeeName, date: "YYYY-MM-DD", status: "present" | "absent" | "half-day", createdAt }

```



**`leave/{autoId}`**:

```

{ uid, employeeName, from: "YYYY-MM-DD", to: "YYYY-MM-DD", reason, status: "pending" | "approved" | "rejected", createdAt, decidedAt? }

```



**`users/{uid}`** — created once at sign-up, used to resolve name/role:

```

{ uid, email, name, role: "employee" | "manager" }

```



## Setting up your own Firebase project



This repo ships with placeholder Firebase config (`src/environments/`) since

a real project can't be created on your behalf. To run it:



1. **Create a Firebase project** at https://console.firebase.google.com.

2. **Add a Web app** inside the project (the `</>` icon on the project

   overview page) and copy the generated `firebaseConfig` object.

3. **Paste those values** into `src/environments/environment.ts` and

   `src/environments/environment.prod.ts`.

4. **Enable Authentication → Sign-in method → Email/Password.**

5. **Create a Firestore database** (Build → Firestore Database → Create

   database, start in production mode — the rules below define access).

6. **Deploy the security rules and index** (or paste `firestore.rules` into

   the Firestore console's Rules tab, and let the app prompt you to create

   the composite index the first time a query needs it — Firestore gives you

   a direct console link the first time this happens):

   ```

   npm install -g firebase-tools

   firebase login

   firebase use --add        # pick your project, alias "default"

   firebase deploy --only firestore:rules,firestore:indexes

   ```



## Running locally



```

npm install

npm start          # ng serve, http://localhost:4200

```



## Deploying



Firebase Hosting is the path of least resistance since it's already wired

into `firebase.json`:



```

npm run build                                # outputs to dist/attendly/browser

firebase deploy --only hosting,firestore

```



Any static host works too (Vercel, Netlify, GitHub Pages) — just point it at

`dist/attendly/browser` after `npm run build`. Firestore/Auth are unaffected

by where the frontend is hosted, since the browser talks to Firebase

directly.



## Security rules summary



- A user can only create their own `users/{uid}` profile, and can't change

  their role afterward.

- An employee can read/write only their own attendance and leave documents.

- A manager (role looked up from their own `users` doc) can read everyone's

  attendance and leave records, but can only update a leave document's

  `status`/`decidedAt` fields — not rewrite the request itself.



## Tech



Angular 18 (standalone components, signals, new control-flow syntax),

TypeScript strict mode, Firebase JS SDK (Auth + Firestore, no AngularFire —

kept the dependency surface small for this scope), plain SCSS with CSS

custom properties (no UI framework).
