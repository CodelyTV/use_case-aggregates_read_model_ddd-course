import { User } from "../../../../../src/contexts/shop/users/domain/User";
import { UserId } from "../../../../../src/contexts/shop/users/domain/UserId";
import { UserRepository } from "../../../../../src/contexts/shop/users/domain/UserRepository";

export class MockUserRepository implements UserRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();

	private readonly searchQueue: Map<string, User[]> = new Map();

	async save(user: User): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(user.toPrimitives());

		return Promise.resolve();
	}

	async search(id: UserId): Promise<User | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		const user = (this.searchQueue.get(id.value) ?? []).shift() ?? null;
		this.mockSearch.mockReturnValueOnce(user);

		return this.mockSearch() as Promise<User | null>;
	}

	shouldSave(user: User): void {
		this.mockSave(user.toPrimitives());
	}

	shouldSearch(user: User): void {
		this.mockSearch(user.id);

		if (!this.searchQueue.has(user.id.value)) {
			this.searchQueue.set(user.id.value, []);
		}

		this.searchQueue.get(user.id.value)?.push(user);
	}

	shouldSearchAndReturnNull(id: UserId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}
}
