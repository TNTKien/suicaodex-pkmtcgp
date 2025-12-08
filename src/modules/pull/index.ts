import Elysia from 'elysia';

export const pull = new Elysia({
	prefix: '/v4',
})
	.get('/pull', () => 'Pull 1 pack')
