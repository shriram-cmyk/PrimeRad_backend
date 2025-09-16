import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, int, varchar, timestamp, float, date, mysqlEnum, longtext, datetime, text, unique, foreignKey, time } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const tblActivityLog = mysqlTable("tbl_activity_log", {
	activityId: int("activity_id").autoincrement().notNull(),
	regId: varchar("reg_id", { length: 50 }),
	programId: varchar("program_id", { length: 50 }),
	batchId: varchar("batch_id", { length: 50 }),
	page: varchar({ length: 100 }),
	sessionId: varchar("session_id", { length: 100 }),
	ipAddress: varchar("ip_address", { length: 100 }),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.activityId], name: "tbl_activity_log_activity_id"}),
]);

export const tblAdmin = mysqlTable("tbl_admin", {
	adminId: int("admin_id").autoincrement().notNull(),
	adminName: varchar("admin_name", { length: 50 }).notNull(),
	adminEmail: varchar("admin_email", { length: 100 }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.adminId], name: "tbl_admin_admin_id"}),
]);

export const tblAdvancePayment = mysqlTable("tbl_advance_payment", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	paymentOption: varchar("payment_option", { length: 50 }).notNull(),
	designation: varchar({ length: 50 }).notNull(),
	currency: varchar({ length: 50 }).notNull(),
	advanceAmount: float("advance_amount").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	paymentDate: date("payment_date", { mode: 'string' }).notNull(),
	paymentId: varchar("payment_id", { length: 255 }).notNull(),
	invoiceNumber: int("invoice_number").default(0).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	purchaseStatus: mysqlEnum("purchase_status", ['0','1']).notNull(),
	reason: longtext(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	modifiedDate: date("modified_date", { mode: 'string' }),
	createdDate: datetime("created_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_advance_payment_id"}),
]);

export const tblAnnouncement = mysqlTable("tbl_announcement", {
	announcementId: int("announcement_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id"),
	subject: varchar({ length: 250 }).notNull(),
	message: text(),
	sentStatus: mysqlEnum("sent_status", ['1','0']).notNull(),
	sentDate: datetime("sent_date", { mode: 'string'}),
	sentNumber: int("sent_number"),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.announcementId], name: "tbl_announcement_announcement_id"}),
]);

export const tblAnnouncementMap = mysqlTable("tbl_announcement_map", {
	announcementMapId: int("announcement_map_id").autoincrement().notNull(),
	announcementId: int("announcement_id").notNull(),
	regId: int("reg_id").notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.announcementMapId], name: "tbl_announcement_map_announcement_map_id"}),
]);

export const tblAssessmentQuestion = mysqlTable("tbl_assessment_question", {
	assessmentQuestionId: int("assessment_question_id").autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	assessmentQuestion: varchar("assessment_question", { length: 1000 }).notNull(),
	assessmentQuestionDescription: varchar("assessment_question_description", { length: 1000 }).notNull(),
	answerOptionA: varchar("answer_option_a", { length: 500 }).notNull(),
	answerOptionB: varchar("answer_option_b", { length: 500 }).notNull(),
	answerOptionC: varchar("answer_option_c", { length: 500 }).notNull(),
	answerOptionD: varchar("answer_option_d", { length: 500 }).notNull(),
	questionImage: varchar("question_image", { length: 100 }).default('default_image'),
	correctAnswer: varchar("correct_answer", { length: 50 }).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.assessmentQuestionId], name: "tbl_assessment_question_assessment_question_id"}),
]);

export const tblAssessmentUseranswer = mysqlTable("tbl_assessment_useranswer", {
	assessmentAnswerId: int("assessment_answer_id").autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	assessmentQuestionId: int("assessment_question_id").notNull(),
	regId: int("reg_id").notNull(),
	assessmentAnswer: varchar("assessment_answer", { length: 100 }).notNull(),
	score: int().notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.assessmentAnswerId], name: "tbl_assessment_useranswer_assessment_answer_id"}),
]);

export const tblBatch = mysqlTable("tbl_batch", {
	batchProgramId: int("batch_program_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	batchStartdate: date("batch_startdate", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	batchEnddate: date("batch_enddate", { mode: 'string' }).notNull(),
	delegateDiscountType: mysqlEnum("delegate_discount_type", ['1','2']),
	delegateDiscount: float("delegate_discount").notNull(),
	usdDelegateDiscountType: mysqlEnum("usd_delegate_discount_type", ['1','2']),
	usdDelegateDiscount: float("usd_delegate_discount").notNull(),
	userDiscountType: mysqlEnum("user_discount_type", ['1','2']),
	userDiscount: float("user_discount").notNull(),
	usdUserDiscountType: mysqlEnum("usd_user_discount_type", ['1','2']),
	usdUserDiscount: float("usd_user_discount").notNull(),
	refereeDiscountType: mysqlEnum("referee_discount_type", ['1','2']),
	refereeDiscount: float("referee_discount").notNull(),
	usdRefereeDiscountType: mysqlEnum("usd_referee_discount_type", ['1','2']),
	usdRefereeDiscount: float("usd_referee_discount").notNull(),
	salesPage: mysqlEnum("sales_page", ['Yes','No']).notNull(),
	consumptionPage: mysqlEnum("consumption_page", ['Yes','No']).notNull(),
	programImage: varchar("program_image", { length: 100 }),
	programVideo: varchar("program_video", { length: 500 }),
	programDuration: varchar("program_duration", { length: 50 }),
	phases: int(),
	modules: int(),
	videos: int(),
	dicom: int(),
	assessments: int(),
	meetings: int(),
	pdfs: int(),
	certificates: int(),
	batchImage: varchar("batch_image", { length: 255 }),
	status: mysqlEnum(['1','0']).notNull(),
	bonuslectureStatus: mysqlEnum("bonuslecture_status", ['Yes','No']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.batchProgramId], name: "tbl_batch_batch_program_id"}),
]);

