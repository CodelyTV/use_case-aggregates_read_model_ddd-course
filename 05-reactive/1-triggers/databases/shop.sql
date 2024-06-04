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
	image_urls TEXT[] NOT NULL,
	latest_top_reviews JSONB
);

CREATE TABLE shop.product_reviews (
	id UUID PRIMARY KEY,
	user_id UUID REFERENCES shop.users(id) NOT NULL,
	product_id UUID REFERENCES shop.products(id) NOT NULL,
	rating FLOAT NOT NULL,
	comment VARCHAR(500)
);


-----------------------------------------
-- VIEWS
-----------------------------------------
CREATE VIEW shop.product_with_reviews AS
SELECT
	p.id,
	p.name,
	p.price_amount AS amount,
	p.price_currency AS currency,
	p.image_urls,
	COALESCE(
		json_agg(
			json_build_object(
					'userName', u.name,
					'userProfilePictureUrl', u.profile_picture,
					'reviewRating', r.rating,
					'reviewComment', r.comment
			) ORDER BY r.rating DESC
		) FILTER (WHERE r.id IS NOT NULL AND r.rating >= 4), '[]'
	) AS latest_top_reviews
FROM shop.products p
	LEFT JOIN shop.product_reviews r ON p.id = r.product_id
	LEFT JOIN shop.users u ON r.user_id = u.id
GROUP BY p.id;

CREATE MATERIALIZED VIEW shop.product_with_reviews_materialized AS
SELECT
	p.id,
	p.name,
	p.price_amount AS amount,
	p.price_currency AS currency,
	p.image_urls,
	COALESCE(
					json_agg(
					json_build_object(
							'userName', u.name,
							'userProfilePictureUrl', u.profile_picture,
							'reviewRating', r.rating,
							'reviewComment', r.comment
					) ORDER BY r.rating DESC
							) FILTER (WHERE r.id IS NOT NULL AND r.rating >= 4), '[]'
	) AS latest_top_reviews
FROM shop.products p
		 LEFT JOIN shop.product_reviews r ON p.id = r.product_id
		 LEFT JOIN shop.users u ON r.user_id = u.id
GROUP BY p.id;


-----------------------------------------
-- TRIGGERS
-----------------------------------------
CREATE OR REPLACE FUNCTION update_latest_top_reviews_on_review_inserted() RETURNS TRIGGER AS $$
BEGIN
	UPDATE shop.products p
	SET latest_top_reviews = (
		SELECT json_agg(
		   json_build_object(
				'userName', u.name,
				'userProfilePictureUrl', u.profile_picture,
				'reviewRating', r.rating,
				'reviewComment', r.comment
		   ) ORDER BY r.rating DESC
		)
		FROM shop.product_reviews r JOIN shop.users u ON r.user_id = u.id
		WHERE r.product_id = p.id AND r.rating >= 4
	)
	WHERE p.id = NEW.product_id;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_latest_top_reviews_TRIGGER
	AFTER INSERT OR UPDATE ON shop.product_reviews
	FOR EACH ROW
EXECUTE FUNCTION update_latest_top_reviews_on_review_inserted();
