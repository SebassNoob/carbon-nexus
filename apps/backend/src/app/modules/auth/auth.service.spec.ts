import { expect, it, describe, beforeEach, jest, mock } from "bun:test";
import { Test, type TestingModule } from "@nestjs/testing";
import { PrismaService, LuciaService } from "@db/client";
import { AuthService } from "./auth.service";
import { SignUpInput, SignInInput } from "@shared/common/types";
import { AppError } from "@utils/appErrors";
import { mockDeep } from "jest-mock-extended";

mock.module("lucia", () => ({
	generateIdFromEntropySize: jest.fn(() => "123"),
}));

mock.module("bun", () => ({
	password: {
		hash: jest.fn(() => ""),
		verify: jest.fn(() => true),
	},
}));

const PrismaServiceMock = mockDeep<PrismaService>({
	user: {
		create: jest.fn().mockImplementation((params) => {
			return {
				id: "123",
				username: params.data.username,
				email: params.data.email,
				passwordHash: "",
				createdAt: new Date(),
			};
		}),
		findFirst: jest.fn().mockImplementation((params) => {
			return {
				id: "123",
				email: params.where.email,
				passwordHash: "",
			};
		}),
	},
});

export const LuciaServiceMock = mockDeep<LuciaService>({
	createSession: jest.fn().mockImplementation((userId, options) => {
		return {
			id: "123",
			userId,
			expiresAt: new Date(),
			fresh: true,
		};
	}),
	createSessionCookie: jest.fn().mockImplementation((sessionId) => {
		return {
			name: "session",
			value: sessionId,
			attributes: {
				secure: true,
				httpOnly: true,
			},
			serialize() {
				return `${this.name}=${this.value}; Secure; HttpOnly; SameSite=Lax; Path=/`;
			},
		};
	}),
});

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: PrismaService, useValue: PrismaServiceMock },
				{ provide: LuciaService, useValue: LuciaServiceMock },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("generateUserId", () => {
		it("should return a string", () => {
			const result = service["generateUserId"]();
			expect(typeof result).toBe("string");
		});
	});

	describe("hashPassword", () => {
		it("should return a hashed password", async () => {
			const result = await service["hashPassword"]("password");
			expect(typeof result).toBe("string");
			expect(result).not.toBe("password");
		});
	});

	describe("signUp", () => {
		it("should create a new user and return a session cookie", async () => {
			const input: SignUpInput = {
				username: "test",
				email: "lol@gmail.com",
				password: "Admin123!",
				repeatPassword: "Admin123!",
			};

			const result = await service.signUp(input);

			expect(PrismaServiceMock.user.create).toHaveBeenCalledWith({
				data: {
					id: expect.any(String),
					username: "test",
					email: "lol@gmail.com",
					passwordHash: expect.any(String),
				},
			});

			expect(LuciaServiceMock.createSession).toHaveBeenCalled();
			expect(LuciaServiceMock.createSessionCookie).toHaveBeenCalled();

			expect(result).toEqual({
				id: expect.any(String),
				expiresAt: expect.any(Date),
			});
		});
	});

	describe("signIn", () => {
		it("should authenticate a user and return a session cookie", async () => {
			const input: SignInInput = {
				email: "lol@gmail.com",
				password: "Admin123!",
			};

			const result = await service.signIn(input);

			expect(PrismaServiceMock.user.findFirst).toHaveBeenCalledWith({
				where: { email: "lol@gmail.com" },
			});

			expect(LuciaServiceMock.createSession).toHaveBeenCalled();
			expect(LuciaServiceMock.createSessionCookie).toHaveBeenCalled();

			expect(result).toEqual({
				id: expect.any(String),
				expiresAt: expect.any(Date),
			});
		});

		it("should throw an error if user is not found", async () => {
			const input: SignInInput = {
				email: "lol@gmail.com",
				password: "Admin123!",
			};

			PrismaServiceMock.user.findFirst.mockResolvedValueOnce(null);

			await expect(service.signIn(input)).rejects.toThrow(AppError);
			await expect(service.signIn(input)).rejects.toMatchObject({
				status: 404,
				name: "UserNotFound",
			});
		});

		it("should throw an error if password is invalid", async () => {
			const input: SignInInput = {
				email: "lol@gmail.com",
				password: "Admin123!",
			};

			PrismaServiceMock.user.findFirst.mockResolvedValue({
				id: "123",
				email: "lol@gmail.com",
				passwordHash: "hashedPassword",
				username: "jjj",
				createdAt: new Date(),
			});

			await expect(service.signIn(input)).rejects.toThrow(AppError);
			await expect(service.signIn(input)).rejects.toMatchObject({
				status: 403,
				name: "InvalidCredentials",
			});
		});
	});

	/*
  describe("signOut", () => {
    it("should invalidate a session", async () => {
      const sessionId: SessionId = { sessionId: "123" };

      await service.signOut(sessionId);

      expect(LuciaServiceMock.invalidateSession).toHaveBeenCalledWith("123");
    });
  });

  describe("getUserFromSession", () => {
    it("should retrieve a user from a session", async () => {
      const sessionId: SessionId = { sessionId: "123" };

      PrismaServiceMock.session.findFirst.mockResolvedValue({
        id: "123",
        userId: "456",
      });

      PrismaServiceMock.user.findFirst.mockResolvedValue({
        id: "456",
        username: "test",
        email: "lol@gmail.com",
        createdAt: new Date(),
      });

      const result = await service.getUserFromSession(sessionId);

      expect(PrismaServiceMock.session.findFirst).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(PrismaServiceMock.user.findFirst).toHaveBeenCalledWith({
        where: { id: "456" },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      expect(result).toEqual({
        id: "456",
        username: "test",
        email: "lol@gmail.com",
        createdAt: expect.any(Date),
      });
    });

    it("should throw an error if session is not found", async () => {
      const sessionId: SessionId = { sessionId: "123" };

      PrismaServiceMock.session.findFirst.mockResolvedValue(null);

      await expect(service.getUserFromSession(sessionId)).rejects.toThrow(AppError);
      await expect(service.getUserFromSession(sessionId)).rejects.toThrow(AppErrorTypes.UserNotFound);
    });

    it("should throw an error if user is not found", async () => {
      const sessionId: SessionId = { sessionId: "123" };

      PrismaServiceMock.session.findFirst.mockResolvedValue({
        id: "123",
        userId: "456",
      });

      PrismaServiceMock.user.findFirst.mockResolvedValue(null);

      await expect(service.getUserFromSession(sessionId)).rejects.toThrow(AppError);
      await expect(service.getUserFromSession(sessionId)).rejects.toThrow(AppErrorTypes.UserNotFound);
    });
  });
  */
});