export const tblBatchModuleMap = mysqlTable("tbl_batch_module_map", {
	batchModuleMapId: int("batch_module_map_id").autoincrement().notNull(),
	batchId: int("batch_id").notNull(),
	moduleId: int("module_id").notNull(),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.batchModuleMapId], name: "tbl_batch_module_map_batch_module_map_id"}),
	unique("batch_id").on(table.batchId, table.moduleId),
]);

export const tblBatchPhaseMap = mysqlTable("tbl_batch_phase_map", {
	batchPhaseMapId: int("batch_phase_map_id").autoincrement().notNull(),
	batchId: int("batch_id").notNull(),
	phaseId: int("phase_id").notNull(),
	viewPhaseName: varchar("view_phase_name", { length: 50 }),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.batchPhaseMapId], name: "tbl_batch_phase_map_batch_phase_map_id"}),
	unique("batch_id").on(table.batchId, table.phaseId),
]);

export const tblBlog = mysqlTable("tbl_blog", {
	id: int().autoincrement().notNull(),
	moduleId: int("module_id").notNull(),
	tags: longtext(),
	blogTitle: varchar("blog_title", { length: 100 }).notNull(),
	blogDescription: longtext("blog_description").notNull(),
	blogImage: varchar("blog_image", { length: 255 }),
	urlSlug: varchar("url_slug", { length: 255 }),
	metaTitle: varchar("meta_title", { length: 255 }),
	metaDescription: longtext("meta_description"),
	viewCount: varchar("view_count", { length: 50 }).default('0').notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_blog_id"}),
]);

export const tblBlogComments = mysqlTable("tbl_blog_comments", {
	id: int().autoincrement().notNull(),
	blogId: int("blog_id").notNull(),
	regId: int("reg_id").notNull(),
	comment: longtext().notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
	status: mysqlEnum(['0','1']).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_blog_comments_id"}),
]);

export const tblBlogTags = mysqlTable("tbl_blog_tags", {
	id: int().autoincrement().notNull(),
	tagName: varchar("tag_name", { length: 255 }).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_blog_tags_id"}),
]);

export const tblBonuslecturesMap = mysqlTable("tbl_bonuslectures_map", {
	id: int().autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_bonuslectures_map_id"}),
]);

export const tblCookies = mysqlTable("tbl_cookies", {
	cookieId: int("cookie_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	cookieValue: varchar("cookie_value", { length: 10 }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.cookieId], name: "tbl_cookies_cookie_id"}),
]);

export const tblCountryCurrency = mysqlTable("tbl_country_currency", {
	currencyId: int("currency_id").autoincrement().notNull(),
	batchId: int("batch_id"),
	countryName: varchar("country_name", { length: 100 }).notNull(),
	countryCode: varchar("country_code", { length: 10 }).notNull(),
	countryTier: varchar("country_tier", { length: 10 }).notNull(),
	currency: varchar({ length: 10 }).notNull(),
	fullAmount: int("full_amount").notNull(),
	fullAmountDiscounted: int("full_amount_discounted").notNull(),
	instaAmount: int("insta_amount").notNull(),
	instaAmountTranche: int("insta_amount_tranche").notNull(),
	instaAmountDiscounted: int("insta_amount_discounted").notNull(),
	instaAmountDiscountedTranche: int("insta_amount_discounted_tranche").notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.currencyId], name: "tbl_country_currency_currency_id"}),
]);

export const tblCountryTiers = mysqlTable("tbl_country_tiers", {
	countryId: int("country_id").autoincrement().notNull(),
	countryName: varchar("country_name", { length: 100 }).notNull(),
	countryCode: varchar("country_code", { length: 10 }).notNull(),
	countryTier: varchar("country_tier", { length: 10 }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.countryId], name: "tbl_country_tiers_country_id"}),
]);

export const tblCoupons = mysqlTable("tbl_coupons", {
	couponId: int("coupon_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id"),
	couponName: varchar("coupon_name", { length: 100 }).notNull(),
	couponCode: varchar("coupon_code", { length: 50 }).notNull(),
	designation: varchar({ length: 100 }),
	paymentOption: varchar("payment_option", { length: 50 }).notNull(),
	discountType: mysqlEnum("discount_type", ['1','0']),
	inrDiscount: int("inr_discount").default(0).notNull(),
	usdDiscount: int("usd_discount").notNull(),
	countryTier: varchar("country_tier", { length: 10 }).default('0').notNull(),
	totalCoupons: int("total_coupons").notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	expiryDate: date("expiry_date", { mode: 'string' }).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.couponId], name: "tbl_coupons_coupon_id"}),
]);

export const tblCrsections = mysqlTable("tbl_crsections", {
	crsectionId: int("crsection_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	crsectionName: varchar("crsection_name", { length: 500 }).notNull(),
	crsectionDescription: text("crsection_description"),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.crsectionId], name: "tbl_crsections_crsection_id"}),
]);

export const tblDicomObsTitles = mysqlTable("tbl_dicom_obs_titles", {
	obsTitleId: int("obs_title_id").autoincrement().notNull(),
	programType: mysqlEnum("program_type", ['0','1']).notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	phaseId: int("phase_id"),
	moduleId: int("module_id"),
	sessionId: int("session_id"),
	observationTitle: text("observation_title"),
	facultyObservation: longtext("faculty_observation"),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.obsTitleId], name: "tbl_dicom_obs_titles_obs_title_id"}),
]);

export const tblDicomObservationTitles = mysqlTable("tbl_dicom_observation_titles", {
	dicomObservationTitlesId: int("dicom_observation_titles_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	sessionId: int("session_id").notNull(),
	observationTitle1: varchar("observation_title1", { length: 500 }).default('na'),
	observationTitle2: varchar("observation_title2", { length: 500 }).default('na'),
	observationTitle3: varchar("observation_title3", { length: 500 }).default('na'),
	observationTitle4: varchar("observation_title4", { length: 500 }).default('na'),
	observationTitle5: varchar("observation_title5", { length: 500 }).default('na'),
	observationTitle6: varchar("observation_title6", { length: 500 }).default('na'),
	observationTitle7: varchar("observation_title7", { length: 500 }).default('na'),
	observationTitle8: varchar("observation_title8", { length: 500 }).default('na'),
	observationTitle9: varchar("observation_title9", { length: 500 }).default('na'),
	observationTitle10: varchar("observation_title10", { length: 500 }).default('na'),
	facultyObservation: text("faculty_observation"),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.dicomObservationTitlesId], name: "tbl_dicom_observation_titles_dicom_observation_titles_id"}),
]);

