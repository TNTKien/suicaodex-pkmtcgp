import type { Pack } from '../../utils/types';
import { ExpansionsService } from '../expansions/service';

const excludePackIds = ["booster", "promo"];

export const PacksService = {
	async getAllPacks(): Promise<Pack[]> {
		const expansions = await ExpansionsService.getAllExpansions();
		const allPacks: Pack[] = [];
		
		for (const expansion of expansions) {
			const filteredPacks = expansion.packs.filter(pack => 
				!excludePackIds.some(excludedId => pack.id.toLowerCase().includes(excludedId.toLowerCase()))
			);
			allPacks.push(...filteredPacks);
		}
		
		return allPacks;
	},
};
