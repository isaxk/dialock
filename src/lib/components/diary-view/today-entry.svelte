<script lang="ts">
	import dayjs from 'dayjs';
	import EntryAccItem from './entry-acc-item.svelte';
	import { db, entries, user } from '$lib/pocketbase/index.svelte';
	import { todayLoading, value } from '$lib/state.svelte';
	import { AlertCircle, Check, Circle, Save } from 'lucide-svelte';
	import Button from '../ui/button.svelte';
	import { text_area_resize } from '$lib/utils/autoresize-textarea';
	import { beforeNavigate } from '$app/navigation';
	import { debounce } from '$lib/utils';
	import autosizeAction from 'svelte-autosize';
	import { onMount, tick } from 'svelte';
	import { text } from '@sveltejs/kit';
	import Textarea from '../ui/textarea.svelte';

	let unsavedChanges = $state(false);
	let textarea: HTMLTextAreaElement = $state();

	const debouncedUpdate = debounce(async () => {
		await db.createOrUpdateEntry(value.current ?? '');
		unsavedChanges = false;
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

	$effect(() => {
		if (textarea && value.current) {
			autosizeAction.update(textarea);
		}

		// const intervalId = setInterval(() => {
		// 	autosizeAction.update(textarea);
		// }, 1000);
		// return () => clearInterval(intervalId);
	});
</script>

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
						Saved changes.
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
			<textarea
				bind:this={textarea}
				class="min-h-20 w-full resize-none px-5 py-2 outline-none"
				use:autosizeAction
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
