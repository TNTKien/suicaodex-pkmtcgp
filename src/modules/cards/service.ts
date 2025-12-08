import { env } from 'cloudflare:workers';
import type { Card } from '../../utils/types';

export const CardsService = {
	async getAllCards(): Promise<Card[]> {
		const response = await fetch(env.CARDS_API_URL);
		return response.json();
	},

	async getCardsByPack(pack: string): Promise<Card[]> {
		const allCards = await this.getAllCards();
		return allCards.filter(
			(card) => card.pack.toLowerCase() === pack.toLowerCase()
		);
	},
};
