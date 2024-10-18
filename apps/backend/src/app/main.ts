import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppErrorFilter } from "@filters";
import { LoggingInterceptor, StandardInterceptor } from "@interceptors";
import cookieParser from "cookie-parser";

export async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: [process.env.FRONTEND_URL ?? "", "http://localhost:3000"],
		credentials: true,
	});
	app.use(cookieParser());
	app.useGlobalFilters(new AppErrorFilter());
	app.useGlobalInterceptors(new StandardInterceptor());
	if (process.env.NODE_ENV === "production") app.useGlobalInterceptors(new LoggingInterceptor());

	await app.listen(8080, "0.0.0.0");
}
