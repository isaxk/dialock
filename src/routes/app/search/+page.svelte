<script lang="ts">
	import HeaderContainer from '$lib/components/header/header-container.svelte';
	import FlexCenter from '$lib/components/stacks/flex-center.svelte';
	import FlexThin from '$lib/components/stacks/flex-thin.svelte';
	import FlexWide from '$lib/components/stacks/flex-wide.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { ArrowLeft, Search } from 'lucide-svelte';
	import Fuse from 'fuse.js';
	import format from 'format-fuse.js';
	import { decrypted, entries } from '$lib/pocketbase/index.svelte';
	import { browser } from '$app/environment';
	import Highlight from '$lib/components/ui/highlight.svelte';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import dayjs from 'dayjs';

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
						let count = 0;
						split.forEach((s, i) => {
							const actualText = d.text.slice(count, count + s.length);
							const actualQ = d.text.slice(count + s.length, count + s.length + q.length);
							format.push({ text: actualText.replaceAll('\n', '<br />'), mark: false });
							if (i !== split.length - 1) format.push({ text: actualQ, mark: true });
							count += s.length + q.length;
						});
						return {
							...d,
							format: format
						};
					})
			: []
	);

	$inspect(results);
</script>

<HeaderContainer>
	<div class="flex w-full items-center gap-3">
		<Button type="link" href="/app" icon={ArrowLeft} style="text" />
		<div class="w-full grow">
			<Input icon={Search} bind:value={q} placeholder="Search" fullWidth autofocus />
		</div>
	</div>
</HeaderContainer>

<ScreenContainer>
	<div class="pt-20">
		{#if results}
			{#each results as result, i (result.id)}
				<div class="pb-10">
					<div class="border-foreground/20 border-b pb-2 text-lg font-medium">
						{dayjs(result.entryDetails.created).format('MMM DD, YYYY')}
					</div>
					<div class="pt-2 font-serif text-base">
						{#each result.format as f, i (f.text + i)}
							{#if f.mark}
								<span class="bg-primary/10 font-medium">{f.text}</span>
							{:else}
								{@html f.text}
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</ScreenContainer>