export const tblDicomUserObs = mysqlTable("tbl_dicom_user_obs", {
	userObsId: int("user_obs_id").autoincrement().notNull(),
	obsTitleId: int("obs_title_id").notNull(),
	regId: int("reg_id").notNull(),
	userObs: longtext("user_obs"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.userObsId], name: "tbl_dicom_user_obs_user_obs_id"}),
	unique("obs_title_user").on(table.obsTitleId, table.regId),
]);

export const tblDicomUserObsSubmit = mysqlTable("tbl_dicom_user_obs_submit", {
	userObsSubmitId: int("user_obs_submit_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	sessionId: int("session_id").notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.userObsSubmitId], name: "tbl_dicom_user_obs_submit_user_obs_submit_id"}),
]);

export const tblDicomUserObservations = mysqlTable("tbl_dicom_user_observations", {
	dicomUserObservationsId: int("dicom_user_observations_id").autoincrement().notNull(),
	dicomObservationTitlesId: int("dicom_observation_titles_id").notNull(),
	regId: int("reg_id").notNull(),
	moduleId: int("module_id").notNull(),
	sessionId: int("session_id").notNull(),
	observation1: varchar({ length: 1000 }).default('na'),
	observation2: varchar({ length: 1000 }).default('na'),
	observation3: varchar({ length: 1000 }).default('na'),
	observation4: varchar({ length: 1000 }).default('na'),
	observation5: varchar({ length: 1000 }).default('na'),
	observation6: varchar({ length: 1000 }).default('na'),
	observation7: varchar({ length: 1000 }).default('na'),
	observation8: varchar({ length: 1000 }).default('na'),
	observation9: varchar({ length: 1000 }).default('na'),
	observation10: varchar({ length: 1000 }).default('na'),
	saveSubmit: mysqlEnum("save_submit", ['1','0']).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.dicomUserObservationsId], name: "tbl_dicom_user_observations_dicom_user_observations_id"}),
]);

