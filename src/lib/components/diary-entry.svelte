<script lang="ts">
	import { decrypted, entries } from '$lib/pocketbase/index.svelte';
	import type { EntriesRecord } from '$lib/pocketbase/types';
	import { typing } from '$lib/state.svelte';
	import { receive, send } from '$lib/transition';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { ChevronDown, Flame } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let { entry }: { entry: EntriesRecord } = $props();

	let clientHeight = $state();

	let text = $state('');

	function areAdjacentDays(dateA: string, dateB: string) {
		const d1 = dayjs(dateA).startOf('day');
		const d2 = dayjs(dateB).startOf('day');
		// diff returns in the unit you ask for (here, 'day')
		return Math.abs(d1.diff(d2, 'day')) === 1;
	}

	const streak = $derived.by(() => {
		const current = entries.current?.findIndex((e) => e.id === entry.id);
		console.log(current);
		if (!current) return 0;
		const previous = entries.current?.filter((_, i) => i <= current).toReversed();
		console.log(previous?.map((entry) => dayjs(entry.created).format('YYYY-MM-DD')));

		let streakOver = false;
		let streak = 0;

		previous?.forEach((e, i) => {
			const a = e?.created;
			const b = previous[i + 1]?.created;
			if (!streakOver && a && b) {
				console.log(
					dayjs(e.created).format('YYYY-MM-DD'),
					dayjs(a).format('YYYY-MM-DD'),
					dayjs(b).format('YYYY-MM-DD')
				);
				if (areAdjacentDays(a, b)) {
					streak = streak + 1;
				} else {
					streakOver = true;
				}
				console.log(streak);
			}
		});

		return streak;
	});

	const getDecrypt = $derived.by(() => {
		return {
			c: decrypted.get(entry.id)
		};
	});
</script>

<div in:receive={{ key: entry.id }} out:send={{ key: entry.id }}>
	<Accordion.Item value={entry.id} class={['border-foreground/20 group border-b']}>
		<Accordion.Header class="bg-background sticky top-16 w-full">
			<Accordion.Trigger
				class="text-foreground/60 group-data-[state=open]:text-foreground flex w-full p-5 transition-all"
			>
				<div class="font-semibold">
					{dayjs(entry.created).format('MMM D, YYYY')}
				</div>
				<div>
					{#if entry.loading}Uploading...{/if}
				</div>
				<div class="flex-grow"></div>
				{#if streak > 1}
					<div class="flex items-center pr-2">
						<Flame size={24} />
						<div class="text-sm font-medium">
							{streak}
						</div>
					</div>
				{/if}
				<div class="transition-all group-data-[state=open]:rotate-180"><ChevronDown /></div>
			</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content forceMount={true}>
			{#snippet child({ props, open })}
				{#if !entry.loading && open && getDecrypt.c}
					<div {...props} class="min-h-40 overflow-hidden">
						<div bind:clientHeight class="p-5 pb-10 font-serif whitespace-break-spaces">
							{#await getDecrypt.c() then text}
								{text}
							{/await}
						</div>
					</div>
				{/if}
			{/snippet}
		</Accordion.Content>
	</Accordion.Item>
</div>
