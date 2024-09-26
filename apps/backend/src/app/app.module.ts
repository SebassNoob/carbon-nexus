import { Module } from "@nestjs/common";
import { AuthModule, OpenAuthModule } from "./modules";
import { ConfigModule } from "@nestjs/config";

let envFilePath: string;
switch (process.env.NODE_ENV) {
	case "production":
		envFilePath = ".env.production";
		break;
	case "development":
		envFilePath = ".env.development";
		break;
	case "testing":
		envFilePath = ".env.testing";
		break;
	default:
		envFilePath = ".env.development";
}

@Module({
	imports: [
		AuthModule,
		OpenAuthModule,
		ConfigModule.forRoot({
			envFilePath: [envFilePath, ".env.local"],
			isGlobal: true,
		}),
	],
})
export class AppModule {}
