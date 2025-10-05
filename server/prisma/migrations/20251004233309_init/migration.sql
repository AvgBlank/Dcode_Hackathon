-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "about" TEXT,
    "accessToken" TEXT,
    "twitter" TEXT,
    "linkedIn" TEXT,
    "mail" TEXT,
    "portfolio" TEXT,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
