<script lang="ts">
	import dayjs from 'dayjs';
	import { areAdjacentDays, calculateStreak } from '$lib/utils';
	import { decrypted, entries, user } from '$lib/pocketbase/index.svelte';
	import EntryAccItem from './entry-acc-item.svelte';
	import EntryStreak from './entry-streak.svelte';
	import type { EntriesStoreItem } from '$lib/types/types';

	let { entry, stickyWithMonth = false }: { entry: EntriesStoreItem; stickyWithMonth?: boolean } =
		$props();

	const decryptedValue = $derived(decrypted.get(entry.id));

	const streak = $derived(calculateStreak(entry.id, entries.current ?? []));
</script>

<EntryAccItem {stickyWithMonth} id={entry.id} hideContent={entry.loading}>
	{#snippet header()}
		<div class="font-semibold">
			{dayjs(entry.created)
				.tz(user.current?.time_zone ?? dayjs.tz.guess() ?? 'Europe/London')
				.format('ddd DD')}
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
