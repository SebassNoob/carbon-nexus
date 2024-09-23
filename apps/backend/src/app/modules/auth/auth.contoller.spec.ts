import { expect, it, describe, beforeEach, beforeAll } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import type { SignUpInput, SignInInput, SessionCookie } from "@shared/common/types";
import { AppError } from "@utils/appErrors";
import { resetDatabase, testFetch } from "@utils/test";
import type { INestApplication } from "@nestjs/common";
import { faker } from "@faker-js/faker";

describe("AuthController", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, PrismaService, LuciaService],
			controllers: [AuthController],
		}).compile();

		app = module.createNestApplication();
		await app.init();
	});

	beforeEach(async () => {
		await resetDatabase();
	});

	describe("/signup", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		it("should create a new user", async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
				callback: (response) => {
					expect(response.status).toBe(201);
					expect(response.headers["set-cookie"]).toBeDefined();
					expect(response.headers["set-cookie"][0]).toContain("sessionId=");
				},
			});
		});
	});

	describe("/signin", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};

		beforeEach(async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
			});
		});

		it("should sign in a user", async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: {
						email: testInput.email,
						password: testInput.password,
					} satisfies SignInInput,
					path: "/auth/signin",
				},
				callback: (response) => {
					expect(response.status).toBe(201);
					expect(response.headers["set-cookie"]).toBeDefined();
					expect(response.headers["set-cookie"][0]).toContain("sessionId=");
				},
			});
		});
	});

	describe("/signout", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		let cookie: string;
		beforeEach(async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
				callback: (response) => {
					cookie = (response.headers["set-cookie"] as unknown as string[])[0]
						.split("; ")[0]
						.replace("sessionId=", "");
				},
			});
		});

		it("should sign out a user", async () => {
			await testFetch({
				init: {
					app,
					method: "DELETE",
					path: `/auth/signout/${cookie}`,
				},
				callback: (response) => {
					console.log(response.text);
					expect(response.status).toBe(204);
				},
			});
		});
	});
	describe("/user", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		let cookie: string;
		beforeEach(async () => {
			await testFetch({
				init: {
					app,
					method: "POST",
					body: testInput,
					path: "/auth/signup",
				},
				callback: (response) => {
					cookie = (response.headers["set-cookie"] as unknown as string[])[0]
						.split("; ")[0]
						.replace("sessionId=", "");
				},
			});
		});

		it("should get a user", async () => {
			await testFetch({
				init: {
					app,
					method: "GET",

					path: "/auth/user?sessionId=" + cookie,
				},
				callback: (response) => {
					expect(response.status).toBe(200);
					expect(response.body).toBeDefined();
				},
			});
		});
	});
});
