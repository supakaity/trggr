DO $$ BEGIN
 CREATE TYPE "trggr"."classifications" AS ENUM('ableism', 'abuse', 'bigotry', 'death', 'drugs', 'dysphoria', 'food', 'medical', 'mental', 'nsfw', 'phobias', 'politics', 'sensory', 'sex', 'suicide', 'violence', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "trggr"."content_types" AS ENUM('text', 'image', 'video', 'audio', 'link');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "trggr"."report_types" AS ENUM('spam', 'scam', 'sam', 'csam', 'troll', 'bait', 'miscat', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trggr"."reports" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" text,
	"trggr_id" text,
	"type" "trggr"."report_types" NOT NULL,
	"report" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trggr"."trggrs" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"replaced_at" timestamp,
	"deleted_at" timestamp,
	"user_id" text,
	"classification" text NOT NULL,
	"warning" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"type" "trggr"."content_types" NOT NULL,
	"replacement" text,
	"replacement_of" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trggr"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trggr"."reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "trggr"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trggr"."reports" ADD CONSTRAINT "reports_trggr_id_trggrs_id_fk" FOREIGN KEY ("trggr_id") REFERENCES "trggr"."trggrs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trggr"."trggrs" ADD CONSTRAINT "trggrs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "trggr"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_user_id_idx" ON "trggr"."reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_trggr_id_idx" ON "trggr"."reports" USING btree ("trggr_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trggrs_user_id_idx" ON "trggr"."trggrs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "trggr"."users" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "trggr"."users" USING btree ("email");