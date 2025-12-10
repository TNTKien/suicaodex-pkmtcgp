import Elysia from 'elysia';
import { z } from 'zod';
import { CardsService } from '../cards/service';
import { PullService } from './service';
import { type ApiResponse } from '../../utils/types';

const pullQuerySchema = z.object({
	pack: z.string().min(1, 'Pack parameter is required'),
});

export const pull = new Elysia({
	prefix: '/v4',
}).get('/pull', async ({ query, set }): Promise<ApiResponse> => {
	// Validate query params with Zod
	const result = pullQuerySchema.safeParse(query);

	if (!result.success) {
		set.status = 400;
		return {
			success: false,
			message: 'Validation failed',
			data: null,
			error: {
				code: 'VALIDATION_ERROR',
				details: result.error.issues.map(issue => ({
					field: issue.path.join('.'),
					message: issue.message,
				})),
			},
		};
	}

	const { pack } = result.data;

	try {
		// Get all cards from the specified pack
		const cards = await CardsService.getCardsByPack(pack);

		if (cards.length === 0) {
			set.status = 404;
			return {
				success: false,
				message: 'Pack not found',
				data: null,
				error: {
					code: 'PACK_NOT_FOUND',
					details: [{ field: 'pack', message: `No cards found for pack: ${pack}` }],
				},
			};
		}

		// Pull 5 cards
		const pulledCards = PullService.pullPack(cards);

		if (pulledCards.length === 0) {
			set.status = 500;
			return {
				success: false,
				message: 'Failed to pull cards',
				data: null,
				error: {
					code: 'PULL_ERROR',
					details: [{ message: 'Failed to pull cards from pack' }],
				},
			};
		}

		return {
			success: true,
			message: `Successfully pulled ${pulledCards.length} cards from pack '${pack}'`,
			data: pulledCards,
			error: null,
		};
	} catch (error) {
		set.status = 500;
		return {
			success: false,
			message: 'An unexpected error occurred',
			data: null,
			error: {
				code: 'INTERNAL_ERROR',
				details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
			},
		};
	}
});
