import Elysia from 'elysia';

export const pull = new Elysia({
	prefix: '/v4',
})
	.get('/pull/1-pack', () => 'Pull 1 pack')
	.get('/pull/10-pack', () => 'Pull 10 packs');
