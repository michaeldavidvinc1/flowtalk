/*
  Warnings:

  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."token" DROP CONSTRAINT "token_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "last_seen" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."token";

-- DropEnum
DROP TYPE "public"."TokenType";
