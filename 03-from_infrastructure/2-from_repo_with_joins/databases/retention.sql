CREATE SCHEMA retention;

CREATE TABLE retention.users (
	id UUID PRIMARY KEY,
	last_activity_date TIMESTAMP
);
