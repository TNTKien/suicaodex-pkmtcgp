import Elysia from 'elysia';
import { z } from 'zod';
import { CardsService } from '../cards/service';
import { PullService } from './service';

const pullQuerySchema = z.object({
	pack: z.string().min(1, 'Pack parameter is required'),
});

export const pull = new Elysia({
	prefix: '/v4',
}).get('/pull', async ({ query, set }) => {
	// Validate query params with Zod
	const result = pullQuerySchema.safeParse(query);

	if (!result.success) {
		set.status = 400;
		return {
			success: false,
			message: result.error.issues[0].message,
		};
	}

	const { pack } = result.data;

	// Get all cards from the specified pack
	const cards = await CardsService.getCardsByPack(pack);

	if (cards.length === 0) {
		set.status = 404;
		return {
			success: false,
			message: `No cards found for pack: ${pack}`,
		};
	}

	// Pull 5 cards
	const pulledCards = PullService.pullPack(cards);

	if (pulledCards.length === 0) {
		set.status = 500;
		return {
			success: false,
			message: 'Failed to pull cards from pack',
		};
	}

	return {
		success: true,
		pack,
		cards: pulledCards,
	};
});
