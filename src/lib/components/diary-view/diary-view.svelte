<script lang="ts">
	import { db, entries, user } from '$lib/pocketbase/index.svelte';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import DiaryEntry from './diary-entry.svelte';
	import { ArrowUp, Check, XIcon } from 'lucide-svelte';
	import { ignoreScroll, todayLoading, typing, value } from '$lib/state.svelte';
	import SmartTextarea from '$lib/components/ui/smart-textarea.svelte';
	import { onMount } from 'svelte';
	import DiaryViewContainer from './diary-view-container.svelte';
	import EntryAccItem from './entry-acc-item.svelte';
	import Button from '../ui/button.svelte';
	import { debounce } from '$lib/utils';
	import { Circle } from 'svelte-loading-spinners';

	let now = $state(dayjs());
	let accordionVal = $state('today');

	const debouncedUpdate = debounce(() => db.createOrUpdateEntry(value.current ?? ''), 1000);

	onMount(() => {
		// value.current = user.current?.entry_template ?? '';
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
		<Accordion.Root bind:value={accordionVal} type="single" class="flex h-full flex-col">
			{#each entries.current.filter((entry) => !entry.today) as entry (entry.id)}
				<DiaryEntry {entry} />
			{/each}
			<!-- {#if !entries.current.some((entry) => dayjs(entry.created).isSame(now, 'day'))} -->
			<EntryAccItem forceFullOpacity id="today">
				{#snippet header()}
					<div class={['w-full text-left transition-all']}>
						<div class="text-xl font-semibold">Today</div>
						<div class="flex items-center gap-2">
							<div class="">
								{dayjs(entries.current?.find((entry) => entry.today)?.created ?? undefined)
									.tz(user.current?.time_zone ?? 'Europe/London')
									.format('MMM D, YYYY')}
							</div>
							<div class="flex items-center gap-1 text-sm">
								{#if todayLoading.current}
									<div class="flex w-5 justify-center">
										<Circle size={16} color="currentColor" />
									</div>
									Saving...
								{:else if entries.current?.find((e) => e.today)}
									<div class="flex w-5 justify-center">
										<Check size={20} />
									</div>
									Saved. You can edit for the rest of the day.
								{/if}
							</div>
						</div>
					</div>
					<div class="hidden gap-4 group-data-[state=open]:flex">
						<!-- {#if value.current?.replaceAll(' ', '') != user.current?.entry_template?.replaceAll(' ', '')}
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
								db.createOrUpdateEntry(value.current);
							}}
							icon={ArrowUp}
							label="Submit"
						/> -->
					</div>
				{/snippet}
				{#snippet content()}
					{#if value.current !== null}
						<SmartTextarea
							onkeyup={() => {
								debouncedUpdate();
							}}
							bind:value={value.current}
						></SmartTextarea>
					{/if}
				{/snippet}
			</EntryAccItem>
			<!-- {:else}
				<div class="p-4" transition:slide={{ duration: 200 }}>You have already written today</div>
			{/if} -->
		</Accordion.Root>
	{/if}
</DiaryViewContainer>
