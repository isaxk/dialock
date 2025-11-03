import dayjs from 'dayjs';

export const throttle = (fn: Function, wait: number = 300) => {
	let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;
	return function (this: any) {
		const context = this,
			args = arguments;
		if (!inThrottle) {
			fn.apply(context, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			clearTimeout(lastFn);
			lastFn = setTimeout(
				() => {
					if (Date.now() - lastTime >= wait) {
						fn.apply(context, args);
						lastTime = Date.now();
					}
				},
				Math.max(wait - (Date.now() - lastTime), 0)
			);
		}
	};
};

export function areAdjacentDays(dateA: string, dateB: string) {
	const d1 = dayjs(dateA).startOf('day');
	const d2 = dayjs(dateB).startOf('day');
	return Math.abs(d1.diff(d2, 'day')) === 1;
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
