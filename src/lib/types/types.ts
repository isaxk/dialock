import type { EntriesRecord } from '../pocketbase/types';

export type EntriesStoreItem = EntriesRecord & {
	loading: boolean;
	today: boolean;
};
