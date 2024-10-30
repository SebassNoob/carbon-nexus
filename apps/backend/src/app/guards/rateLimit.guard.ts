import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";
import type { Request } from "express";
import { AppError, AppErrorTypes } from "@utils/appErrors";

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
	protected async throwThrottlingException(
		context: ExecutionContext,
		throttlerLimitDetail: ThrottlerLimitDetail,
	): Promise<void> {
		const path = context.switchToHttp().getRequest<Request>().path;
		const { limit, ttl, timeToBlockExpire } = throttlerLimitDetail;
		// ttl in milliseconds, timeToBlockExpire in seconds
		throw new AppError(AppErrorTypes.RateLimitExceeded(limit, ttl / 1000, timeToBlockExpire));
	}
}
