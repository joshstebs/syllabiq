SyllabiQ is a [Next.js](https://nextjs.org) academic planning app with Prisma/Postgres-backed accounts, sessions, courses, and tasks.

## Production setup

Set `DATABASE_URL`, `SESSION_SECRET`, and the provider credentials in `.env.local` or the deployment environment. Apply the tracked schema before serving authenticated traffic:

```bash
npm ci
npm run db:migrate
npm run build
```

Without `DATABASE_URL`, a production deployment stays in read-only visitor mode and account/write endpoints return a clear `503` configuration response. Local development may use the existing demo store for UI work; it does not create client-side accounts.

## Stripe billing setup (Pro semester passes)

Checkout charges a one-time **$8 CAD** for one semester: September–January,
February–April, or May–July. The pass expires at the end of its selected
semester and does not renew automatically. Checkout uses inline Stripe price
data, so no recurring Stripe Price ID is needed.

1. In the Vercel project env vars (Production), set `STRIPE_SECRET_KEY`
   to the live secret key.
2. In Stripe dashboard → Developers → Webhooks, add endpoint
   `https://syllabiq.ca/api/stripe/webhook` subscribed to
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, and `customer.subscription.deleted`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Keep the customer portal enabled for legacy monthly subscribers.

New semester passes are one-time payments. Legacy monthly subscriptions
remain manageable through the customer portal until those subscribers cancel.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
