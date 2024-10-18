-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "projects" (
	"project_id" serial PRIMARY KEY NOT NULL,
	"projectname" varchar(255) NOT NULL,
	"projectdate" date,
	"backgroundcolor" varchar(7),
	"websiteurl" varchar(255),
	"user_id" integer,
	"client_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"image_id" serial PRIMARY KEY NOT NULL,
	"imagepath" varchar(255) NOT NULL,
	"imagecaption" text,
	"project_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"client_id" serial PRIMARY KEY NOT NULL,
	"clientname" varchar(255) NOT NULL,
	"clientwarpcasthandle" varchar(255),
	"clientxhandle" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"userwarpcasthandle" varchar(255),
	"userxhandle" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(255) NOT NULL,
	CONSTRAINT "roles_role_name_key" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teammembersprojects" (
	"team_member_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "teammembersprojects_pkey" PRIMARY KEY("team_member_id","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembersprojects" ADD CONSTRAINT "teammembersprojects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembersprojects" ADD CONSTRAINT "teammembersprojects_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teammembersprojects" ADD CONSTRAINT "teammembersprojects_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/