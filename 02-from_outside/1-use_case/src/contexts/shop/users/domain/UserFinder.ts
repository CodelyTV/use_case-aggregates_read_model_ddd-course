import { User } from "./User";
import { UserDoesNotExistError } from "./UserDoesNotExistError";
import { UserId } from "./UserId";
import { UserRepository } from "./UserRepository";

export class UserFinder {
	constructor(private readonly repository: UserRepository) {}

	async find(id: string): Promise<User> {
		const user = await this.repository.search(new UserId(id));

		if (!user) {
			throw new UserDoesNotExistError(id);
		}

		return user;
	}
}
