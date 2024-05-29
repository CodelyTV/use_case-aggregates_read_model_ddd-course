import { test as base } from "@playwright/test";

import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/PostgresConnection";

const databaseConnection = new PostgresConnection();

export const test = base.extend<{ testHook: void }>({
	testHook: [
		async ({}, test) => {
			await databaseConnection.truncateAll();

			await test();
		},
		{ auto: true },
	],
});

export { expect } from "@playwright/test";
