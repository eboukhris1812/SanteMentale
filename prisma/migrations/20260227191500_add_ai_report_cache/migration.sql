-- CreateTable
CREATE TABLE "AiReportCache" (
    "profileHash" TEXT NOT NULL,
    "reportText" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "error" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiReportCache_pkey" PRIMARY KEY ("profileHash")
);

-- Index for periodic cleanup/reporting
CREATE INDEX "AiReportCache_expiresAt_idx" ON "AiReportCache"("expiresAt");
