import { expect, it, describe, beforeEach } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { AuthService } from "./auth.service";
import type { SignUpInput, SignInInput, TokenCookie } from "@shared/common/types";
import { AppError } from "@utils/appErrors";
import { resetDatabase } from "@utils/test";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { UserModule, UserService } from "../user";

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [AuthService, PrismaService, LuciaService, UserService],
		}).compile();

		service = module.get<AuthService>(AuthService);
		await resetDatabase();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("signUp", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};

		it("should create a new user", async () => {
			const cookie = await service.signUp(testInput);
			expect(cookie).toBeDefined();
			expect(cookie.value).toBeDefined();
			expect(cookie.expiresAt).toBeDefined();
		});

		it("should throw an error for duplicate account", async () => {
			expect(service.signUp(testInput)).resolves.toBeDefined();
			expect(service.signUp(testInput)).rejects.toThrow(AppError);
		});

		it("Invalid email should throw an error", async () => {
			const invalidInput = { ...testInput, email: new Date() };
			// @ts-expect-error
			expect(service.signUp(invalidInput)).rejects.toThrow(AppError);
		});
	});

	describe("signIn", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		beforeEach(async () => {
			await service.signUp(testInput);
		});

		it("should sign in a user", async () => {
			const input: SignInInput = {
				email: testInput.email,
				password: testInput.password,
			};

			const cookie = await service.signIn(input);
			expect(cookie).toBeDefined();
			expect(cookie.value).toBeDefined();
			expect(cookie.expiresAt).toBeDefined();
		});

		it("should throw an error if user is not found", async () => {
			const input: SignInInput = {
				email: "haha@gmail.com",
				password: "Password!123",
			};

			expect(service.signIn(input)).rejects.toThrow(AppError);
		});

		it("should throw an error if password is invalid", async () => {
			const input: SignInInput = {
				email: testInput.email,
				password: "invalid-password",
			};

			expect(service.signIn(input)).rejects.toThrow(AppError);
		});
	});

	describe("signOut", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		let cookie: TokenCookie;
		beforeEach(async () => {
			cookie = await service.signUp(testInput);
		});
		it("should sign out a user", async () => {
			await service.signOut(cookie.value);
			expect(service.getUserFromSession(cookie.value)).rejects.toThrow(AppError);
		});

		it("should throw an error if session is not found", async () => {
			expect(service.signOut("invalid-id")).rejects.toThrow(AppError);
		});
	});

	describe("getUser", () => {
		const testInput: SignUpInput = {
			email: faker.internet.email(),
			username: faker.internet.username(),
			password: "Password!123",
			repeatPassword: "Password!123",
		};
		let cookie: TokenCookie;
		beforeEach(async () => {
			cookie = await service.signUp(testInput);
		});
		it("should get a user", async () => {
			const user = await service.getUserFromSession(cookie.value);
			expect(user).toBeDefined();
			expect(user.id).toBeDefined();
			expect(user.username).toBe(testInput.username);
		});

		it("should throw an error if session is not found", async () => {
			expect(service.getUserFromSession("invalid-id")).rejects.toThrow(AppError);
		});
	});
});
