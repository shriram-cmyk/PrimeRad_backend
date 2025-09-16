import { relations } from "drizzle-orm/relations";
import { tblPolls, tblPollOptions } from "./schema";

export const tblPollOptionsRelations = relations(tblPollOptions, ({one}) => ({
	tblPoll: one(tblPolls, {
		fields: [tblPollOptions.pollId],
		references: [tblPolls.pollId]
	}),
}));

export const tblPollsRelations = relations(tblPolls, ({many}) => ({
	tblPollOptions: many(tblPollOptions),
}));