import PocketBase from 'pocketbase';
import type { UsersRecord } from './types';
import { decryptDiary, deriveKey, encryptDiary } from '$lib/crypto';
import dayjs from 'dayjs';
import { SvelteMap } from 'svelte/reactivity';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { EntriesStoreItem } from '$lib/types';
import { value } from '$lib/state.svelte';

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const user: {
	current: UsersRecord | null;
	authLoaded: boolean;
} = $state({
	current: null,
	authLoaded: false
});

export const entries: {
	current: EntriesStoreItem[] | null;
} = $state({
	current: null
});

export const decrypted = new SvelteMap<string, () => Promise<string>>();
export const incorrectPassword = $state({ current: false });
export const diaryUnlocked = $state({ current: false });

export const password: {
	current: string | null;
} = $state({
	current: null
});

export const db = {
	authStore: async () => {
		const authStoreJSON = localStorage.getItem('pocketbase_auth');
		if (authStoreJSON) {
			const authStore = JSON.parse(authStoreJSON);
			pb.authStore.save(authStore.token, authStore.record);
		}
		if (pb.authStore.isValid && pb.authStore.record) {
			user.current = pb.authStore.record as unknown as UsersRecord;

			pb.collection('users')
				.getOne(pb.authStore.record.id)
				.then((d) => {
					console.log('d', d);
					if (d) {
						user.current = d as unknown as UsersRecord;
					} else {
						user.current = null;
					}
				})
				.catch(() => {
					user.current = null;
				});

			getEntries().then(() => {
				user.authLoaded = true;
			});
		}

		async function getEntries() {
			return pb
				.collection('entries')
				.getFullList(200, {
					sort: 'created'
				})
				.then((records) => {
					entries.current = records.map((r) => ({ ...r, loading: false }));
				});
		}

		pb.authStore.onChange((_, record) => {
			if (record) {
				user.current = record as unknown as UsersRecord;
				getEntries();
			} else {
				user.current = null;
			}
		});
	},
	loginWithPassword: async (username: string, password: string) => {
		const data = await pb.collection('users').authWithPassword(username, password);
		if (data && data.record) {
			user.current = data.record as unknown as UsersRecord;
		} else {
			user.current = null;
		}
	},
	loginInWithGoogle: async () => {
		const data = await pb.collection('users').authWithOAuth2({
			provider: 'google'
		});
		if (data && data.record) {
			user.current = data.record as unknown as UsersRecord;
		} else {
			user.current = null;
		}
		console.log(pb.authStore.token);
	},
	logOut: async () => {
		pb.authStore.clear();
		user.current = null;
	},
	createEntry: async (value: string) => {
		console.log(value);
		if (!user.current || !password.current) return;
		entries.current?.push({
			loading: true,
			id: 'today',
			cipher_text: undefined,
			iv: undefined,
			user: user.current.id,
			created: dayjs().toISOString(),
			updated: dayjs().toISOString()
		});

		const key = await deriveKey(password.current, user.current.salt);
		const { ivHex, ctHex } = await encryptDiary(key, value);
		const data = await pb.collection('entries').create({
			user: user.current.id,
			iv: ivHex,
			cipher_text: ctHex,
			created: dayjs().toISOString()
		});
		decrypted.set(data.id, async () => {
			return value;
		});
		entries.current = entries.current?.filter((element) => element.loading !== true) ?? [];
		entries.current.push({ ...data, loading: false } as EntriesStoreItem);
		return data;
	},
	unlockDiary: (pass: string) => {
		if (!user.current || !entries.current) return;
		incorrectPassword.current = false;
		entries.current.forEach((element) => {
			if (!user.current || !pass || !entries || !element.iv || !element.cipher_text) return;
			decrypted.set(
				element.id,
				() =>
					new Promise((resolve, reject) => {
						if (!user.current || !entries.current || !element.iv) {
							reject();
							return;
						}
						deriveKey(pass, user.current.salt).then(async (d) => {
							try {
								if (!element.iv || !element.cipher_text) throw new Error('Invalid data');
								const val = await decryptDiary(d, element.iv, element.cipher_text);
								resolve(val);
							} catch (e) {
								incorrectPassword.current = true;
								reject(e);
							}
						});
					})
			);
		});
		if (entries.current.length > 0) {
			const fn = decrypted.get(entries.current[0].id);
			if (fn) {
				fn().then(() => {
					if (incorrectPassword.current) return;
					diaryUnlocked.current = true;
					password.current = pass;
				});
			}
		} else {
			diaryUnlocked.current = true;
			password.current = pass;
		}
	},
	lockDiary: () => {
		diaryUnlocked.current = false;
		password.current = null;
		decrypted.clear();
	},
	deleteAccount: async () => {
		if (!user.current) return;
		await pb.collection('users').delete(user.current.id);
		entries.current = [];
		decrypted.clear();
		pb.authStore.clear();
	},
	updateEntryTemplate: async (v: string) => {
		if (!user.current) return;
		let noChanges = false;
		if (
			value.current?.replaceAll(' ', '') === user.current?.entry_template?.replaceAll(' ', '') ||
			value.current?.replaceAll(' ', '') === ''
		) {
			noChanges = true;
		}
		await pb.collection('users').update(user.current.id, {
			entry_template: v
		});
		if (noChanges) {
			value.current = v;
		}
		user.current.entry_template = v;
	}
};
