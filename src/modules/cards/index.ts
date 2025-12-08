import Elysia, { t } from 'elysia';
import { CardsService } from './service';

export const cards = new Elysia({
	prefix: '/v4',
}).get(
	'/cards',
	async ({ query }) => {
		if (query.pack) {
			return CardsService.getCardsByPack(query.pack);
		}

		return CardsService.getAllCards();
	},
	{
		query: t.Object({
			pack: t.Optional(t.String()),
		}),
	}
);
