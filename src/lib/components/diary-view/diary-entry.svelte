<script lang="ts">
	import dayjs from 'dayjs';

	import { decrypted, entries, user } from '$lib/pocketbase/index.svelte';
	import type { EntriesStoreItem } from '$lib/types/types';
	import { calculateStreak } from '$lib/utils';

	import ScrollIntoView from '../ui/scroll-into-view.svelte';

	import EntryAccItem from './entry-acc-item.svelte';
	import EntryStreak from './entry-streak.svelte';

	let { entry, stickyWithMonth = false }: { entry: EntriesStoreItem; stickyWithMonth?: boolean } =
		$props();

	const decryptedValue = $derived(decrypted.get(entry.id));

	const streak = $derived(calculateStreak(entry.id, entries.current ?? []));
</script>

<EntryAccItem {stickyWithMonth} id={entry.id} hideContent={entry.loading}>
	{#snippet header(isSticky)}
		<div class={['font-semibold transition-all']}>
			{dayjs(entry.created)
				.tz(user.current?.time_zone ?? dayjs.tz.guess() ?? 'Europe/London')
				.format(isSticky ? 'ddd DD MMMM YYYY' : 'ddd DD')}
		</div>
		<div>
			{#if entry.loading}Uploading...{/if}
		</div>
		<div class="flex-grow"></div>
		<EntryStreak {streak} />
	{/snippet}
	{#snippet content()}
		<ScrollIntoView />
		<div class="p-5 px-3 pt-2 font-serif whitespace-break-spaces">
			{decryptedValue}
		</div>
	{/snippet}
</EntryAccItem>
