import { pgTable, foreignKey, serial, varchar, date, integer, text, unique, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const projects = pgTable("projects", {
	projectId: serial("project_id").primaryKey().notNull(),
	projectName: varchar("project_name", { length: 255 }).notNull(),
	projectDate: date("project_date"),
	backgroundColor: varchar("background_color", { length: 7 }),
	websiteUrl: varchar("website_url", { length: 255 }),
	userId: integer("user_id"),
	clientId: integer("client_id"),
},
(table) => {
	return {
		projectsClientIdFkey: foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.clientId],
			name: "projects_client_id_fkey"
		}),
		projectsUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "projects_user_id_fkey"
		}),
	}
});

export const images = pgTable("images", {
	imageId: serial("image_id").primaryKey().notNull(),
	imagePath: varchar("image_path", { length: 255 }).notNull(),
	imageCaption: text("image_caption"),
	projectId: integer("project_id"),
},
(table) => {
	return {
		imagesProjectIdFkey: foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.projectId],
			name: "images_project_id_fkey"
		}),
	}
});

export const clients = pgTable("clients", {
	clientId: serial("client_id").primaryKey().notNull(),
	clientName: varchar("client_name", { length: 255 }).notNull(),
	clientWarpcastHandle: varchar("client_warpcast_handle", { length: 255 }),
	clientXHandle: varchar("client_x_handle", { length: 255 }),
});

export const users = pgTable("users", {
	userId: serial("user_id").primaryKey().notNull(),
	userName: varchar("user_name", { length: 255 }).notNull(),
	userWarpcastHandle: varchar("user_warpcast_handle", { length: 255 }),
	userXHandle: varchar("user_x_handle", { length: 255 }),
});

export const roles = pgTable("roles", {
	roleId: serial("role_id").primaryKey().notNull(),
	roleName: varchar("role_name", { length: 255 }).notNull(),
},
(table) => {
	return {
		rolesRoleNameKey: unique("roles_role_name_key").on(table.roleName),
	}
});

export const teammembersprojects = pgTable("teammembersprojects", {
	teamMemberId: integer("team_member_id").notNull(),
	projectId: integer("project_id").notNull(),
	roleId: integer("role_id").notNull(),
},
(table) => {
	return {
		teammembersprojectsProjectIdFkey: foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.projectId],
			name: "teammembersprojects_project_id_fkey"
		}).onDelete("cascade"),
		teammembersprojectsRoleIdFkey: foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.roleId],
			name: "teammembersprojects_role_id_fkey"
		}),
		teammembersprojectsTeamMemberIdFkey: foreignKey({
			columns: [table.teamMemberId],
			foreignColumns: [users.userId],
			name: "teammembersprojects_team_member_id_fkey"
		}).onDelete("cascade"),
		teammembersprojectsPkey: primaryKey({ columns: [table.teamMemberId, table.projectId], name: "teammembersprojects_pkey"}),
	}
});
