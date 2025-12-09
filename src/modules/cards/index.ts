import Elysia from 'elysia';
import { z } from 'zod';
import { CardsService } from './service';
import { type ApiResponse } from '../../utils/types';

const querySchema = z.object({
	pack: z.string().optional(),
});

export const cards = new Elysia({
	prefix: '/v4',
}).get('/cards', async ({ query, set }): Promise<ApiResponse> => {
	try {
		const parsed = querySchema.parse(query);

		const data = parsed.pack
			? await CardsService.getCardsByPack(parsed.pack)
			: await CardsService.getAllCards();

		return {
			success: true,
			message: parsed.pack 
				? `Cards for pack '${parsed.pack}' retrieved successfully` 
				: 'All cards retrieved successfully',
			data,
			error: null,
		};
	} catch (error) {
		set.status = 400;
		return {
			success: false,
			message: 'Failed to retrieve cards',
			data: null,
			error: {
				code: 'CARDS_FETCH_ERROR',
				details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
			},
		};
	}
});
