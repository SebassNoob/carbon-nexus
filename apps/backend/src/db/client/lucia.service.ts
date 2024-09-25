import { Injectable } from "@nestjs/common";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: enforce the forwarding of calls
export class LuciaService {
	private lucia: Lucia;

	constructor(
		private readonly configService: ConfigService,
		private prismaService: PrismaService,
	) {
		const adapter = new PrismaAdapter(this.prismaService.session, this.prismaService.user);
		this.lucia = new Lucia(adapter, {
			sessionCookie: {
				expires: false,
				attributes: {
					secure: this.configService.get<string>("NODE_ENV") === "production",
				},
			},
			getUserAttributes: (attributes) => ({
				email: attributes.email,
			}),
		});

		// biome-ignore lint/correctness/noConstructorReturn: allow calls to this object be forwarded to the lucia instance
		return new Proxy(this, {
			get: (target, prop: string | symbol) => {
				if (prop in target.lucia) {
					return target.lucia[prop as keyof typeof target.lucia];
				}
				return target[prop as keyof typeof target];
			},
		});
	}
}

export interface LuciaService extends Lucia {}

declare module "lucia" {
	interface Register {
		Lucia: typeof LuciaService;
		DatabaseUserAttributes: {
			email: string;
		};
	}
}
