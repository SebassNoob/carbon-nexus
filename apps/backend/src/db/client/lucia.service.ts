import { Injectable } from "@nestjs/common";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaService } from "./prisma.service";

@Injectable()
export class LuciaService {
    private lucia: Lucia;

    constructor(private prismaService: PrismaService) {
        const adapter = new PrismaAdapter(
            this.prismaService.session,
            this.prismaService.user,
        );
        this.lucia = new Lucia(adapter, {
            sessionCookie: {
                expires: false,
                attributes: {
                    secure: process.env.NODE_ENV === "production",
                },
            },
            getUserAttributes: (attributes) => ({
                email: attributes.email,
            }),
        });

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
		// biome-ignore lint: these are internals of Lucia typings
		Lucia: typeof LuciaService;
		DatabaseUserAttributes: {
			email: string;
		};
	}
}
