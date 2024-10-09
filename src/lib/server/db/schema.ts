import { classificationsList, contentTypesList, reportTypeList } from '../../types';
import { index, pgSchema, text, timestamp } from 'drizzle-orm/pg-core';

const schema = pgSchema('trggr');

export const classifications = schema.enum(
	'classifications',
	Object.keys(classificationsList) as [string, ...string[]],
);

export const contentTypes = schema.enum(
	'content_types',
	Object.keys(contentTypesList) as [string, ...string[]],
);

export const reportTypes = schema.enum(
	'report_types',
	Object.keys(reportTypeList) as [string, ...string[]],
);

export const users = schema.table('users', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
	username: text('username').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
}, (table) => ({
	usernameIndex: index('users_username_idx').on(table.username),
	emailIndex: index('users_email_idx').on(table.email),
}));

export const trggrs = schema.table('trggrs', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	replacedAt: timestamp('replaced_at'),
	deletedAt: timestamp('deleted_at'),
	userId: text('user_id').references(() => users.id),
	classification: text('classification').notNull(),
	warning: text('warning').notNull(),
	description: text('description').notNull(),
	content: text('content').notNull(),
	type: contentTypes('type').notNull(),
	replacement: text('replacement'),
	replacementOf: text('replacement_of'),
}, (table) => ({
	userIdIndex: index('trggrs_user_id_idx').on(table.userId),
}));

export const reports = schema.table('reports', {
	id: text('id').primaryKey(),
	createdAt: timestamp('created_at').defaultNow(),
	userId: text('user_id').references(() => users.id),
	trggrId: text('trggr_id').references(() => trggrs.id),
	type: reportTypes('type').notNull(),
	report: text('report').notNull(),
}, (table) => ({
	userIdIndex: index('reports_user_id_idx').on(table.userId),
	trggrIdIndex: index('reports_trggr_id_idx').on(table.trggrId),
}));