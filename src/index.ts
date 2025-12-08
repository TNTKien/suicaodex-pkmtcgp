import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
// import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { expansions } from './modules/expansions';
import { cards } from './modules/cards';
import { pull } from './modules/pull';

export default new Elysia({
	// adapter: CloudflareAdapter,
	aot: false,
})
	.use(
		cors({
			origin: /.*\.suicaodex\.com$/,
		})
	)
	.onError(({ error, code, set, status }) => {
		// customize response based on error code
		if (code === 'NOT_FOUND') return status(404, 'NOT FOUND');
		if (code === 'VALIDATION') return new Response(error.message, { status: 400 });

		// fallback
		console.error(error);
		return status(500, 'Internal Server Error');
	})
	.get('/', () => 'Hiii~~! Kibun wa dou?')
	.get('/philia093', () => 'See you *tomorrow*.')

	//get expansions list
	.use(expansions)

	//get cards list
	.use(cards)

	//pull packs
	.use(pull)

	// This is required to make Elysia work on Cloudflare Worker
	.compile();
