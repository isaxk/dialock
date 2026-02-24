<script lang="ts">
	import Input from '$lib/components/ui/input.svelte';
	import { Expand, Search } from 'lucide-svelte';

	import { decrypted, entries } from '$lib/pocketbase/index.svelte';

	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import dayjs from 'dayjs';
	import { Dialog } from 'bits-ui';
	import EntryDialog from '$lib/components/ui/entry-dialog.svelte';

	let q = $state('');

	const searchArray = $derived(
		Array.from(decrypted).map(([id, text]) => {
			const entryDetails = entries.current?.find((entry) => entry.id === id);
			return { id, text, entryDetails };
		})
	);

	const results = $derived(
		q.length > 1
			? searchArray
					.filter((result) => result.text.toLowerCase().includes(q.toLowerCase()))
					.toReversed()
					.map((d) => {
						const split = d.text.toLowerCase().split(q.toLowerCase());
						const format: {
							text: string;
							mark: boolean;
						}[] = [];

						const preview: {
							text: string;
							mark: boolean;
						}[] = [];
						let count = 0;
						split.forEach((s, i) => {
							const actualText = d.text.slice(count, count + s.length);
							const actualQ = d.text.slice(count + s.length, count + s.length + q.length);
							format.push({ text: actualText.replaceAll('\n', '<br />'), mark: false });
							if (i !== split.length - 1) format.push({ text: actualQ, mark: true });
							count += s.length + q.length;
						});

						if (split.length > 0) {
							const lastSpace = split[0].split('').findLastIndex((t, i) => {
								return i <= split[0].length - 50 && t === ' ';
							});
							if (split[0].length > 50) {
								preview.push({ text: '...', mark: false });
							}
							preview.push({ text: split[0].slice(lastSpace + 1), mark: false });
							preview.push({ text: q, mark: true });
						}

						if (split.length > 1) {
							const end = split.slice(1).join(q);

							const nextSpace = end.split('').findIndex((t, i) => {
								return i > 50 && t === ' ';
							});

							preview.push({ text: end.slice(0, nextSpace), mark: false });
							if (end.length > 50) {
								preview.push({ text: '...', mark: false });
							}
						}

						return {
							...d,
							format: format,
							preview: preview
						};
					})
			: []
	);
</script>

<div class="pt-safe-top fixed top-16 right-0 left-0 z-100 px-4">
	<div class="flex w-full items-center justify-center gap-3">
		<div class="w-full max-w-screen-sm grow sm:px-4">
			<Input icon={Search} bind:value={q} placeholder="Search" fullWidth autofocus />
		</div>
	</div>
</div>

<ScreenContainer>
	<div class="px-4 pt-36">
		{#if results}
			{#each results as result (result.id)}
				<Dialog.Root>
					<Dialog.Trigger class="flex w-full items-center gap-4 pb-10 text-left">
						<div class="min-w-0 grow">
							<div class="text-lg font-medium">
								{result.entryDetails?.created
									? dayjs(result.entryDetails?.created).format('MMM DD, YYYY')
									: null}
							</div>
							<div class="pt-2 font-serif text-sm">
								"{#each result.preview as f, i (f.text + i)}
									{#if f.mark}
										<span class="bg-primary/25 font-medium">{f.text}</span>
									{:else}
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html f.text}
									{/if}
								{/each}"
							</div>
						</div>
						<div class="w-5">
							<Expand size={18} />
						</div>
					</Dialog.Trigger>
					<EntryDialog
						title={result.entryDetails
							? dayjs(result.entryDetails.created).format('MMM DD, YYYY')
							: ''}
					>
						{#each result.format as f, i (f.text + i)}
							{#if f.mark}
								<span class="bg-primary/25 font-medium">{f.text}</span>
							{:else}
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html f.text}
							{/if}
						{/each}
					</EntryDialog>
				</Dialog.Root>
			{/each}
		{/if}
	</div>
</ScreenContainer>
