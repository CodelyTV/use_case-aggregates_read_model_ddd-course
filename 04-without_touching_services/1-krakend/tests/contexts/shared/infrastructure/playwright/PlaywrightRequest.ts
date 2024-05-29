import type { APIRequestContext, APIResponse } from "playwright-core";

import { expect } from "./PlaywrightTest";

interface PlaywrightRequestHandler {
	put: (path: string, body: Record<string, unknown>) => Promise<APIResponse>;
	get: (path: string) => Promise<APIResponse>;
	getExpecting: (
		path: string,
		statusCode: number,
		expectedResponse: Record<string, unknown> | Record<string, unknown>[],
	) => Promise<APIResponse>;
}

export function PlaywrightRequest(request: APIRequestContext): PlaywrightRequestHandler {
	return {
		async put(path: string, body: Record<string, unknown>): Promise<APIResponse> {
			return await request.put(path, {
				data: body,
				headers: {
					"Content-Type": "application/json",
				},
			});
		},
		async get(path: string): Promise<APIResponse> {
			return await request.get(path);
		},
		async getExpecting(
			path: string,
			statusCode: number,
			expectedResponse: Record<string, unknown> | Record<string, unknown>[],
		): Promise<APIResponse> {
			const response = await request.get(path);
			const responseBody = await response.json();

			expect(response.status()).toBe(statusCode);
			expect(responseBody).toEqual(expectedResponse);

			return response;
		},
	};
}
