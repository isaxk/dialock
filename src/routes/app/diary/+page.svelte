<script lang="ts">
	import { Accordion } from 'bits-ui';
	import DiaryEntry from '$lib/components/diary-view/diary-entry.svelte';

	import TodayEntry from '$lib/components/diary-view/today-entry.svelte';
	import { diaryUnlocked, entries } from '$lib/pocketbase/index.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';

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
			{#each entries.current.filter((entry) => !entry.today).toReversed() as entry (entry.id)}
				<DiaryEntry {entry} />
			{/each}
		</Accordion.Root>
	{/if}
</ScreenContainer>
