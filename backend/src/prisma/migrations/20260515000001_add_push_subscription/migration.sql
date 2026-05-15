CREATE TABLE IF NOT EXISTS "PushSubscription" (
    "id"        SERIAL       NOT NULL,
    "userId"    TEXT         NOT NULL,
    "endpoint"  TEXT         NOT NULL,
    "p256dh"    TEXT         NOT NULL,
    "auth"      TEXT         NOT NULL,
    "enabled"   BOOLEAN      NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");
CREATE INDEX IF NOT EXISTS "PushSubscription_userId_idx" ON "PushSubscription"("userId");
