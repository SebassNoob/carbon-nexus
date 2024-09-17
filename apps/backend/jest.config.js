module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.spec.ts"],
	setupFilesAfterEnv: ["<rootDir>/src/db/client/prisma.spec.ts"],
};
