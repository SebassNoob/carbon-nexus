import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppErrorFilter } from "./exceptions.filter";

export async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new AppErrorFilter());
	await app.listen(8080);
}
