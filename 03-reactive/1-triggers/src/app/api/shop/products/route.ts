import { NextResponse } from "next/server";

import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";
import { AllProductsSearcher } from "../../../../contexts/shop/products/application/search_all/AllProductsSearcher";
import { ProductPrimitives } from "../../../../contexts/shop/products/domain/Product";
import { PostgresWithViewsProductRepository } from "../../../../contexts/shop/products/infrastructure/PostgresWithViewsProductRepository";

export async function GET(): Promise<NextResponse<ProductPrimitives[]> | Response> {
	const postgresConnection = new PostgresConnection();

	const searcher = new AllProductsSearcher(
		new PostgresWithViewsProductRepository(postgresConnection),
	);

	const products = await searcher.search();

	return NextResponse.json(products);
}
