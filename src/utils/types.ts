import { type Rarity } from './rarity';
import { HttpStatusEnum } from 'elysia-http-status-code/status';

export type Pack = {
	id: string;
	name: string;
	image: string;
};

export type Expansion = {
	id: string;
	name: string;
	packs: Pack[];
};

export type Card = {
	id: string;
	name: string;
	rarity: Rarity;
	pack: string;
	health: string;
	image: string;
	fullArt: 'Yes' | 'No';
	ex: 'Yes' | 'No';
	artist: string;
	type: string;
};

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data: T | null;
	error: {
		code: string;
		details?: Array<{ field?: string; message: string }>;
	} | null;
}

export class RateLimitError extends Error {
  constructor(
    public message: string = 'rate-limited',
    public detail: string = '',
    public status: number = HttpStatusEnum.HTTP_429_TOO_MANY_REQUESTS // or just 429
  ) {
    super(message)
  }
}