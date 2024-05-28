/* -------------------------
  SHARED CONTEXT
---------------------------- */
CREATE SCHEMA shared;

CREATE TABLE shared.failover_domain_events (
	id SERIAL PRIMARY KEY,
	event_id UUID NOT NULL,
	event_name VARCHAR(255) NOT NULL,
	body TEXT NOT NULL
);


/* -------------------------
  SELLER BACKOFFICE CONTEXT
---------------------------- */
CREATE SCHEMA seller_backoffice;

CREATE TABLE seller_backoffice.products (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	price_amount NUMERIC(10, 2),
	price_currency CHAR(3),
	image_urls JSONB,
	views INT,
	creation_date TIMESTAMP
);


/* -------------------------
     RETENTION CONTEXT
---------------------------- */
CREATE SCHEMA retention;

CREATE TABLE retention.users (
	id UUID PRIMARY KEY,
	last_activity_date TIMESTAMP
);


/* -------------------------
        SHOP CONTEXT
---------------------------- */
CREATE SCHEMA shop;

CREATE TABLE shop.users (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	profile_picture VARCHAR(255),
	status VARCHAR(255)
);

CREATE TABLE shop.products (
	id UUID PRIMARY KEY,
	name VARCHAR,
	price_amount NUMERIC,
	price_currency VARCHAR,
	image_urls TEXT[],
	featured_review JSONB,
	rating NUMERIC
);

CREATE TABLE shop.product_reviews (
	id UUID PRIMARY KEY,
	user_id UUID REFERENCES shop.users(id),
	product_id UUID REFERENCES seller_backoffice.products(id),
	rating FLOAT,
	comment VARCHAR(500),
	is_featured BOOLEAN DEFAULT FALSE
);
