import { NextResponse } from "next/server";

import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { ProductSearcher } from "../../../../../contexts/shop/products/application/search/ProductSearcher";
import { ProductPrimitives } from "../../../../../contexts/shop/products/domain/Product";
import { PostgresProductRepository } from "../../../../../contexts/shop/products/infrastructure/PostgresProductRepository";

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<ProductPrimitives> | Response> {
	const searcher = new ProductSearcher(new PostgresProductRepository(new PostgresConnection()));

	const product = await searcher.search(id);

	if (product === null) {
		return new Response("", { status: 404 });
	}

	return NextResponse.json(product.toPrimitives());
}
