import PocketBase, { type RecordModel } from 'pocketbase';
import type { EntriesRecord, UsersRecord } from './types';
import { decryptDiary, deriveKey, encryptDiary } from '$lib/crypto';
import dayjs from 'dayjs';
import { SvelteMap } from 'svelte/reactivity';

const pb = new PocketBase('https://dialock.pockethost.io/');

export const user: {
	current: UsersRecord | null;
} = $state({
	current: null
});

export const entries: {
	current: EntriesRecord[] | null;
} = $state({
	current: null
});

export const decrypted = new SvelteMap<string, () => Promise<string>>();
export const incorrectPassword = $state({ current: false });
export const diaryUnlocked = $state({ current: false });

export function getDecrypted(entries: EntriesRecord[] | null) {
	// if (!user.current || !password.current || !entries) return null;
	// incorrectPassword.current = false;
	// const array = entries.map((element) => {
	// 	const decrypter = new Promise(async (resolve, reject) => {
	// 		if (!user.current || !password.current || !entries || !element.iv || !element.cipher_text)
	// 			return;
	// 		const key = await deriveKey(password.current, user.current.salt);
	// 		try {
	// 			const val = await decryptDiary(key, element.iv, element.cipher_text);
	// 			console.log(val);
	// 			resolve(val);
	// 		} catch (e) {
	// 			incorrectPassword.current = true;
	// 			reject(e);
	// 		}
	// 	});
	// 	return [element.id, decrypter] as [string, Promise<string>];
	// });
	// console.log(array);
	// const list = new Map<string, Promise<string>>(array);
	// return list;
}

export const password: {
	current: string | null;
} = $state({
	current: null
});

export const db = {
	authStore: () => {
		pb.collection('users').authRefresh();
		pb.authStore.onChange((_, record) => {
			if (record) {
				user.current = record as unknown as UsersRecord;
				pb.collection('entries')
					.getFullList(200, {
						sort: 'created'
					})

					.then((records) => {
						console.log(records);
						entries.current = records as unknown as EntriesRecord[];
					});
				// pb.collection('entries').subscribe('*', (e) => {
				//     if (e.action === 'create') {
				//         entries.current = entries.current?.filter((element) => element.loading !== true) ?? [];
				//         entries.current?.push(e.record as unknown as EntriesRecord);
				//     }

				// }).then((d) => {
				//     console.log(d)
				// })
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
			cipher_text: null,
			iv: null,
			user: user.current.id,
			created: dayjs().toISOString(),
			updated: dayjs().toISOString()
		});

		const key = await deriveKey(password.current, user.current.salt);
		const { ivHex, ctHex } = await encryptDiary(key, value);
		console.log(ivHex, ctHex);
		const data = await pb.collection('entries').create({
			user: user.current.id,
			iv: ivHex,
			cipher_text: ctHex
		});
		decrypted.set(data.id, async () => {
			return value;
		});
		entries.current = entries.current?.filter((element) => element.loading !== true) ?? [];
		entries.current.push(data as unknown as EntriesRecord);
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
								const val = await decryptDiary(d, element.iv, element.cipher_text);
								console.log(val);
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
	}
};
