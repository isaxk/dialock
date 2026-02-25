<script lang="ts">
	import { Accordion } from 'bits-ui';
	import DiaryEntry from '$lib/components/diary-view/diary-entry.svelte';

	import TodayEntry from '$lib/components/diary-view/today-entry.svelte';
	import { diaryUnlocked, entries } from '$lib/pocketbase/index.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import { groupByMonth } from '$lib/utils';

	let accordionVal = $state('today');

	onMount(() => {
		if (!diaryUnlocked.current) {
			goto('/app');
		}
	});
</script>

<ScreenContainer>
	{#if entries.current}
		<Accordion.Root bind:value={accordionVal} type="single" class="flex h-full flex-col">
			<TodayEntry />
			{#each groupByMonth(entries.current
					.filter((entry) => !entry.today)
					.toReversed()) as group, i (group.month)}
				{#if i !== 0}
					<div class="pt-10"></div>
					<div
						class="bg-background sticky top-[calc(64px+env(safe-area-inset-top))] z-20 p-3 text-lg font-semibold"
					>
						{group.month}
					</div>
				{/if}
				{#each group.entries as entry (entry.id)}
					<DiaryEntry stickyWithMonth={i !== 0} {entry} />
				{/each}
			{/each}
		</Accordion.Root>
	{/if}
</ScreenContainer>
