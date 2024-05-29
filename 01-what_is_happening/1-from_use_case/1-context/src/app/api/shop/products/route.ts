import { NextResponse } from "next/server";

import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";
import { AllProductsSearcher } from "../../../../contexts/shop/products/application/search_all/AllProductsSearcher";
import { ProductPrimitives } from "../../../../contexts/shop/products/domain/Product";
import { PostgresProductRepository } from "../../../../contexts/shop/products/infrastructure/PostgresProductRepository";

export async function GET(): Promise<NextResponse<ProductPrimitives[]> | Response> {
	const searcher = new AllProductsSearcher(new PostgresProductRepository(new PostgresConnection()));

	const products = await searcher.search();

	return NextResponse.json(products);
}
