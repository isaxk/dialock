<script lang="ts">
	import HeaderContainer from '$lib/components/header/header-container.svelte';
	import FlexCenter from '$lib/components/stacks/flex-center.svelte';
	import FlexThin from '$lib/components/stacks/flex-thin.svelte';
	import FlexWide from '$lib/components/stacks/flex-wide.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import {
		ArrowLeft,
		ArrowUpRight,
		ArrowUpRightFromSquare,
		Expand,
		Eye,
		Fullscreen,
		Search
	} from 'lucide-svelte';
	import Fuse from 'fuse.js';
	import format from 'format-fuse.js';
	import { decrypted, entries } from '$lib/pocketbase/index.svelte';
	import { browser } from '$app/environment';
	import Highlight from '$lib/components/ui/highlight.svelte';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import dayjs from 'dayjs';
	import { AlertDialog, Dialog } from 'bits-ui';
	import EntryDialog from '$lib/components/ui/entry-dialog.svelte';

	let q = $state('');

	const searchArray = $derived(
		Array.from(decrypted).map(([id, text]) => {
			const entryDetails = entries.current?.find((entry) => entry.id === id);
			return { id, text, entryDetails };
		})
	);

	const fuse = $derived(
		new Fuse(searchArray, {
			keys: ['text'],
			includeMatches: true
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

	$inspect(results);
</script>

<HeaderContainer top="60px">
	<div class="flex w-full items-center gap-3">
		<div class="w-full grow">
			<Input icon={Search} bind:value={q} placeholder="Search" fullWidth autofocus />
		</div>
	</div>
</HeaderContainer>

<ScreenContainer>
	<div class="px-4 pt-36">
		{#if results}
			{#each results as result, i (result.id)}
				<Dialog.Root>
					<Dialog.Trigger class="flex w-full items-center gap-4 pb-10 text-left">
						<div class="min-w-0 grow">
							<div class="text-lg font-medium">
								{dayjs(result.entryDetails.created).format('MMM DD, YYYY')}
							</div>
							<div class="pt-2 font-serif text-sm">
								"{#each result.preview as f, i (f.text + i)}
									{#if f.mark}
										<span class="bg-primary/25 font-medium">{f.text}</span>
									{:else}
										{@html f.text}
									{/if}
								{/each}"
							</div>
						</div>
						<div class="w-5">
							<Expand size={18} />
						</div>
					</Dialog.Trigger>
					<EntryDialog title={dayjs(result.entryDetails.created).format('MMM DD, YYYY')}>
						{#each result.format as f, i (f.text + i)}
							{#if f.mark}
								<span class="bg-primary/25 font-medium">{f.text}</span>
							{:else}
								{@html f.text}
							{/if}
						{/each}
					</EntryDialog>
				</Dialog.Root>
			{/each}
		{/if}
	</div>
</ScreenContainer>
