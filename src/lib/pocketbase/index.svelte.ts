import PocketBase from 'pocketbase';
import type { UsersRecord } from './types';
import { decryptDiary, deriveKey, encryptDiary } from '$lib/crypto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SvelteMap } from 'svelte/reactivity';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { EntriesStoreItem } from '$lib/types';
import { todayLoading, value } from '$lib/state.svelte';

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

dayjs.extend(utc);
dayjs.extend(timezone);

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
	updateTimeZone: async () => {
		if (!user.current) return;
		const tz = dayjs.tz.guess() ?? 'Europe/London';
		user.current.time_zone = tz;
		await pb.collection('users').update(user.current.id, {
			time_zone: tz
		});
	},
	authStore: async () => {
		if (pb.authStore.isValid && pb.authStore.record) {
			user.current = pb.authStore.record as unknown as UsersRecord;

			pb.collection('users')
				.getOne(pb.authStore.record.id)
				.then((data) => {
					const d = data as unknown as UsersRecord;
					if (d) {
						user.current = d as unknown as UsersRecord;
						if (!d.time_zone) {
							db.updateTimeZone();
						}
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
			if (!user.current?.time_zone) {
				await db.updateTimeZone();
			}
			const timezone = user.current?.time_zone ?? dayjs.tz.guess() ?? 'Europe/London';
			return pb
				.collection('entries')
				.getFullList(200, {
					sort: 'created'
				})
				.then(async (records) => {
					entries.current = records.map((r) => {
						return {
							...r,
							loading: false,
							today: dayjs(r.created)
								.tz(user.current?.time_zone ?? timezone)
								.isSame(dayjs().tz(user.current?.time_zone ?? timezone), 'day')
						};
					});
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
	},
	logOut: async () => {
		pb.authStore.clear();
		user.current = null;
	},
	createOrUpdateEntry: async (value: string) => {
		if (!user.current || !password.current) return;

		todayLoading.current = true;
		// entries.current?.push({
		// 	loading: true,
		// 	id: 'today',
		// 	cipher_text: undefined,
		// 	iv: undefined,
		// 	user: user.current.id,
		// 	created: dayjs().toISOString(),
		// 	updated: dayjs().toISOString()
		// });

		const key = await deriveKey(password.current, user.current.salt);
		const { ivHex, ctHex } = await encryptDiary(key, value);
		if (entries.current?.find((entry) => entry.today)) {
			const today = entries.current.find((entry) => entry.today)!;
			await pb.collection('entries').update(today.id, {
				iv: ivHex,
				cipher_text: ctHex,
				updated: dayjs().toISOString()
			});
			todayLoading.current = false;
			decrypted.set(today.id, async () => {
				return value;
			});
		} else {
			const data = await pb.collection('entries').create({
				user: user.current.id,
				iv: ivHex,
				cipher_text: ctHex,
				created: dayjs().toISOString()
			});

			entries.current = [
				...(entries.current ?? []),
				{
					...data,
					today: true,
					loading: false
				}
			];
			todayLoading.current = false;

			decrypted.set(data.id, async () => {
				return value;
			});
			// entries.current = entries.current?.filter((element) => element.loading !== true) ?? [];
			// entries.current.push({ ...data, loading: false } as EntriesStoreItem);
			return data;
		}
	},
	unlockDiary: async (pass: string) => {
		if (!user.current) return;
		if (!entries.current || !pass) {
			value.current = user.current?.entry_template ?? '';

			return;
		}
		if (!user.current?.time_zone) {
			await db.updateTimeZone();
		}
		incorrectPassword.current = false;
		const key = await deriveKey(pass, user.current.salt);
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

						try {
							if (!element.iv || !element.cipher_text) throw new Error('Invalid data');
							decryptDiary(key, element.iv, element.cipher_text).then((v) => {
								if (element.today) {
									value.current = v;
								}
								resolve(v);
							});
						} catch (e) {
							incorrectPassword.current = true;
							reject(e);
						}
					})
			);
		});
		value.current = user.current?.entry_template ?? '';
		if (entries.current && entries.current?.find((entry) => entry.today)?.id) {
			decrypted
				.get(entries.current.find((entry) => entry.today)!.id)?.()
				.then((d) => {
					value.current = d;
				});
		}
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
