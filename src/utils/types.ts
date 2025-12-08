import { type Rarity } from './rarity';

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
