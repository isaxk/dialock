import type EntryAccItem from '$lib/components/diary-view/entry-acc-item.svelte';
import dayjs from 'dayjs';
import type { EntriesRecord } from './types';

const KEY = 'autosave-backups-v1';

export type BackUp = {
	date: string;
	content: string;
	updated: string;
};

export type BackUpResult = {
	doc_id: string | null;
	date: string;
	content: string;
};

export function checkForBackUps(entries: EntriesRecord[]) {
	const requiredUpdates: BackUpResult[] = [];
	const result = localStorage.getItem(KEY);

	if (result) {
		const parsed: BackUp[] = JSON.parse(result);
		if (!Array.isArray(parsed)) return [];
		parsed.forEach((backup: BackUp) => {
			const existingEntry = entries.find((e) => dayjs(e.created).isSame(backup.date, 'day'));
			if (!existingEntry) {
				requiredUpdates.push({ doc_id: null, content: backup.content, date: backup.date });
			} else {
				let isFresh = dayjs(existingEntry.updated).isBefore(backup.updated);

				if (!isFresh) {
					isFresh = confirm(
						`We found a backup for ${dayjs(backup.date).format('YYYY-MM-DD')} from ${dayjs(backup.updated).format('HH:mm:ss')} on this device that failed to save.\nBut a more recent version was found from ${dayjs(backup.updated).format('HH:mm:ss')} on the server, would you like to overwrite the new version?`
					);
				}
				if (isFresh) {
					requiredUpdates.push({
						doc_id: existingEntry.id,
						content: backup.content,
						date: backup.date
					});
				}
			}
		});
	}

	return requiredUpdates;
}

export function saveBackUp(date: string, content: string) {
	const existing = localStorage.getItem(KEY);
	const parsed = existing ? JSON.parse(existing) : [];

	console.log(parsed);
	const map = new Map(Array.isArray(parsed) ? parsed.map((p) => [p.date, p]) : []);
	const updated = dayjs().toISOString();
	const backup: BackUp = { date, content, updated };
	map.set(date, backup);
	console.log(Array.from(map.values()));
	localStorage.setItem(KEY, JSON.stringify(Array.from(map.values())));
}

export function clearBackups() {
	localStorage.setItem(KEY, JSON.stringify([]));
}
