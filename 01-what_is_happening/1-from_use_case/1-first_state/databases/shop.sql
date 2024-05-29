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
	product_id UUID REFERENCES shop.products(id),
	rating FLOAT,
	comment VARCHAR(500)
);

INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls, featured_review, rating) VALUES
	('8d5f5b10-6f34-4421-a9ee-7a3a0e5a5be8', 'Macbook Pro', 19.99, 'USD', ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'], '{"reviewer": "Juan", "comment": "Excelente producto"}', 4.5);

INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls, featured_review, rating) VALUES
	('d9e41410-bf0a-4ada-887e-8b2d5e4e9f79', 'Microsoft Surface', 49.99, 'EUR', ARRAY['https://example.com/image3.jpg', 'https://example.com/image4.jpg'], '{"reviewer": "María", "comment": "Muy bueno"}', 4.8);

INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls, featured_review, rating) VALUES
	('c3e1d2b0-6d69-4c79-b8f0-f2c0eb733e77', 'Framework laptop', 29.99, 'GBP', ARRAY['https://example.com/image5.jpg', 'https://example.com/image6.jpg'], '{"reviewer": "Ana", "comment": "Buena relación calidad-precio"}', 4.2);
