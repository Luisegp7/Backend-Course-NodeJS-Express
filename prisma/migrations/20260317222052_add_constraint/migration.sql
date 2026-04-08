/*
  Warnings:

  - A unique constraint covering the columns `[user_id,movie_id]` on the table `watchlist_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "watchlist_items_user_id_movie_id_key" ON "watchlist_items"("user_id", "movie_id");
