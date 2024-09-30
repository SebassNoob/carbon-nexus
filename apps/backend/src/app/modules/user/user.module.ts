import { Module } from "@nestjs/common";
import { PrismaService } from "@db/client";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
	providers: [UserService, PrismaService],
	controllers: [UserController],
})
export class UserModule {}
