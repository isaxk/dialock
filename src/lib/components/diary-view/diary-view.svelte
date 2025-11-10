<script lang="ts">
	import { Accordion } from 'bits-ui';
	import DiaryEntry from './diary-entry.svelte';
	import DiaryViewContainer from './diary-view-container.svelte';
	import TodayEntry from './today-entry.svelte';
	import { entries } from '$lib/pocketbase/index.svelte';

	let accordionVal = $state('today');
</script>

<DiaryViewContainer>
	{#if entries.current}
		<Accordion.Root bind:value={accordionVal} type="single" class="flex h-full flex-col">
			<TodayEntry />
			{#each entries.current.filter((entry) => !entry.today).toReversed() as entry (entry.id)}
				<DiaryEntry {entry} />
			{/each}
		</Accordion.Root>
	{/if}
</DiaryViewContainer>
