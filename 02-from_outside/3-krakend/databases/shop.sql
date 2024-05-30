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
	('8d5f5b10-6f34-4421-a9ee-7a3a0e5a5be8', 'Macbook Pro', 19.99, 'USD', ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg']),
	('d9e41410-bf0a-4ada-887e-8b2d5e4e9f79', 'Microsoft Surface', 49.99, 'EUR', ARRAY['https://example.com/image3.jpg', 'https://example.com/image4.jpg']),
	('c3e1d2b0-6d69-4c79-b8f0-f2c0eb733e77', 'Framework laptop', 29.99, 'USD', ARRAY['https://example.com/image5.jpg', 'https://example.com/image6.jpg']);

INSERT INTO shop.users (id, name, email, profile_picture) VALUES
	('f4555bb0-c743-44f6-92a3-376e0f90df06', 'Javier Ferrer', 'javier@cane.com', 'https://example.com/profile1.jpg'),
	('3e35e2c6-f58b-4752-a41f-9b77bc0b7a02', 'Tipo de incognito', 'incognnito@tipo.com', 'https://example.com/profile2.jpg'),
	('7e685cd9-1195-4bb8-ab10-02d4c5c36960', 'Pikachu', 'pikachu@pokemon.com', 'https://example.com/profile3.jpg');

INSERT INTO shop.product_reviews (id, user_id, product_id, rating, comment) VALUES
	('1f9ead6d-e3eb-4f08-98a6-f30ab41a36f4', 'f4555bb0-c743-44f6-92a3-376e0f90df06', '8d5f5b10-6f34-4421-a9ee-7a3a0e5a5be8', 4.5, 'Canelita el Mac'),
	('3a0591e2-e762-4427-97d8-65f6fc7cc1fc', '3e35e2c6-f58b-4752-a41f-9b77bc0b7a02', '8d5f5b10-6f34-4421-a9ee-7a3a0e5a5be8', 3.5, 'Shhh'),
	('c43e5a07-3add-40b3-8b46-8b6454938a72', '7e685cd9-1195-4bb8-ab10-02d4c5c36960', '8d5f5b10-6f34-4421-a9ee-7a3a0e5a5be8', 5, 'Pika pikaa!'),
	('b2850f8f-dec5-4ae1-96aa-ce2bc188757f', '7e685cd9-1195-4bb8-ab10-02d4c5c36960', 'd9e41410-bf0a-4ada-887e-8b2d5e4e9f79', 4.7, 'Pika otro producto');
