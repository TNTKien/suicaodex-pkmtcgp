import type { Expansion } from '../../utils/types';
import { env } from 'cloudflare:workers';

export const ExpansionsService = {
	async getAllExpansions(): Promise<Expansion[]> {
		const response = await fetch(env.EXPANSIONS_API_URL);
		return response.json();
	},

	async getExpansionById(id: string): Promise<Expansion | null> {
		const all = await this.getAllExpansions();
		return all.find((e) => e.id.toLowerCase() === id.toLowerCase()) ?? null;
	},
};
