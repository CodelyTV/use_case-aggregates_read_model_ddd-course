import postgres from "postgres";

export class PostgresConnection {
	private sqlInstance: postgres.Sql | null = null;

	private get sql(): postgres.Sql {
		if (!this.sqlInstance) {
			this.sqlInstance = postgres({
				host: "localhost",
				port: 5432,
				user: "codely",
				password: "c0d3ly7v",
				database: "ecommerce",
			});
		}

		return this.sqlInstance;
	}

	async searchOne<T>(query: string): Promise<T | null> {
		return (await this.sql.unsafe(query))[0] as T;
	}

	async searchAll<T>(query: string): Promise<T[]> {
		return (await this.sql.unsafe(query)) as T[];
	}

	async execute(query: string): Promise<void> {
		await this.sql.unsafe(query);
	}
}
