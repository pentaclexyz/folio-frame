/*
  Warnings:

  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_member_project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_client_id_fkey";

-- DropForeignKey
ALTER TABLE "team_member_project" DROP CONSTRAINT "team_member_project_project_id_fkey";

-- DropForeignKey
ALTER TABLE "team_member_project" DROP CONSTRAINT "team_member_project_role_id_fkey";

-- DropForeignKey
ALTER TABLE "team_member_project" DROP CONSTRAINT "team_member_project_user_id_fkey";

-- DropTable
DROP TABLE "client";

-- DropTable
DROP TABLE "image";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "team_member_project";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "projects" (
    "project_id" SERIAL NOT NULL,
    "project_name" TEXT NOT NULL,
    "project_date" TEXT NOT NULL,
    "background_color" TEXT,
    "website_url" TEXT,
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "clients" (
    "client_id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_warpcast_handle" TEXT,
    "client_x_handle" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "images" (
    "image_id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_caption" TEXT,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_warpcast_handle" TEXT,
    "user_x_handle" TEXT,
    "user_fid" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "team_members_projects" (
    "team_member_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "team_members_projects_pkey" PRIMARY KEY ("team_member_id","project_id","role_id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members_projects" ADD CONSTRAINT "team_members_projects_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members_projects" ADD CONSTRAINT "team_members_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members_projects" ADD CONSTRAINT "team_members_projects_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
