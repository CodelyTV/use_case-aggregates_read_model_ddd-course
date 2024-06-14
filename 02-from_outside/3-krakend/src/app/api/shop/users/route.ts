import { Primitives } from "@codelytv/primitives-type";
import { NextResponse } from "next/server";

import { executeWithErrorHandling } from "../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";
import { UsersSearcher } from "../../../../contexts/shop/users/application/by_ids/UsersSearcher";
import { User } from "../../../../contexts/shop/users/domain/User";
import { PostgresUserRepository } from "../../../../contexts/shop/users/infrastructure/PostgresUserRepository";

const searcher = new UsersSearcher(new PostgresUserRepository(new PostgresConnection()));

export async function GET(request: Request): Promise<NextResponse<Primitives<User>[]> | Response> {
	const { searchParams } = new URL(request.url);

	const ids = searchParams.get("ids")?.split(",") as string[];

	return executeWithErrorHandling(async () => {
		const user = await searcher.search(ids);

		return HttpNextResponse.json(user);
	});
}