export const tblEmailNotifications = mysqlTable("tbl_email_notifications", {
	emailNotificationId: int("email_notification_id").autoincrement().notNull(),
	queryResponseId: int("query_response_id"),
	resourcehubcontentId: int("resourcehubcontent_id"),
	emailStatus: mysqlEnum("email_status", ['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.emailNotificationId], name: "tbl_email_notifications_email_notification_id"}),
]);

export const tblExtReferral = mysqlTable("tbl_ext_referral", {
	id: int().autoincrement().notNull(),
	referralName: varchar("referral_name", { length: 100 }).notNull(),
	userIp: varchar("user_ip", { length: 50 }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_ext_referral_id"}),
]);

export const tblExtendaccessPayment = mysqlTable("tbl_extendaccess_payment", {
	id: int().autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	trackAccess: varchar("track_access", { length: 50 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	accessStartdate: date("access_startdate", { mode: 'string' }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	accessEnddate: date("access_enddate", { mode: 'string' }).notNull(),
	currency: varchar({ length: 50 }).notNull(),
	payAmount: float("pay_amount").notNull(),
	taxes: float().notNull(),
	finalAmount: float("final_amount").notNull(),
	pgEmail: varchar("pg_email", { length: 255 }),
	pgMobile: varchar("pg_mobile", { length: 50 }),
	pgCurrency: varchar("pg_currency", { length: 50 }),
	pgAmount: float("pg_amount").notNull(),
	paymentEntry: varchar("payment_entry", { length: 100 }).notNull(),
	paySession: varchar("pay_session", { length: 255 }),
	paymentId: varchar("payment_id", { length: 255 }),
	payStatus: varchar("pay_status", { length: 155 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	paymentDate: date("payment_date", { mode: 'string' }).notNull(),
	orderId: varchar("order_id", { length: 255 }).notNull(),
	orderStatus: varchar("order_status", { length: 155 }),
	invoiceNumber: varchar("invoice_number", { length: 50 }),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
	createdDate: datetime("created_date", { mode: 'string'}),
	accessStatus: mysqlEnum("access_status", ['1','0']).notNull(),
	accessStatusModified: datetime("access_status_modified", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_extendaccess_payment_id"}),
]);

export const tblFaculty = mysqlTable("tbl_faculty", {
	facultyId: int("faculty_id").autoincrement().notNull(),
	facultyName: varchar("faculty_name", { length: 100 }).notNull(),
	facultyLocation: varchar("faculty_location", { length: 100 }),
	facultyCountry: varchar("faculty_country", { length: 50 }),
	facultyImage: varchar("faculty_image", { length: 100 }),
	facultyDescription: varchar("faculty_description", { length: 500 }),
	facultyEmail: varchar("faculty_email", { length: 100 }),
	facultyPassword: varchar("faculty_password", { length: 100 }),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.facultyId], name: "tbl_faculty_faculty_id"}),
]);

export const tblFacultyCaseassign = mysqlTable("tbl_faculty_caseassign", {
	id: int().autoincrement().notNull(),
	caseId: int("case_id").notNull(),
	assignedFaculty: int("assigned_faculty").notNull(),
	caseApprovedBy: varchar("case_approved_by", { length: 50 }),
	facultyStatus: mysqlEnum("faculty_status", ['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_faculty_caseassign_id"}),
]);

export const tblFacultyMap = mysqlTable("tbl_faculty_map", {
	facultyMapId: int("faculty_map_id").autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	facultyId: int("faculty_id").notNull(),
	facultyType: varchar("faculty_type", { length: 100 }),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.facultyMapId], name: "tbl_faculty_map_faculty_map_id"}),
]);

export const tblHandson = mysqlTable("tbl_handson", {
	handsonId: int("handson_id").autoincrement().notNull(),
	centerName: varchar("center_name", { length: 100 }).notNull(),
	location: varchar({ length: 100 }).notNull(),
	mapAddress: longtext("map_address"),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.handsonId], name: "tbl_handson_handson_id"}),
]);

export const tblInsights = mysqlTable("tbl_insights", {
	insightsId: int("insights_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	sessionId: int("session_id").notNull(),
	message: varchar({ length: 1000 }).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	showStatus: mysqlEnum("show_status", ['1','0']).notNull(),
},
(table) => [
	primaryKey({ columns: [table.insightsId], name: "tbl_insights_insights_id"}),
]);

export const tblInstallmentPayments = mysqlTable("tbl_installment_payments", {
	paymentId: int("payment_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id"),
	paidFor: int("paid_for").notNull(),
	programName: varchar("program_name", { length: 100 }).notNull(),
	paymentOption: varchar("payment_option", { length: 50 }).default('Installment').notNull(),
	installmentCount: varchar("installment_count", { length: 50 }).notNull(),
	programAmount: varchar("program_amount", { length: 50 }).notNull(),
	salesCommitAmount: float("sales_commit_amount").notNull(),
	salesCommitAmountWithtax: float("sales_commit_amount_withtax").notNull(),
	couponCode: varchar("coupon_code", { length: 50 }),
	discountAmount: varchar("discount_amount", { length: 50 }),
	discountReferralAmount: varchar("discount_referral_amount", { length: 50 }),
	discountReferralPerson: varchar("discount_referral_person", { length: 50 }),
	referrerCode: varchar("referrer_code", { length: 10 }),
	redeemAmount: float("redeem_amount").notNull(),
	advanceAmount: float("advance_amount").notNull(),
	subtotalAmount: varchar("subtotal_amount", { length: 50 }).notNull(),
	taxAmount: varchar("tax_amount", { length: 50 }).notNull(),
	finalAmount: varchar("final_amount", { length: 50 }).notNull(),
	currency: varchar({ length: 10 }).notNull(),
	orderId: varchar("order_id", { length: 50 }).notNull(),
	orderStatus: varchar("order_status", { length: 50 }),
	paySession: varchar("pay_session", { length: 50 }).notNull(),
	pgEmail: varchar("pg_email", { length: 100 }),
	pgMobile: varchar("pg_mobile", { length: 50 }),
	pgCurrency: varchar("pg_currency", { length: 50 }),
	pgAmount: varchar("pg_amount", { length: 50 }),
	paymentEntry: varchar("payment_entry", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	paymentDate: date("payment_date", { mode: 'string' }),
	payId: varchar("pay_id", { length: 50 }),
	payStatus: varchar("pay_status", { length: 50 }),
	invoiceNumber: int("invoice_number"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.paymentId], name: "tbl_installment_payments_payment_id"}),
]);

export const tblLeadsquare = mysqlTable("tbl_leadsquare", {
	id: int().autoincrement().notNull(),
	fname: varchar({ length: 50 }),
	lname: varchar({ length: 50 }),
	designation: varchar({ length: 50 }),
	email: varchar({ length: 100 }),
	mobile: varchar({ length: 50 }),
	leadSource: mysqlEnum("lead_source", ['1','2','3','4','5','6']),
	programId: varchar("program_id", { length: 50 }),
	batchId: varchar("batch_id", { length: 50 }),
	leadPage: varchar("lead_page", { length: 100 }).notNull(),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_leadsquare_id"}),
]);

export const tblMembershipcardEnquiry = mysqlTable("tbl_membershipcard_enquiry", {
	id: int().autoincrement().notNull(),
	username: varchar({ length: 30 }).notNull(),
	instituteName: varchar("institute_name", { length: 500 }).notNull(),
	city: varchar({ length: 30 }).notNull(),
	currently: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 50 }).notNull(),
	mobileNumber: varchar("mobile_number", { length: 30 }).notNull(),
	updatedDate: datetime("updated_date", { mode: 'string'}).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_membershipcard_enquiry_id"}),
]);

export const tblModules = mysqlTable("tbl_modules", {
	moduleId: int("module_id").autoincrement().notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	moduleName: varchar("module_name", { length: 100 }).notNull(),
	moduleDescription: varchar("module_description", { length: 500 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	moduleStartdate: date("module_startdate", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	module2Startdate: date("module2_startdate", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	module3Startdate: date("module3_startdate", { mode: 'string' }),
	moduleImage: varchar("module_image", { length: 100 }),
	programType: mysqlEnum("program_type", ['0','1']).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.moduleId], name: "tbl_modules_module_id"}),
]);

export const tblNewsroom = mysqlTable("tbl_newsroom", {
	id: int().autoincrement().notNull(),
	moduleId: int("module_id").notNull(),
	newroomTitle: varchar("newroom_title", { length: 255 }).notNull(),
	newroomImage: varchar("newroom_image", { length: 255 }),
	newsroomContent: longtext("newsroom_content").notNull(),
	reference: longtext(),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_newsroom_id"}),
]);

export const tblPasswordResetTemp = mysqlTable("tbl_password_reset_temp", {
	resetId: int("reset_id").autoincrement().notNull(),
	email: varchar({ length: 100 }).notNull(),
	resetKey: varchar("reset_key", { length: 500 }).notNull(),
	expdate: datetime({ mode: 'string'}).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.resetId], name: "tbl_password_reset_temp_reset_id"}),
]);

