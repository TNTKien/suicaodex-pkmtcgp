import { Elysia } from 'elysia';
import { PacksService } from './service';
import { type ApiResponse } from '../../utils/types';

export const packs = new Elysia({
	prefix: '/v4',
})
	.get('/packs', async (): Promise<ApiResponse> => {
		try {
			const data = await PacksService.getAllPacks();
			return {
				success: true,
				message: 'Packs retrieved successfully',
				data,
				error: null,
			};
		} catch (error) {
			return {
				success: false,
				message: 'Failed to retrieve packs',
				data: null,
				error: {
					code: 'PACKS_FETCH_ERROR',
					details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
				},
			};
		}
	});
