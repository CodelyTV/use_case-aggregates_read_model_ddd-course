import { NextRequest, NextResponse } from "next/server";

import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";
import { ProductReviewsByProductSearcher } from "../../../../contexts/shop/product_reviews/application/search_by_product_id/ProductReviewsByProductSearcher";
import { PostgresProductReviewRepository } from "../../../../contexts/shop/product_reviews/infrastructure/PostgresProductReviewRepository";
import { ProductPrimitives } from "../../../../contexts/shop/products/domain/Product";

export async function GET(
	request: NextRequest,
): Promise<NextResponse<ProductPrimitives[]> | Response> {
	const searcher = new ProductReviewsByProductSearcher(
		new PostgresProductReviewRepository(new PostgresConnection()),
	);

	const id = new URL(request.url).searchParams.get("product_id");

	if (!id) {
		throw new Error("product_id is required");
	}

	const products = await searcher.search(id);

	return NextResponse.json(products.map((product) => product));
}