export const tblPayments = mysqlTable("tbl_payments", {
	paymentId: int("payment_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id"),
	paidFor: int("paid_for").notNull(),
	programName: varchar("program_name", { length: 100 }).notNull(),
	paymentOption: varchar("payment_option", { length: 50 }).notNull(),
	designation: varchar({ length: 50 }),
	payInstallment1: varchar("pay_installment_1", { length: 10 }),
	payInstallment2: varchar("pay_installment_2", { length: 10 }),
	payInstallment3: varchar("pay_installment_3", { length: 10 }),
	trackAccess: varchar("track_access", { length: 50 }).default('1,2,3').notNull(),
	moduleViewtype: mysqlEnum("module_viewtype", ['1','2']).notNull(),
	programAmount: varchar("program_amount", { length: 50 }).notNull(),
	couponCode: varchar("coupon_code", { length: 50 }),
	discountAmount: varchar("discount_amount", { length: 50 }),
	discountReferralAmount: varchar("discount_referral_amount", { length: 50 }),
	discountReferralPerson: varchar("discount_referral_person", { length: 50 }),
	referrerCode: varchar("referrer_code", { length: 10 }),
	redeemAmount: float("redeem_amount").notNull(),
	advanceAmount: float("advance_amount").notNull(),
	subtotalAmount: varchar("subtotal_amount", { length: 50 }).notNull(),
	taxAmount: varchar("tax_amount", { length: 50 }).notNull(),
	finalAmount: varchar("final_amount", { length: 50 }).notNull(),
	currency: varchar({ length: 10 }).notNull(),
	orderId: varchar("order_id", { length: 50 }).notNull(),
	orderStatus: varchar("order_status", { length: 50 }),
	paySession: varchar("pay_session", { length: 50 }).notNull(),
	pgEmail: varchar("pg_email", { length: 100 }),
	pgMobile: varchar("pg_mobile", { length: 50 }),
	pgCurrency: varchar("pg_currency", { length: 50 }),
	pgAmount: varchar("pg_amount", { length: 50 }),
	paymentEntry: varchar("payment_entry", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	paymentDate: date("payment_date", { mode: 'string' }),
	payId: varchar("pay_id", { length: 50 }),
	payStatus: varchar("pay_status", { length: 50 }),
	accessStatus: mysqlEnum("access_status", ['0','1']).notNull(),
	invoiceNumber: int("invoice_number"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
	handsonId: varchar("handson_id", { length: 50 }),
	facultyIds: varchar("faculty_ids", { length: 255 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	scheduledDate: date("scheduled_date", { mode: 'string' }),
	timing: varchar({ length: 100 }),
},
(table) => [
	primaryKey({ columns: [table.paymentId], name: "tbl_payments_payment_id"}),
]);

export const tblPhases = mysqlTable("tbl_phases", {
	phaseId: int("phase_id").autoincrement().notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	phaseName: varchar("phase_name", { length: 100 }).notNull(),
	phaseDescription: varchar("phase_description", { length: 500 }).notNull(),
	phaseImage: varchar("phase_image", { length: 100 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	phaseStartDate: date("phase_start_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	phaseEndDate: date("phase_end_date", { mode: 'string' }),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.phaseId], name: "tbl_phases_phase_id"}),
]);

export const tblPiracyConsent = mysqlTable("tbl_piracy_consent", {
	id: int().autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_piracy_consent_id"}),
]);

export const tblPollOptions = mysqlTable("tbl_poll_options", {
	optionId: int("option_id").autoincrement().notNull(),
	pollId: int("poll_id").notNull().references(() => tblPolls.pollId, { onDelete: "cascade" } ),
	optionText: varchar("option_text", { length: 255 }).notNull(),
	status: mysqlEnum(['1','2']).notNull(),
	votes: int().default(0),
},
(table) => [
	primaryKey({ columns: [table.optionId], name: "tbl_poll_options_option_id"}),
]);

export const tblPolls = mysqlTable("tbl_polls", {
	pollId: int("poll_id").autoincrement().notNull(),
	moduleId: int("module_id").notNull(),
	question: varchar({ length: 255 }).notNull(),
	startDatetime: datetime("start_datetime", { mode: 'string'}),
	endDatetime: datetime("end_datetime", { mode: 'string'}),
	status: mysqlEnum(['0','1']).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.pollId], name: "tbl_polls_poll_id"}),
]);

export const tblPollstatus = mysqlTable("tbl_pollstatus", {
	sessionstatusId: int("sessionstatus_id").autoincrement().notNull(),
	pollId: int("poll_id").notNull(),
	regId: int("reg_id").notNull(),
	pollStatus: mysqlEnum("poll_status", ['2','1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sessionstatusId], name: "tbl_pollstatus_sessionstatus_id"}),
]);

export const tblProgram = mysqlTable("tbl_program", {
	programId: int("program_id").autoincrement().notNull(),
	programName: varchar("program_name", { length: 500 }).notNull(),
	programShortname: varchar("program_shortname", { length: 50 }).notNull(),
	programUrl: varchar("program_url", { length: 500 }).notNull(),
	redirectUrl: varchar("redirect_url", { length: 100 }).notNull(),
	programTitle: varchar("program_title", { length: 500 }),
	programDescription: varchar("program_description", { length: 500 }),
	programImage: varchar("program_image", { length: 255 }),
	programDuration: varchar("program_duration", { length: 20 }),
	salesPage: varchar("sales_page", { length: 500 }),
	adminEmail: varchar("admin_email", { length: 100 }),
	live: mysqlEnum(['Yes','No']).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.programId], name: "tbl_program_program_id"}),
]);

export const tblProgramPrices = mysqlTable("tbl_program_prices", {
	id: int().autoincrement().notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	designation: varchar({ length: 50 }).notNull(),
	countryTier: int("country_tier").notNull(),
	currency: varchar({ length: 50 }),
	displayPrice: float("display_price").notNull(),
	fullAmount: float("full_amount").notNull(),
	totalInstallmentAmount: float("total_installment_amount").notNull(),
	installmentPay1: float("installment_pay1").notNull(),
	installmentPay2: float("installment_pay2").notNull(),
	installmentPay3: float("installment_pay3").notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_program_prices_id"}),
]);

export const tblQueries = mysqlTable("tbl_queries", {
	queriesId: int("queries_id").autoincrement().notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	regId: int("reg_id").notNull(),
	moduleId: int("module_id"),
	sessionId: int("session_id"),
	anonymous: mysqlEnum(['1','0']).notNull(),
	anonymousName: varchar("anonymous_name", { length: 50 }).notNull(),
	message: varchar({ length: 1000 }).notNull(),
	messagedetail: varchar({ length: 1000 }),
	likesCount: varchar("likes_count", { length: 10 }).default('0'),
	dislikesCount: varchar("dislikes_count", { length: 10 }).default('0'),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	showStatus: mysqlEnum("show_status", ['1','0']).notNull(),
},
(table) => [
	primaryKey({ columns: [table.queriesId], name: "tbl_queries_queries_id"}),
]);

export const tblQueriesUpvote = mysqlTable("tbl_queries_upvote", {
	tblQueriesUpvoteId: int("tbl_queries_upvote_id").autoincrement().notNull(),
	queriesId: int("queries_id").notNull(),
	regId: int("reg_id").notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.tblQueriesUpvoteId], name: "tbl_queries_upvote_tbl_queries_upvote_id"}),
]);

