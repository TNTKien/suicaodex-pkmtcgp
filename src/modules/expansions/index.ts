import Elysia from 'elysia';
import { ExpansionsService } from './service';

export const expansions = new Elysia({
	prefix: '/v4',
})
	.get('/expansions', async () => {
		return ExpansionsService.getAllExpansions();
	})
	.get("/expansions/:id", async ({ params }) => {
    const exp = await ExpansionsService.getExpansionById(params.id);
    return exp ?? { error: "Not found" };
  });
