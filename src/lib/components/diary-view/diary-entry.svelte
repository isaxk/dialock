<script lang="ts">
	import dayjs from 'dayjs';
	import { areAdjacentDays } from '$lib/utils';
	import { decrypted, entries, user } from '$lib/pocketbase/index.svelte';
	import EntryAccItem from './entry-acc-item.svelte';
	import EntryStreak from './entry-streak.svelte';
	import type { EntriesStoreItem } from '$lib/types';

	let { entry }: { entry: EntriesStoreItem } = $props();

	const decryptedValue = $derived(decrypted.get(entry.id));

	const streak = $derived.by(() => {
		const current = entries.current?.findIndex((e) => e.id === entry.id);
		if (!current) return 0;
		const previous = entries.current?.filter((_, i) => i <= current).toReversed();

		let streak = 1;

		if (previous) {
			for (let i = 0; i < previous.length; i++) {
				const a = previous[i]?.created;
				const b = previous[i + 1]?.created;
				if (a && b) {
					if (areAdjacentDays(a, b)) {
						streak = streak + 1;
					} else {
						break;
					}
				}
			}
		}

		return streak;
	});
</script>

<EntryAccItem id={entry.id} hideContent={entry.loading}>
	{#snippet header()}
		<div class="font-semibold">
			{dayjs(entry.created)
				.tz(user.current?.time_zone ?? dayjs.tz.guess() ?? 'Europe/London')
				.format('MMM D, YYYY')}
		</div>
		<div>
			{#if entry.loading}Uploading...{/if}
		</div>
		<div class="flex-grow"></div>
		<EntryStreak {streak} />
	{/snippet}
	{#snippet content()}
		<div class="p-5 px-3">
			{decryptedValue}
		</div>
	{/snippet}
</EntryAccItem>
