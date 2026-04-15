-- CreateIndex
CREATE INDEX idx_movies_title_lower ON "movies"(LOWER(title));
