import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppErrorFilter } from "./exceptions.filter";
import cookieParser from "cookie-parser";

export async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	});
	app.use(cookieParser());
	app.useGlobalFilters(new AppErrorFilter());
	await app.listen(8080, "0.0.0.0");
}
