CREATE TABLE `contactInquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`companyProject` varchar(180),
	`sector` varchar(80),
	`email` varchar(320) NOT NULL,
	`message` text NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactInquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`company` varchar(180) NOT NULL,
	`sector` varchar(80) NOT NULL,
	`stage` varchar(80),
	`pitch` text NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`deckKey` varchar(1024),
	`status` enum('new','under review','responded') NOT NULL DEFAULT 'new',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
