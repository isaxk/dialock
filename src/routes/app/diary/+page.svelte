<script lang="ts">
	import { goto } from '$app/navigation';

	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { Plane } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import DiaryEntry from '$lib/components/diary-view/diary-entry.svelte';
	import TodayEntry from '$lib/components/diary-view/today-entry.svelte';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import Avatar from '$lib/components/ui/avatar.svelte';
	import { diaryUnlocked, entries, user } from '$lib/pocketbase/index.svelte';
	import { groupByMonth } from '$lib/utils';
	import { MediaQuery } from 'svelte/reactivity';

	let accordionVal = $state('today');

	const sm = new MediaQuery('(min-width: 640px)');

	onMount(() => {
		if (!diaryUnlocked.current) {
			goto('/app');
		}
	});
</script>

<ScreenContainer>
	{#if entries.current}
		{#if !sm.current}
			<div class="flex items-center gap-3 p-3">
				{#if user.current?.avatar}
					<Avatar user={user.current.id} avatar={user.current.avatar} />
				{/if}
				<!-- {#if !showMainHeader} -->
				<div class="text-md">
					<span class="font-semibold">{user.current?.name}</span>'s diary
				</div>
				<!-- {/if} -->
			</div>
		{/if}

		{#if user.current?.time_zone && user.current?.time_zone !== dayjs.tz.guess()}
			<div class="p-2">
				<div class="border-border flex gap-2 rounded-xl border p-3">
					<div class="min-w-4 pt-0.5">
						<Plane size={16} />
					</div>
					<div class="grow">
						<div class="text-sm font-semibold">Travel mode enabled</div>

						<div class="flex items-center gap-2">
							<div class="text-foreground/80 grow text-xs">
								Your diary will continue to roll over at 00:00 {user.current?.time_zone} time ({dayjs
									.tz(undefined, user.current?.time_zone)
									.set('hour', 0)
									.set('minute', 0)
									.tz(undefined)
									.format('HH:mm')} local). If this is a long term change, you may want to update your
								account timezone.
							</div>
							<!-- <Button
								onclick={db.updateTimeZone}
								style="secondary"
								size="xs"
								label={`Update to ${dayjs.tz.guess()}`}
							/> -->
						</div>
					</div>
				</div>
			</div>
		{/if}
		<Accordion.Root bind:value={accordionVal} type="single" class="flex h-full flex-col">
			<TodayEntry />

			{#each groupByMonth(entries.current
					.filter((entry) => !entry.today)
					.toReversed()) as group (group.month)}
				<div>
					{#if dayjs().month() !== dayjs(group.entries[0].created).month()}
						<div class="pt-10"></div>
						<div
							class="bg-background top-safe-top pointer-events-none sticky z-10 sm:top-[calc(64px+env(safe-area-inset-top))] sm:pt-3"
						>
							<div class="shadow-background p-3 text-lg font-semibold shadow-md">
								{group.month}
							</div>
						</div>
					{/if}
					{#each group.entries as entry (entry.id)}
						<DiaryEntry
							stickyWithMonth={dayjs().month() !== dayjs(group.entries[0].created).month()}
							{entry}
						/>
					{/each}
				</div>
			{/each}
		</Accordion.Root>
	{/if}
</ScreenContainer>
