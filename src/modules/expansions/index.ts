import { Elysia } from 'elysia';
import { z } from 'zod';
import { ExpansionsService } from './service';
import { type ApiResponse } from '../../utils/types';

const paramsSchema = z.object({
	id: z.string(),
});

export const expansions = new Elysia({
	prefix: '/v4',
})
	.get('/expansions', async (): Promise<ApiResponse> => {
		try {
			const data = await ExpansionsService.getAllExpansions();
			return {
				success: true,
				message: 'Expansions retrieved successfully',
				data,
				error: null,
			};
		} catch (error) {
			return {
				success: false,
				message: 'Failed to retrieve expansions',
				data: null,
				error: {
					code: 'EXPANSIONS_FETCH_ERROR',
					details: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
				},
			};
		}
	})
	.get('/expansions/:id', async ({ params, set }): Promise<ApiResponse> => {
		try {
			const parsed = paramsSchema.parse(params);
			const exp = await ExpansionsService.getExpansionById(parsed.id);
			
			if (!exp) {
				set.status = 404;
				return {
					success: false,
					message: 'Expansion not found',
					data: null,
					error: {
						code: 'EXPANSION_NOT_FOUND',
						details: [{ field: 'id', message: `Expansion with id '${parsed.id}' not found` }],
					},
				};
			}
			
			return {
				success: true,
				message: 'Expansion retrieved successfully',
				data: exp,
				error: null,
			};
		} catch (error) {
			set.status = 400;
			return {
				success: false,
				message: 'Invalid request',
				data: null,
				error: {
					code: 'VALIDATION_ERROR',
					details: [{ message: error instanceof Error ? error.message : 'Invalid request' }],
				},
			};
		}
	});
