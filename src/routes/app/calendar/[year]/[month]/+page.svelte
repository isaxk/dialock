<script lang="ts">
	import CalendarEntry from '$lib/components/calendar/calendar-entry.svelte';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { decrypted, entries } from '$lib/pocketbase/index.svelte.js';
	import { Dialog } from 'bits-ui';
	import dayjs, { Dayjs } from 'dayjs';
	import { ArrowLeft, ArrowRight, RotateCcwIcon, RotateCw, X } from 'lucide-svelte';

	let { data } = $props();

	function getWeeksInMonth(year: number, month: number): (Dayjs | null)[][] {
		const firstDayOfMonth = dayjs(`${year}-${month}-01`);
		const lastDayOfMonth = firstDayOfMonth.endOf('month');

		// dayjs: Sunday = 0 → Monday = 0
		const mondayIndex = (firstDayOfMonth.day() + 6) % 7;

		// Back up to Monday
		let current = firstDayOfMonth.subtract(mondayIndex, 'day');

		const weeks: (Dayjs | null)[][] = [];

		while (current.isBefore(lastDayOfMonth) || current.isSame(lastDayOfMonth, 'day')) {
			const week: (Dayjs | null)[] = [];

			for (let i = 0; i < 7; i++) {
				if (current.month() === month - 1) {
					week.push(current);
				} else {
					week.push(null);
				}

				current = current.add(1, 'day');
			}

			weeks.push(week);
		}

		return weeks;
	}

	const weeks = $derived(getWeeksInMonth(data.year, data.month));
</script>

<ScreenContainer>
	<div class="pt-16"></div>
	<div class="w-full">
		<div class="flex h-20 items-center px-4">
			<div class="grow text-xl font-semibold">
				{weeks[0].find((d) => d !== null)?.format('MMMM YYYY')}
			</div>
			<div class="flex gap-4 px-2">
				{#if data.month - 1 !== dayjs().month() || data.year !== dayjs().year()}
					<Button
						type="link"
						href="/app/calendar/{dayjs().year()}/{dayjs().month() + 1}"
						style="text"
						size="lg"
						icon={RotateCcwIcon}
					></Button>
				{/if}
				<Button
					type="link"
					href="/app/calendar/{data.month === 1 ? data.year - 1 : data.year}/{data.month === 1
						? 12
						: data.month - 1}"
					style="text"
					size="lg"
					icon={ArrowLeft}
				></Button>
				<Button
					type="link"
					href="/app/calendar/{data.month === 12 ? data.year + 1 : data.year}/{data.month === 12
						? 1
						: data.month + 1}"
					style="text"
					size="lg"
					icon={ArrowRight}
				></Button>
			</div>
		</div>
		<div
			class="*:border-border/20 grid h-10 grid-cols-7 px-1 text-center *:border-r *:px-0 *:pt-1 *:last:border-r-0 sm:text-left *:sm:p-3"
		>
			<div>Mon</div>
			<div>Tue</div>
			<div>Wed</div>
			<div>Thu</div>
			<div>Fri</div>
			<div>Sat</div>
			<div>Sun</div>
		</div>
		<div class="flex flex-col px-1">
			{#each weeks as week, i (i)}
				<div class="border-border/20 grid grid-cols-7 border-t">
					{#each week as day, j (j)}
						<div class="border-border/20 w-full border-r last:border-r-0">
							{#if entries.current?.some((entry) => dayjs(entry.created).isSame(day, 'day')) && day}
								<CalendarEntry {day} />
							{:else}
								<div class="text-border/60 flex h-18 px-3 py-1 text-lg">{day?.date()}</div>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</ScreenContainer>
