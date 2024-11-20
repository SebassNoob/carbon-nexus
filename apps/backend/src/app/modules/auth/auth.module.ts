import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DbClientModule, LuciaService, PrismaService } from "@db/client";
import { UserModule } from "../user";

@Module({
	imports: [DbClientModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService, LuciaService, PrismaService],
})
export class AuthModule {}
