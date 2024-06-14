import { Primitives } from "@codelytv/primitives-type";

import { User } from "../../domain/User";
import { UserId } from "../../domain/UserId";
import { UserRepository } from "../../domain/UserRepository";

export class UsersSearcher {
	constructor(private readonly repository: UserRepository) {}

	async search(ids: string[]): Promise<Primitives<User>[]> {
		const users = await this.repository.byIds(ids.map((id) => new UserId(id)));

		return users.map((user) => user.toPrimitives());
	}
}
