import Elysia from 'elysia';
import { z } from 'zod';
import { CardsService } from './service';

const querySchema = z.object({
	pack: z.string().optional(),
});

export const cards = new Elysia({
	prefix: '/v4',
}).get('/cards', async ({ query }) => {
	const parsed = querySchema.parse(query);

	if (parsed.pack) {
		return CardsService.getCardsByPack(parsed.pack);
	}

	return CardsService.getAllCards();
});
