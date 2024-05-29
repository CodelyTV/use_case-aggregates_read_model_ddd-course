import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest } from "next/server";

import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import {
	ProductReviewCreator,
	ProductReviewCreatorErrors,
} from "../../../../../contexts/shop/product_reviews/application/create/ProductReviewCreator";
import { PostgresProductReviewRepository } from "../../../../../contexts/shop/product_reviews/infrastructure/PostgresProductReviewRepository";
import { ProductFinder } from "../../../../../contexts/shop/products/application/find/ProductFinder";
import { PostgresProductRepository } from "../../../../../contexts/shop/products/infrastructure/PostgresProductRepository";
import { UserFinder } from "../../../../../contexts/shop/users/application/find/UserFinder";
import { PostgresUserRepository } from "../../../../../contexts/shop/users/infrastructure/PostgresUserRepository";

const CreateProductReviewRequest = t.type({
	userId: t.string,
	productId: t.string,
	rating: t.number,
	comment: t.string,
});

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateProductReviewRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return HttpNextResponse.badRequest(
			`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`,
		);
	}

	const body = validatedRequest.right;

	const postgresConnection = new PostgresConnection();

	const userRepository = new PostgresUserRepository(postgresConnection);
	const reviewRepository = new PostgresProductReviewRepository(postgresConnection);

	const creator = new ProductReviewCreator(
		new UserFinder(userRepository),
		new ProductFinder(new PostgresProductRepository(postgresConnection)),
		reviewRepository,
	);

	return executeWithErrorHandling(
		async () => {
			await creator.create(id, body.userId, body.productId, body.rating, body.comment);

			return HttpNextResponse.created();
		},
		(error: ProductReviewCreatorErrors) => {
			return HttpNextResponse.domainError(error, 409);
		},
	);
}
