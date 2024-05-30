import { NextResponse } from "next/server";

import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";
import { PostgresProductReviewRepository } from "../../../../contexts/shop/product_reviews/infrastructure/PostgresProductReviewRepository";
import { AllProductsSearcher } from "../../../../contexts/shop/products/application/search_all/AllProductsSearcher";
import { ProductPrimitives } from "../../../../contexts/shop/products/domain/Product";
import { PostgresWithOtherRepositoriesProductRepository } from "../../../../contexts/shop/products/infrastructure/PostgresWithOtherRepositoriesProductRepository";
import { PostgresUserRepository } from "../../../../contexts/shop/users/infrastructure/PostgresUserRepository";

export async function GET(): Promise<NextResponse<ProductPrimitives[]> | Response> {
	const postgresConnection = new PostgresConnection();

	const userRepository = new PostgresUserRepository(postgresConnection);
	const reviewRepository = new PostgresProductReviewRepository(postgresConnection);

	const searcher = new AllProductsSearcher(
		new PostgresWithOtherRepositoriesProductRepository(
			postgresConnection,
			reviewRepository,
			userRepository,
		),
	);

	const products = await searcher.search();

	return NextResponse.json(products);
}