export const tblQueryResponseAttachment = mysqlTable("tbl_query_response_attachment", {
	queryResponseAttachmentId: int("query_response_attachment_id").autoincrement().notNull(),
	queryResponseId: int("query_response_id").notNull(),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	displayName: varchar("display_name", { length: 255 }).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.queryResponseAttachmentId], name: "tbl_query_response_attachment_query_response_attachment_id"}),
]);

export const tblQueryResponses = mysqlTable("tbl_query_responses", {
	queryResponseId: int("query_response_id").autoincrement().notNull(),
	queriesId: int("queries_id").notNull(),
	regId: int("reg_id").notNull(),
	response: longtext().notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.queryResponseId], name: "tbl_query_responses_query_response_id"}),
]);

export const tblQueryform = mysqlTable("tbl_queryform", {
	scheduleformId: int("scheduleform_id").autoincrement().notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	mobile: varchar({ length: 50 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	message: varchar({ length: 1000 }),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.scheduleformId], name: "tbl_queryform_scheduleform_id"}),
]);

export const tblRefRegistration = mysqlTable("tbl_ref_registration", {
	id: int().autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	referrerNameCookie: varchar("referrer_name_cookie", { length: 100 }),
	referrerNameIp: varchar("referrer_name_ip", { length: 100 }),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_ref_registration_id"}),
]);

export const tblReferral = mysqlTable("tbl_referral", {
	referralId: int("referral_id").autoincrement().notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	currency: varchar({ length: 50 }).notNull(),
	referrerCode: varchar("referrer_code", { length: 10 }).notNull(),
	referrerBonus: varchar("referrer_bonus", { length: 10 }).notNull(),
	refereeCode: varchar("referee_code", { length: 10 }).notNull(),
	refereeDiscount: varchar("referee_discount", { length: 10 }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.referralId], name: "tbl_referral_referral_id"}),
]);

export const tblReferralCashback = mysqlTable("tbl_referral_cashback", {
	referralCashbackId: int("referral_cashback_id").autoincrement().notNull(),
	currency: varchar({ length: 50 }).notNull(),
	referrerCode: varchar("referrer_code", { length: 10 }).notNull(),
	cashbackCredited: varchar("cashback_credited", { length: 10 }).notNull(),
	referenceNumber: varchar("reference_number", { length: 100 }).notNull(),
	cashbackType: mysqlEnum("cashback_type", ['0','1']).notNull(),
	paymentId: varchar("payment_id", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	paidDate: date("paid_date", { mode: 'string' }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.referralCashbackId], name: "tbl_referral_cashback_referral_cashback_id"}),
]);

export const tblRegistration = mysqlTable("tbl_registration", {
	regId: int("reg_id").autoincrement().notNull(),
	salutation: varchar({ length: 10 }),
	fname: varchar({ length: 100 }).notNull(),
	lname: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	mobile: varchar({ length: 50 }).notNull(),
	designation: varchar({ length: 50 }),
	password: varchar({ length: 100 }).notNull(),
	profilePicture: varchar("profile_picture", { length: 500 }).default('default.jpg'),
	mobileVerified: mysqlEnum("mobile_verified", ['1','0']).notNull(),
	emailVerified: mysqlEnum("email_verified", ['1','0']).notNull(),
	institution: varchar({ length: 500 }),
	medboard: varchar({ length: 500 }),
	mednumber: varchar({ length: 50 }),
	country: varchar({ length: 50 }),
	state: varchar({ length: 50 }),
	city: varchar({ length: 50 }),
	pincode: varchar({ length: 10 }),
	address: varchar({ length: 500 }),
	gstCheck: mysqlEnum("gst_check", ['1','0']).notNull(),
	gstin: varchar({ length: 50 }),
	gstEntityName: varchar("gst_entity_name", { length: 100 }),
	refCode: varchar("ref_code", { length: 10 }),
	firstRegistration: varchar("first_registration", { length: 100 }),
	batchId: int("batch_id"),
	complete: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.regId], name: "tbl_registration_reg_id"}),
]);

export const tblResourceCasestudyFinding = mysqlTable("tbl_resource_casestudy_finding", {
	resourceCasestudyFindingId: int("resource_casestudy_finding_id").autoincrement().notNull(),
	resourcehubId: int("resourcehub_id").notNull(),
	regId: int("reg_id").notNull(),
	casestudyFinding: text("casestudy_finding").notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.resourceCasestudyFindingId], name: "tbl_resource_casestudy_finding_resource_casestudy_finding_id"}),
]);

export const tblResourcehub = mysqlTable("tbl_resourcehub", {
	resourcehubId: int("resourcehub_id").autoincrement().notNull(),
	moduleId: int("module_id"),
	resourcehubTitle: varchar("resourcehub_title", { length: 100 }).notNull(),
	resourcehubDescription: text("resourcehub_description"),
	resourcehubType: varchar("resourcehub_type", { length: 10 }),
	resourcehubImage: varchar("resourcehub_image", { length: 100 }),
	status: mysqlEnum(['1','0']).notNull(),
	createdBy: int("created_by"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.resourcehubId], name: "tbl_resourcehub_resourcehub_id"}),
]);

