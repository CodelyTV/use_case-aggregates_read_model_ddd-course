CREATE SCHEMA shop;

CREATE TABLE shop.users (
	id UUID PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	profile_picture VARCHAR(255) NOT NULL
);

CREATE TABLE shop.products (
	id UUID PRIMARY KEY,
	name VARCHAR NOT NULL,
	price_amount NUMERIC NOT NULL,
	price_currency VARCHAR NOT NULL,
	image_urls TEXT[] NOT NULL
);

CREATE TABLE shop.product_reviews (
	id UUID PRIMARY KEY,
	user_id UUID REFERENCES shop.users(id) NOT NULL,
	product_id UUID REFERENCES shop.products(id) NOT NULL,
	rating FLOAT NOT NULL,
	comment VARCHAR(500)
);

INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls) VALUES
	('8d5f5b10-6f34-4421-a9ee-7a3a0e5a5be8', 'Macbook Pro', 19.99, 'USD', ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg']);

INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls) VALUES
	('d9e41410-bf0a-4ada-887e-8b2d5e4e9f79', 'Microsoft Surface', 49.99, 'EUR', ARRAY['https://example.com/image3.jpg', 'https://example.com/image4.jpg']);

INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls) VALUES
	('c3e1d2b0-6d69-4c79-b8f0-f2c0eb733e77', 'Framework laptop', 29.99, 'USD', ARRAY['https://example.com/image5.jpg', 'https://example.com/image6.jpg']);
