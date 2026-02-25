<script lang="ts">
	import { decrypted, entries } from '$lib/pocketbase/index.svelte';
	import { calculateStreak } from '$lib/utils';
	import { Dialog } from 'bits-ui';
	import dayjs from 'dayjs';

	import EntryStreak from '../diary-view/entry-streak.svelte';
	import EntryDialog from '../ui/entry-dialog.svelte';

	let { day }: { day: dayjs.Dayjs } = $props();

	const entry = $derived(entries.current?.find((entry) => dayjs(entry.created).isSame(day, 'day')));

	const streak = $derived(entry ? calculateStreak(entry.id, entries.current ?? []) : 0);
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={[
			'hover:bg-primary hover:text-background flex h-18 w-full flex-col p-3 py-1  text-left text-lg font-medium transition-all'
		]}
	>
		<div class="">
			{day?.date()}
		</div>
		<div class="grow"></div>
		<div
			class="text-border flex w-full origin-bottom-right translate-x-2 scale-80 justify-end pb-0.5"
		>
			<EntryStreak {streak} />
		</div>
	</Dialog.Trigger>
	<!-- <Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 border-border fixed top-[50%] left-[50%] z-50 flex h-max max-h-[90vh] w-full max-w-xl translate-x-[-50%] translate-y-[-50%]  flex-col gap-4 overflow-hidden rounded-lg border px-7 py-5 pb-8 shadow-xs outline-hidden"
		>
			<div class="flex items-center">
				<Dialog.Title class="grow text-lg font-medium">{day?.format('MMM DD, YYYY')}</Dialog.Title>
				<Dialog.Close class="p-3 pr-0"><X size={20} /></Dialog.Close>
			</div>
		</Dialog.Content>
	</Dialog.Portal> -->
	<EntryDialog title={day?.format('MMM DD, YYYY')} {streak}>
		{#if entry}
			{@const text = decrypted.get(entry.id)}

			{@html text?.replaceAll('\n', '<br />')}
		{/if}
	</EntryDialog>
</Dialog.Root>