export const tblResourcehubbookmark = mysqlTable("tbl_resourcehubbookmark", {
	rhcBookmarkId: int("rhc_bookmark_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	resourcehubId: int("resourcehub_id"),
	resourcehubcontentId: int("resourcehubcontent_id"),
	bookmarkStatus: mysqlEnum("bookmark_status", ['1','0']),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.rhcBookmarkId], name: "tbl_resourcehubbookmark_rhc_bookmark_id"}),
	unique("unique_content_view").on(table.resourcehubcontentId, table.regId),
	unique("unique_view").on(table.resourcehubId, table.regId),
]);

export const tblResourcehubcontent = mysqlTable("tbl_resourcehubcontent", {
	resourcehubcontentId: int("resourcehubcontent_id").autoincrement().notNull(),
	resourcehubId: int("resourcehub_id").notNull(),
	resourcehubcontentType: varchar("resourcehubcontent_type", { length: 100 }),
	resourcehubcontentTitle: varchar("resourcehubcontent_title", { length: 500 }),
	resourcehubcontentFile: varchar("resourcehubcontent_file", { length: 500 }),
	resourcehubcontentLink: varchar("resourcehubcontent_link", { length: 500 }),
	resourcehubcontentDescription: text("resourcehubcontent_description"),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.resourcehubcontentId], name: "tbl_resourcehubcontent_resourcehubcontent_id"}),
]);

export const tblResourcehubcontentview = mysqlTable("tbl_resourcehubcontentview", {
	rhcViewId: int("rhc_view_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	resourcehubId: int("resourcehub_id"),
	resourcehubcontentId: int("resourcehubcontent_id"),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.rhcViewId], name: "tbl_resourcehubcontentview_rhc_view_id"}),
	unique("unique_content_view").on(table.resourcehubcontentId, table.regId),
	unique("unique_view").on(table.resourcehubId, table.regId),
]);

export const tblScholarship = mysqlTable("tbl_scholarship", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 80 }).notNull(),
	email: varchar({ length: 120 }).notNull(),
	mobile: varchar({ length: 50 }).notNull(),
	country: varchar({ length: 50 }),
	highestDegree: varchar("highest_degree", { length: 120 }).notNull(),
	institution: varchar({ length: 120 }),
	yearRadiologist: varchar("year_radiologist", { length: 120 }).notNull(),
	applyReason: longtext("apply_reason").notNull(),
	careerImpact: longtext("career_impact"),
	cvFile: varchar("cv_file", { length: 255 }),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_scholarship_id"}),
]);

export const tblSessionRating = mysqlTable("tbl_session_rating", {
	sessionRatingId: int("session_rating_id").autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	regId: int("reg_id").notNull(),
	rating: int().notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sessionRatingId], name: "tbl_session_rating_session_rating_id"}),
	unique("unique_session_reg").on(table.sessionId, table.regId),
]);

export const tblSessionResources = mysqlTable("tbl_session_resources", {
	sessionResourceId: int("session_resource_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	sessionId: int("session_id").notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	displayname: varchar({ length: 100 }).notNull(),
	fileName: varchar("file_name", { length: 100 }),
	linkName: varchar("link_name", { length: 500 }),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sessionResourceId], name: "tbl_session_resources_session_resource_id"}),
]);

export const tblSessioncopyReference = mysqlTable("tbl_sessioncopy_reference", {
	id: int().autoincrement().notNull(),
	oldSessionId: int("old_session_id").notNull(),
	newSessionId: int("new_session_id").notNull(),
	tableType: varchar("table_type", { length: 50 }).notNull(),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_sessioncopy_reference_id"}),
]);

export const tblSessions = mysqlTable("tbl_sessions", {
	sessionId: int("session_id").autoincrement().notNull(),
	programId: int("program_id"),
	batchId: int("batch_id"),
	phaseId: int("phase_id"),
	moduleId: int("module_id"),
	crsectionId: int("crsection_id"),
	programType: mysqlEnum("program_type", ['0','1']).notNull(),
	sessionName: varchar("session_name", { length: 500 }).notNull(),
	facultyName: varchar("faculty_name", { length: 500 }),
	sessionDescription: longtext("session_description"),
	sessionImage: varchar("session_image", { length: 100 }).notNull(),
	sessionType: varchar("session_type", { length: 50 }).notNull(),
	sessionUrl: varchar("session_url", { length: 500 }).notNull(),
	isZoom: mysqlEnum("is_zoom", ['0','1']).notNull(),
	zoomMeetingId: varchar("zoom_meeting_id", { length: 255 }),
	zoomStartdate: datetime("zoom_startdate", { mode: 'string'}),
	zoomEnddate: datetime("zoom_enddate", { mode: 'string'}),
	zoomPassword: varchar("zoom_password", { length: 20 }),
	zoomLiveLink: varchar("zoom_live_link", { length: 255 }),
	zoombackupStatus: mysqlEnum("zoombackup_status", ['0','1']).notNull(),
	dicomVideoUrl: varchar("dicom_video_url", { length: 500 }),
	dicomCaseId: varchar("dicom_case_id", { length: 50 }),
	assessmentPassPercentage: int("assessment_pass_percentage").default(100),
	duration: varchar({ length: 100 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	startDate: date("start_date", { mode: 'string' }).notNull(),
	startTime: time("start_time").notNull(),
	startDatetime: datetime("start_datetime", { mode: 'string'}),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	endDate: date("end_date", { mode: 'string' }).notNull(),
	endTime: time("end_time").notNull(),
	endDatetime: datetime("end_datetime", { mode: 'string'}),
	videoStatus: mysqlEnum("video_status", ['Recorded','Live']).notNull(),
	lockStatus: mysqlEnum("lock_status", ['1','0']).notNull(),
	sponsored: mysqlEnum(['1','0']).notNull(),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sessionId], name: "tbl_sessions_session_id"}),
]);

