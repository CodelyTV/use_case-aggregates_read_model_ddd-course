import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest } from "next/server";

import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { ProductReviewCreator } from "../../../../../contexts/shop/product_reviews/application/create/ProductReviewCreator";
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
		return new Response(`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`, {
			status: 400,
		});
	}

	const body = validatedRequest.right;

	await new ProductReviewCreator(
		new UserFinder(new PostgresUserRepository(new PostgresConnection())),
		new ProductFinder(new PostgresProductRepository(new PostgresConnection())),
		new PostgresProductReviewRepository(new PostgresConnection()),
	).create(id, body.userId, body.productId, body.rating, body.comment);

	return new Response("", { status: 201 });
}
