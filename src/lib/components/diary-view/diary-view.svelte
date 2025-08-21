<script lang="ts">
	import { db, entries, user } from '$lib/pocketbase/index.svelte';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import DiaryEntry from './diary-entry.svelte';
	import { ArrowUp, XIcon } from 'lucide-svelte';
	import { ignoreScroll, typing, value } from '$lib/state.svelte';
	import SmartTextarea from '../smart-textarea.svelte';
	import { onMount, untrack } from 'svelte';
	import DiaryViewContainer from './diary-view-container.svelte';
	import EntryAccItem from './entry-acc-item.svelte';
	import Button from '../ui/button.svelte';

	let now = $state(dayjs());
	let accordionVal = $state('today');

	onMount(() => {
		value.current = user.current?.entry_template ?? '';
		const interval = setInterval(() => {
			now = dayjs();
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<svelte:window
	onmousemove={() => {
		typing.current = false;
	}}
	onscroll={() => {
		if (!ignoreScroll.current) {
			typing.current = false;
		}
	}}
/>

<DiaryViewContainer>
	{#if entries.current}
		<Accordion.Root bind:value={accordionVal} type="single">
			{#each entries.current as entry (entry.id)}
				<DiaryEntry {entry} />
			{/each}
			{#if !entries.current.some((entry) => dayjs(entry.created).isSame(now, 'day'))}
				<EntryAccItem forceFullOpacity id="today">
					{#snippet header()}
						<div class={['w-full text-left transition-all']}>
							<div class="text-xl font-semibold">New entry</div>
							<div class="">
								{dayjs().format('MMM D, YYYY')}
							</div>
						</div>
						<div class="hidden gap-4 group-data-[state=open]:flex">
							{#if value.current?.replaceAll(' ', '') != user.current?.entry_template?.replaceAll(' ', '')}
								<Button
									hiddenLabel
									size="lg"
									shape="circle"
									style="text"
									onclick={(e) => {
										e.stopPropagation();
										value.current = user.current?.entry_template ?? '';
									}}
									icon={XIcon}
									label="Clear"
								/>
							{/if}
							<Button
								hiddenLabel
								size="lg"
								shape="circle"
								onclick={(e) => {
									if (!value.current) return;
									e.stopPropagation();
									db.createEntry(value.current);
								}}
								icon={ArrowUp}
								label="Submit"
							/>
						</div>
					{/snippet}
					{#snippet content()}
						{#if value.current !== null}
							<SmartTextarea bind:value={value.current}></SmartTextarea>
						{/if}
					{/snippet}
				</EntryAccItem>
			{:else}
				<div class="p-4" transition:slide={{ duration: 200 }}>You have already written today</div>
			{/if}
		</Accordion.Root>
	{/if}
</DiaryViewContainer>
