import { relations } from "drizzle-orm/relations";
import { clients, projects, users, images, teammembersprojects, roles } from "./schema";

export const projectsRelations = relations(projects, ({one, many}) => ({
	client: one(clients, {
		fields: [projects.clientId],
		references: [clients.clientId]
	}),
	user: one(users, {
		fields: [projects.userId],
		references: [users.userId]
	}),
	images: many(images),
	teammembersprojects: many(teammembersprojects),
}));

export const clientsRelations = relations(clients, ({many}) => ({
	projects: many(projects),
}));

export const usersRelations = relations(users, ({many}) => ({
	projects: many(projects),
	teammembersprojects: many(teammembersprojects),
}));

export const imagesRelations = relations(images, ({one}) => ({
	project: one(projects, {
		fields: [images.projectId],
		references: [projects.projectId]
	}),
}));

export const teammembersprojectsRelations = relations(teammembersprojects, ({one}) => ({
	project: one(projects, {
		fields: [teammembersprojects.projectId],
		references: [projects.projectId]
	}),
	role: one(roles, {
		fields: [teammembersprojects.roleId],
		references: [roles.roleId]
	}),
	user: one(users, {
		fields: [teammembersprojects.teamMemberId],
		references: [users.userId]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	teammembersprojects: many(teammembersprojects),
}));