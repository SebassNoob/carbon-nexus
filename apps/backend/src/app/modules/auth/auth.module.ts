import { Module } from "@nestjs/common";
import { PasswordAuthService } from "./passwordAuth.service";
import { OpenAuthService } from "./openAuth.service";
import { AuthController } from "./auth.controller";
import { DbClientModule, LuciaService, PrismaService } from "@db/client";

@Module({
	imports: [DbClientModule],
	controllers: [AuthController],
	providers: [PasswordAuthService, OpenAuthService, LuciaService, PrismaService],
})
export class AuthModule {}
