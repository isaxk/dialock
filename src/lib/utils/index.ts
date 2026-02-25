import type { EntriesStoreItem } from '$lib/types/types';
import dayjs, { Dayjs } from 'dayjs';

export function throttle<T extends (this: U, ...args: A) => R, U, A extends unknown[], R>(
	fn: T,
	wait = 300
): (this: U, ...args: A) => void {
	let inThrottle = false;
	let lastFn: ReturnType<typeof setTimeout> | undefined;
	let lastTime = 0;

	return function (this: U, ...args: A): void {
		if (!inThrottle) {
			fn.apply(this, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			if (lastFn) {
				clearTimeout(lastFn);
			}

			const remaining = wait - (Date.now() - lastTime);

			lastFn = setTimeout(
				() => {
					if (Date.now() - lastTime >= wait) {
						fn.apply(this, args);
						lastTime = Date.now();
					}
				},
				Math.max(remaining, 0)
			);
		}
	};
}

export function areAdjacentDays(dateA: string, dateB: string) {
	const d1 = dayjs(dateA).startOf('day');
	const d2 = dayjs(dateB).startOf('day');
	return Math.abs(d1.diff(d2, 'day')) === 1;
}

export function getWeeksInMonth(year: number, month: number): (Dayjs | null)[][] {
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

export const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
	let timeoutTimer: ReturnType<typeof setTimeout>;

	return (...args: T) => {
		clearTimeout(timeoutTimer);

		timeoutTimer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

export function calculateStreak(entryId: string | null, entries: EntriesStoreItem[]) {
	if (!entryId) return 0;
	const current = entries.findIndex((e) => e.id === entryId);
	if (!current) return 0;
	const previous = entries.filter((_, i) => i <= current).toReversed();

	let streak = 1;

	if (previous) {
		for (let i = 0; i < previous.length; i++) {
			const a = previous[i]?.created;
			const b = previous[i + 1]?.created;
			if (a && b) {
				if (areAdjacentDays(a, b)) {
					streak = streak + 1;
				} else {
					break;
				}
			}
		}
	}

	return streak;
}

export function groupByMonth(entries: EntriesStoreItem[]) {
	const grouped = entries.reduce(
		(acc, entry) => {
			const month = dayjs(entry.created).format('MMMM YYYY');
			if (!acc[month]) {
				acc[month] = [];
			}
			acc[month].push(entry);
			return acc;
		},
		{} as Record<string, EntriesStoreItem[]>
	);

	return Object.entries(grouped).map(([month, entries]) => ({
		month,
		entries
	}));
}
