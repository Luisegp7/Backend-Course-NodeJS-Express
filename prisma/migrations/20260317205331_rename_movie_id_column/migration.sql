/*
  Warnings:

  - You are about to drop the column `movie_id` on the `watchlist_items` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `watchlist_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "watchlist_items" DROP CONSTRAINT "watchlist_items_movieId_fkey";

-- AlterTable
ALTER TABLE "watchlist_items" DROP COLUMN "movie_id",
ADD COLUMN     "movieId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "watchlist_items" ADD CONSTRAINT "watchlist_items_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
