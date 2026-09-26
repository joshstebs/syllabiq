-- Per-user Stripe billing fields on users; syllabus storageUrl becomes optional
-- (ingest/commit has no stored file URL for logged-in users).
ALTER TABLE "users" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "users" ADD COLUMN "stripeSubscriptionId" TEXT;
ALTER TABLE "users" ADD COLUMN "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE';
ALTER TABLE "users" ADD COLUMN "subscriptionStatus" TEXT;
ALTER TABLE "users" ADD COLUMN "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "currentPeriodEnd" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

ALTER TABLE "syllabus_documents" ALTER COLUMN "storageUrl" DROP NOT NULL;
