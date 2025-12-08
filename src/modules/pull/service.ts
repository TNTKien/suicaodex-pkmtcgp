import type { Card } from '../../utils/types';
import type { Rarity } from '../../utils/rarity';
import { RARITY_PROBABILITIES_BY_ROW } from '../../utils/rarity';

export const PullService = {
	/**
	 * Pull 1 pack (5 cards) from the given cards pool based on rarity probabilities
	 */
	pullPack(cards: Card[]): Card[] {
		const pack: Card[] = [];

		// Pull 5 cards
		for (let position = 1; position <= 5; position++) {
			const card = this.pullCard(cards, position);
			if (card) {
				pack.push(card);
			}
		}

		return pack;
	},

	/**
	 * Pull a single card based on position in pack
	 */
	pullCard(cards: Card[], position: number): Card | null {
		let probabilities: Record<string, number>;

		// Determine probabilities based on card position
		if (position <= 3) {
			probabilities = RARITY_PROBABILITIES_BY_ROW['1-3 card'];
		} else if (position === 4) {
			probabilities = RARITY_PROBABILITIES_BY_ROW['4 card'];
		} else {
			probabilities = RARITY_PROBABILITIES_BY_ROW['5 card'];
		}

		// Select rarity based on probabilities
		const rarity = this.selectRarityByProbability(probabilities);

		// Filter cards by rarity
		const cardsWithRarity = cards.filter((card) => card.rarity === rarity);

		if (cardsWithRarity.length === 0) {
			return null;
		}

		// Randomly select a card from the filtered list
		const randomIndex = Math.floor(Math.random() * cardsWithRarity.length);
		return cardsWithRarity[randomIndex];
	},

	/**
	 * Select a rarity based on probability distribution
	 */
	selectRarityByProbability(
		probabilities: Record<string, number>
	): Rarity | null {
		const random = Math.random();
		let cumulativeProbability = 0;

		for (const [rarity, probability] of Object.entries(probabilities)) {
			cumulativeProbability += probability;
			if (random <= cumulativeProbability) {
				return rarity as Rarity;
			}
		}

		return null;
	},
};
