import { expect, it, describe, beforeEach, mock, afterEach, spyOn } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { OpenAuthService } from "./oauth.service";
import type { SignUpInput, SignInInput, SessionCookie } from "@shared/common/types";
import { AppError } from "@utils/appErrors";
import { resetDatabase } from "@utils/test";
import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { generateState } from "arctic";

mock.module("arctic", () => ({
	generateState: () => faker.word.noun(),
	Discord: class {
		createAuthorizationURL() {
			return new URL(`http://${faker.internet.domainName()}`);
		}
		validateAuthorizationCode() {
			return Promise.resolve({});
		}
	},
}));

describe("OpenAuthService", () => {
	let service: OpenAuthService;
	let prismaService: PrismaService;
	let luciaService: LuciaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule],
			providers: [OpenAuthService, PrismaService, LuciaService],
		}).compile();

		service = module.get<OpenAuthService>(OpenAuthService);
		prismaService = module.get<PrismaService>(PrismaService);
		luciaService = module.get<LuciaService>(LuciaService);

		await resetDatabase();
		service.onModuleInit();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getDiscordAuthUrl", () => {
		it("should give a valid url and state", async () => {
			const res = await service.getDiscordAuthUrl();
			expect(res).toHaveProperty("state");
			expect(res).toHaveProperty("url");
		});
	});

	describe("handleDiscordCallback", () => {
		beforeEach(() => {
			const mockFetch = mock(
				async () =>
					new Response(
						JSON.stringify({
							id: faker.string.numeric({ length: 15 }),
							email: faker.internet.email(),
							username: faker.internet.userName(),
						}),
					),
			);
			global.fetch = mockFetch;
		});

		afterEach(() => {
			// @ts-ignore-next-line
			global.fetch.mockRestore();
		});
		it("should return a session cookie", async () => {
			const res = await service.handleDiscordCallback(faker.string.alphanumeric());
			expect(res).toHaveProperty("id");
			expect(res).toHaveProperty("expiresAt");
		});

		it("reject if no params passed", async () => {
			expect(service.handleDiscordCallback(undefined)).rejects.toThrow(AppError);
		});

		it("dont create user if already exists", async () => {
			// @ts-ignore-next-line
			prismaService.oAuthAccount.findFirst = mock(() =>
				Promise.resolve({ user: { id: faker.string.numeric({ length: 15 }) } }),
			);

			// @ts-ignore-next-line
			prismaService.session.create = mock(() => ({
				value: faker.string.numeric({ length: 10 }),
				expiresAt: faker.date.future(),
			}));
			// @ts-ignore-next-line
			luciaService.createSessionCookie = mock(async () => ({
				id: faker.string.numeric({ length: 10 }),
			}));
			// @ts-ignore-next-line
			luciaService.createSession = mock(() => ({
				value: faker.string.numeric({ length: 10 }),
				expiresAt: faker.date.future(),
			}));

			const createOAuthAccount = spyOn(prismaService.oAuthAccount, "create");
			const createAccount = spyOn(prismaService.user, "create");
			const createSession = spyOn(prismaService.session, "create");

			const res = await service.handleDiscordCallback(faker.string.alphanumeric());
			expect(res).toHaveProperty("id");
			expect(res).toHaveProperty("expiresAt");
			expect(createOAuthAccount).not.toHaveBeenCalled();
			expect(createAccount).not.toHaveBeenCalled();
			expect(createSession).toHaveBeenCalled();

			mock.restore();
		});
	});
});
