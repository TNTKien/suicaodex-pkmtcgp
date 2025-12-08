import { Elysia } from 'elysia';
import { z } from 'zod';
import { ExpansionsService } from './service';

const paramsSchema = z.object({
	id: z.string(),
});

export const expansions = new Elysia({
	prefix: '/v4',
})
	.get('/expansions', async () => {
		return ExpansionsService.getAllExpansions();
	})
	.get('/expansions/:id', async ({ params }) => {
		const parsed = paramsSchema.parse(params);
		const exp = await ExpansionsService.getExpansionById(parsed.id);
		return exp ?? { error: 'Not found' };
	});
