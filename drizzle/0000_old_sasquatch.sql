CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`age` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