export const tblSessionstatus = mysqlTable("tbl_sessionstatus", {
	sessionstatusId: int("sessionstatus_id").autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	regId: int("reg_id").notNull(),
	programType: mysqlEnum("program_type", ['0','1']).notNull(),
	sessionType: int("session_type").default(0).notNull(),
	isZoom: mysqlEnum("is_zoom", ['0','1']).notNull(),
	sessionStatus: mysqlEnum("session_status", ['2','1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sessionstatusId], name: "tbl_sessionstatus_sessionstatus_id"}),
]);

export const tblSponsorLinks = mysqlTable("tbl_sponsor_links", {
	sponsorLinkId: int("sponsor_link_id").autoincrement().notNull(),
	sessionId: int("session_id").notNull(),
	sponsorName: varchar("sponsor_name", { length: 500 }).notNull(),
	sponsorDescription: varchar("sponsor_description", { length: 1000 }),
	sponsorLink: varchar("sponsor_link", { length: 100 }),
	sponsorImage: varchar("sponsor_image", { length: 100 }),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sponsorLinkId], name: "tbl_sponsor_links_sponsor_link_id"}),
]);

export const tblSponsorMembers = mysqlTable("tbl_sponsor_members", {
	sponsorMemberId: int("sponsor_member_id").autoincrement().notNull(),
	sponsorMemberName: varchar("sponsor_member_name", { length: 100 }).notNull(),
	sponsorMemberLocation: varchar("sponsor_member_location", { length: 100 }),
	sponsorMemberImage: varchar("sponsor_member_image", { length: 100 }),
	sponsorMemberDescription: varchar("sponsor_member_description", { length: 500 }),
	sponsorMemberEmail: varchar("sponsor_member_email", { length: 100 }),
	sponsorMemberPassword: varchar("sponsor_member_password", { length: 100 }),
	status: mysqlEnum(['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.sponsorMemberId], name: "tbl_sponsor_members_sponsor_member_id"}),
]);

export const tblUserCasecomment = mysqlTable("tbl_user_casecomment", {
	commentId: int("comment_id").autoincrement().notNull(),
	caseId: int("case_id").notNull(),
	userId: varchar("user_id", { length: 50 }),
	facultyId: varchar("faculty_id", { length: 50 }),
	comment: longtext(),
	attachmentFile: varchar("attachment_file", { length: 255 }),
	viewFilename: varchar("view_filename", { length: 255 }),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.commentId], name: "tbl_user_casecomment_comment_id"}),
]);

export const tblUserCasefiles = mysqlTable("tbl_user_casefiles", {
	id: int().autoincrement().notNull(),
	caseId: int("case_id").notNull(),
	fileType: varchar("file_type", { length: 50 }),
	fileName: varchar("file_name", { length: 255 }),
	fileViewname: varchar("file_viewname", { length: 255 }),
	status: mysqlEnum(['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_user_casefiles_id"}),
]);

export const tblUserCaselist = mysqlTable("tbl_user_caselist", {
	caseId: int("case_id").autoincrement().notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	moduleId: int("module_id").notNull(),
	userId: int("user_id").notNull(),
	caseName: varchar("case_name", { length: 150 }).notNull(),
	clinicalDetails: varchar("clinical_details", { length: 150 }).notNull(),
	description: longtext(),
	facultyApproval: mysqlEnum("faculty_approval", ['0','1']).notNull(),
	saveOrSubmit: mysqlEnum("save_or_submit", ['0','1']).notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.caseId], name: "tbl_user_caselist_case_id"}),
]);

export const tblUserInstallments = mysqlTable("tbl_user_installments", {
	id: int().autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	programId: int("program_id").notNull(),
	batchId: int("batch_id").notNull(),
	paidFor: int("paid_for"),
	programName: varchar("program_name", { length: 50 }),
	currency: varchar({ length: 50 }).notNull(),
	countryTier: int("country_tier"),
	totalInstallmentAmount: float("total_installment_amount").notNull(),
	installmentCount: int("installment_count").notNull(),
	payAmount: float("pay_amount").notNull(),
	salesCommitAmount: float("sales_commit_amount").notNull(),
	salesCommitAmountWithtax: float("sales_commit_amount_withtax").notNull(),
	advanceAmount: float("advance_amount").notNull(),
	redeemAmount: float("redeem_amount").notNull(),
	discountAmount: float("discount_amount").notNull(),
	taxes: float().notNull(),
	finalAmount: float("final_amount").notNull(),
	payId: varchar("pay_id", { length: 50 }),
	payStatus: mysqlEnum("pay_status", ['pending','captured']),
	payDate: datetime("pay_date", { mode: 'string'}),
	createdDate: datetime("created_date", { mode: 'string'}).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_user_installments_id"}),
]);

export const tblUserNotificationOptin = mysqlTable("tbl_user_notification_optin", {
	optinId: int("optin_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	newResource: mysqlEnum("new_resource", ['1','0']).notNull(),
	queryResponse: mysqlEnum("query_response", ['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.optinId], name: "tbl_user_notification_optin_optin_id"}),
	unique("reg_id").on(table.regId),
]);

export const tblUserPollmap = mysqlTable("tbl_user_pollmap", {
	id: int().autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	pollId: int("poll_id").notNull(),
	optionId: int("option_id").notNull(),
	createdDate: datetime("created_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.id], name: "tbl_user_pollmap_id"}),
]);

export const tblUserTickets = mysqlTable("tbl_user_tickets", {
	userTicketId: int("user_ticket_id").autoincrement().notNull(),
	regId: int("reg_id").notNull(),
	ticketType: varchar("ticket_type", { length: 20 }).notNull(),
	ticketTitle: varchar("ticket_title", { length: 250 }).notNull(),
	ticketDescription: text("ticket_description"),
	ticketFile: varchar("ticket_file", { length: 100 }),
	ticketStatus: mysqlEnum("ticket_status", ['1','0']).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	primaryKey({ columns: [table.userTicketId], name: "tbl_user_tickets_user_ticket_id"}),
]);

export const tblUserToken = mysqlTable("tbl_user_token", {
	userTokenId: int("user_token_id").autoincrement().notNull(),
	userId: int("user_id").notNull(),
	token: varchar({ length: 100 }).notNull(),
	createdDate: timestamp("created_date", { mode: 'string' }).defaultNow().notNull(),
	modifiedDate: datetime("modified_date", { mode: 'string'}),
},
(table) => [
	primaryKey({ columns: [table.userTokenId], name: "tbl_user_token_user_token_id"}),
]);
