-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "remote_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" SERIAL NOT NULL,
    "remote_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "remote_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "likes" INTEGER NOT NULL DEFAULT 0,
    "author_id" INTEGER NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "parent_comment_id" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_remote_id_key" ON "users"("remote_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_remote_id_key" ON "blogs"("remote_id");

-- CreateIndex
CREATE UNIQUE INDEX "comments_remote_id_key" ON "comments"("remote_id");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
