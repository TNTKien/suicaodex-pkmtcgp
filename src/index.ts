import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
// import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { expansions } from './modules/expansions';
import { cards } from './modules/cards';
import { pull } from './modules/pull';
import { rateLimit } from 'elysia-rate-limit';
import { type ApiResponse, RateLimitError } from './utils/types';

export default new Elysia({
	// adapter: CloudflareAdapter,
	aot: false,
})
	.use(
		rateLimit({
			max: 36, // max requests during 1 duration timeframe
			duration: 60000, // 1 minute
			errorResponse: new RateLimitError(),
		})
	)
	.use(cors())
	.error({
		RATE_LIMITED: RateLimitError,
	})
	.onError(({ error, code, set }): ApiResponse => {
		// https://elysiajs.com/essential/life-cycle.html#error-code
		
		// Handle rate limit error
		if (code === 'RATE_LIMITED' || error instanceof RateLimitError) {
			set.status = 429;
			return {
				success: false,
				message: 'Too many requests, please try again later.',
				data: null,
				error: {
					code: 'RATE_LIMIT_EXCEEDED',
					details: [{ message: 'You have exceeded the maximum number of requests allowed.' }],
				},
			};
		}

		if (code === 'NOT_FOUND') {
			set.status = 404;
			return {
				success: false,
				message: 'Resource not found',
				data: null,
				error: {
					code: 'NOT_FOUND',
					details: [{ message: 'The requested resource was not found' }],
				},
			};
		}

		if (code === 'VALIDATION') {
			set.status = 400;
			return {
				success: false,
				message: 'Validation error',
				data: null,
				error: {
					code: 'VALIDATION',
					details: [{ message: error.message }],
				},
			};
		}

		if (code === 'INTERNAL_SERVER_ERROR') {
			console.error(error);
			set.status = 500;
			return {
				success: false,
				message: 'Internal server error',
				data: null,
				error: {
					code: 'INTERNAL_SERVER_ERROR',
					details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
				},
			};
		}

		// Handle numeric HTTP status codes (excluding 429 which is handled by RATE_LIMITED)
		if (typeof code === 'number' && code !== 429) {
			set.status = code;
			return {
				success: false,
				message: `HTTP ${code} error`,
				data: null,
				error: {
					code: `HTTP_${code}`,
					details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
				},
			};
		}

		// fallback for UNKNOWN and other cases
		console.error(error);
		set.status = 500;
		return {
			success: false,
			message: 'Unknown error',
			data: null,
			error: {
				code: code === 'UNKNOWN' ? 'UNKNOWN' : 'INTERNAL_ERROR',
				details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
			},
		};
	})
	.get(
		'/',
		(): ApiResponse => ({
			success: true,
			message: 'Hiii~~! Kibun wa dou?',
			data: null,
			error: null,
		})
	)
	.get(
		'/philia093',
		(): ApiResponse => ({
			success: true,
			message: 'See you *tomorrow*.',
			data: null,
			error: null,
		})
	)

	//get expansions list
	.use(expansions)

	//get cards list
	.use(cards)

	//pull packs
	.use(pull)

	// This is required to make Elysia work on Cloudflare Worker
	.compile();
