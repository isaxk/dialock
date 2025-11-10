<script lang="ts">
	import { db, entries, user } from '$lib/pocketbase/index.svelte';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import DiaryEntry from './diary-entry.svelte';
	import { AlertCircle, ArrowUp, Check, Save, XIcon } from 'lucide-svelte';
	import { ignoreScroll, todayLoading, typing, value } from '$lib/state.svelte';

	import { onMount } from 'svelte';
	import DiaryViewContainer from './diary-view-container.svelte';
	import EntryAccItem from './entry-acc-item.svelte';
	import Button from '../ui/button.svelte';
	import { debounce } from '$lib/utils';
	import { Circle } from 'svelte-loading-spinners';
	import Alert from '../ui/alert.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { text_area_resize } from '$lib/utils/autoresize-textarea';

	let now = $state(dayjs());
	let accordionVal = $state('today');
	let unsavedChanges = $state(false);

	const debouncedUpdate = debounce(() => {
		db.createOrUpdateEntry(value.current ?? '').then(() => {
			unsavedChanges = false;
		});
	}, 2500);

	beforeNavigate(({ cancel, type }) => {
		if (unsavedChanges && type === 'leave') {
			cancel();
		} else if (unsavedChanges) {
			if (user.current?.manual_save) {
				cancel();
				alert('You have unsaved changes');
			} else {
				db.createOrUpdateEntry(value.current ?? '').then(() => {
					unsavedChanges = false;
				});
			}
		}
	});

	onMount(() => {
		// value.current = user.current?.entry_template ?? '';
		//
		//

		// window.addEventListener('beforeunload', (event) => {
		// 	if (unsavedChanges || todayLoading.current) {
		// 		event.preventDefault();
		// 	}
		// });

		const interval = setInterval(() => {
			now = dayjs();
		}, 1000);
		return () => {
			clearInterval(interval);
			// window.removeEventListener('beforeunload', (event) => {
			// 	if (unsavedChanges || todayLoading.current) {
			// 		event.preventDefault();
			// 	}
			// });
		};
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
			<!-- {#if !entries.current.some((entry) => dayjs(entry.created).isSame(now, 'day'))} -->
			<EntryAccItem forceFullOpacity id="today">
				{#snippet header()}
					<div class={['w-full text-left transition-all']}>
						<div class="text-xl font-semibold">Today</div>
						<div class="flex items-center gap-2">
							<div class="">
								{dayjs(entries.current?.find((entry) => entry.today)?.created ?? undefined)
									.tz(user.current?.time_zone ?? dayjs.tz.guess() ?? 'Europe/London')
									.format('MMM D, YYYY')}
							</div>
							<div class="text-border flex items-center gap-1 text-sm">
								{#if todayLoading.current}
									<div class="flex w-5 justify-center">
										<Circle size={16} color="currentColor" />
									</div>
									Saving...
								{:else if unsavedChanges}
									{#if user.current?.manual_save}
										<div class="flex w-5 justify-center">
											<AlertCircle size={16} color="currentColor" />
										</div>
										Unsaved changes
									{/if}
								{:else if entries.current?.find((e) => e.today)}
									<div class="flex w-5 justify-center">
										<Check size={20} />
									</div>
									Saved. You can edit for the rest of the day.
								{/if}
							</div>
						</div>
					</div>
					<div class="gap-4 group-data-[state=open]:flex">
						{#if user.current?.manual_save && unsavedChanges && !todayLoading.current}
							<Button
								hiddenLabel
								size="lg"
								shape="circle"
								onclick={(e) => {
									e.stopPropagation();
									if (!value.current) return;

									db.createOrUpdateEntry(value.current).then(() => {
										unsavedChanges = false;
									});
								}}
								icon={Save}
								label="Submit"
							/>
						{/if}
					</div>
				{/snippet}
				{#snippet content()}
					{#if value.current !== null}
						<!-- <SmartTextarea

							bind:value={value.current}
						></SmartTextarea> -->
						<textarea
							class="min-h-20 w-full resize-none px-5 py-2 outline-none"
							use:text_area_resize
							bind:value={value.current}
							onkeyup={() => {
								unsavedChanges = true;
								if (!user.current?.manual_save) {
									debouncedUpdate();
								}
							}}
						></textarea>
					{/if}
				{/snippet}
			</EntryAccItem>
			{#each entries.current.filter((entry) => !entry.today).toReversed() as entry (entry.id)}
				<DiaryEntry {entry} />
			{/each}
			<!-- {:else}
				<div class="p-4" transition:slide={{ duration: 200 }}>You have already written today</div>
			{/if} -->
		</Accordion.Root>
	{/if}
</DiaryViewContainer>
