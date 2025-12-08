import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { expansions } from './modules/expansions';
import { cards } from './modules/cards';
import { pull } from './modules/pull';

export default new Elysia({
	adapter: CloudflareAdapter,
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
