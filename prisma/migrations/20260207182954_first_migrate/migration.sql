-- CreateTable
CREATE TABLE "PachinkoEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playedOn" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "parlor" TEXT NOT NULL,
    "machine" TEXT NOT NULL,
    "inAmount" INTEGER NOT NULL,
    "outAmount" INTEGER NOT NULL,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PachinkoEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PachinkoEntry_userId_playedOn_idx" ON "PachinkoEntry"("userId", "playedOn");

-- CreateIndex
CREATE INDEX "PachinkoEntry_userId_yearMonth_idx" ON "PachinkoEntry"("userId", "yearMonth");
