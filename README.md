# Golden Future Cooperative Portal

Next.js application for membership applications, cooperative administration, and private member account summaries. MongoDB Atlas is the application database; the server accesses it through Next.js API routes. There is no PostgreSQL/Supabase dependency.

## Requirements

- Node.js 20.9 or later
- A MongoDB Atlas cluster and database user
- A Render account for hosted deployment

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` if you do not already have a local environment file, then fill in:
   - `MONGODB_URI`: Atlas connection string for an application database user.
   - `MONGODB_DB`: database name (defaults to `goldenfuture`).
   - `SESSION_SECRET`: random secret of at least 32 characters.
3. In Atlas, allow network access from the development machine. For Render, configure network access according to the Atlas network policy you choose. Avoid exposing the cluster to unrestricted access unless required by your deployment.
4. Run `npm run dev`.

MongoDB collections and indexes are created on first server connection. Monetary values are stored as integer minor units (kobo), never floating-point naira.

## First administrator

There is no public administrator sign-up route. Set these variables temporarily in the shell or deployment environment:

- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_NAME`
- `BOOTSTRAP_ADMIN_PASSWORD` (at least 12 characters)

Then run `npm run admin:create` from the project directory. The command refuses to overwrite an existing account. Remove the bootstrap password from the environment after the one-time command completes.

To create the first administrator on Render, open the service shell, set the bootstrap values only for that command/session, and run `npm run admin:create`. Do not put a permanent admin password in `render.yaml` or source control.

## Membership and account activation

Prospective members submit an application for review. Approval creates a member record and a one-use, seven-day password setup invitation. The admin portal displays the invitation link once; share it securely with the approved member. The token is stored hashed, and the member sets a password of at least 12 characters. Passwords are stored using bcrypt hashes and sessions use HTTP-only cookies.

Email delivery is not configured in this increment. Do not send activation links over an unprotected channel.

## Deploy to Render

This is one full-stack Next.js application, not a separate frontend and backend. The browser UI and server-side API routes are in the same project, and the API routes connect to MongoDB Atlas. Deploy it as **one Render Web Service** using the Node runtime; do not create a separate static site or backend service.

1. In GitHub, create an empty repository. Put the **contents of this `project` folder** at the repository root, including `package.json`, `package-lock.json`, `render.yaml`, and `.gitignore`. Do not include `.env`.
2. Before the first commit, check in VS Code Source Control that `.env` is ignored and is not listed as a staged file. The ignore rules exclude `.env` and `.env.*`; `.env.example` is safe to commit because it contains placeholders only.
3. Push the repository to GitHub.
4. In Render, select **New → Blueprint** and connect that GitHub repository. Render will read `render.yaml` and create a Node Web Service. Alternatively, choose **New → Web Service** and set:
   - Runtime: **Node**
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Health check path: `/api/health`
   - Root directory: `.` when the project contents are at the repository root.
5. In the Render service's **Environment** settings, add `MONGODB_URI` with the Atlas connection string and `MONGODB_DB` with `goldenfuture`. Set `SESSION_SECRET` to a unique random value of at least 32 characters. These are server-only variables; do not prefix them with `NEXT_PUBLIC_`.
6. In Atlas, ensure the database user has access to this database and the Atlas network access policy allows connections from Render. Test the deployment's `/api/health` endpoint; it should return `{"status":"ok"}`.
7. Deploy, then create or confirm the administrator account in Atlas. Use the app's `/login` page to sign in.

Render supplies the port for `next start`. `render.yaml` configures the Node Web Service and uses `/api/health` as its health check. Do not commit the local `.env`; set production secrets only in Render's Environment settings.

### Git ignore check

From the project folder, verify the local file is ignored before pushing:

```powershell
git check-ignore -v .env
git status --short
```

If `.env` was already committed to Git earlier, `.gitignore` alone will not remove it from repository history. Untrack it with `git rm --cached .env`, commit that change, and rotate the exposed MongoDB password in Atlas.

## Current application capabilities

- Public membership application submission with server-side validation.
- Admin-only application review, approval/rejection/correction requests, and member directory.
- Admin dashboard metrics derived from stored cooperative records; unrecorded figures remain zero rather than being demo values.
- Private member dashboard and member-scoped transaction queries.
- Member invitation activation and password setup.
- Audit records for membership decisions.

Financial metrics expect records in the MongoDB `transactions`, `investments`, `loans`, `loanRepayments`, `dividends`, `expenses`, and `bankAccounts` collections. Monetary fields use integer kobo and transaction records use `status: "successful"`. Existing Supabase records are not automatically migrated; export and validate them before switching a live cooperative to this database. Financial posting, payment gateway verification, accounting journals, exports, document storage, and email notifications are not implemented yet; do not use the current dashboard as a substitute for an audited set of accounts.

## Validation

- `npm run typecheck`
- `npm run build`

Before production financial use, verify cooperative registration and reporting obligations, privacy and data-retention requirements, accounting treatment, payment-provider terms, and any applicable financial-services rules with qualified professionals in the cooperative's jurisdiction. Configure Atlas backups and test restoration procedures.
