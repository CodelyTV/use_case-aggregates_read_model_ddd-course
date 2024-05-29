import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { Currency } from "../../../../../contexts/shared/domain/Money";
import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { ProductReviewsByProductSearcher } from "../../../../../contexts/shop/product_reviews/application/search_by_product_id/ProductReviewsByProductSearcher";
import { PostgresProductReviewRepository } from "../../../../../contexts/shop/product_reviews/infrastructure/PostgresProductReviewRepository";
import { ProductCreator } from "../../../../../contexts/shop/products/application/create/ProductCreator";
import { ProductFinder } from "../../../../../contexts/shop/products/application/find/ProductFinder";
import { ProductPrimitives } from "../../../../../contexts/shop/products/domain/Product";
import { ProductDoesNotExistError } from "../../../../../contexts/shop/products/domain/ProductDoesNotExistError";
import { PostgresProductRepository } from "../../../../../contexts/shop/products/infrastructure/PostgresProductRepository";
import { UserFinder } from "../../../../../contexts/shop/users/application/find/UserFinder";
import { PostgresUserRepository } from "../../../../../contexts/shop/users/infrastructure/PostgresUserRepository";

const CreateProductRequest = t.type({
	name: t.string,
	price_amount: t.number,
	price_currency: t.string,
	image_urls: t.array(t.string),
});

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateProductRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return HttpNextResponse.badRequest(
			`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`,
		);
	}

	const body = validatedRequest.right;

	const creator = new ProductCreator(new PostgresProductRepository(new PostgresConnection()));

	return executeWithErrorHandling(async () => {
		await creator.create(
			id,
			body.name,
			{ amount: body.price_amount, currency: body.price_currency as Currency },
			body.image_urls,
		);

		return HttpNextResponse.created();
	});
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<ProductPrimitives> | Response> {
	const postgresConnection = new PostgresConnection();

	const productFinder = new ProductFinder(new PostgresProductRepository(postgresConnection));
	const reviewsSearcher = new ProductReviewsByProductSearcher(
		new PostgresProductReviewRepository(postgresConnection),
	);
	const userFinder = new UserFinder(new PostgresUserRepository(postgresConnection));

	return executeWithErrorHandling(
		async () => {
			const product = await productFinder.find(id);

			const reviews = await reviewsSearcher.search(id);
			const topReviews = reviews.filter((review) => review.rating >= 4).slice(0, 3);

			const reviewsWithUserData = topReviews.map(async (review) => {
				const user = await userFinder.find(review.userId);

				return {
					userName: user.name,
					userProfilePictureUrl: user.profilePicture,
					reviewRating: review.rating,
					reviewComment: review.comment,
				};
			});

			return HttpNextResponse.json({
				...product,
				latestTopReviews: await Promise.all(reviewsWithUserData),
			});
		},
		(error: ProductDoesNotExistError) => {
			return HttpNextResponse.domainError(error, 404);
		},
	);
}