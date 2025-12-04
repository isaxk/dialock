import { tick } from 'svelte';

function resize({ target }: { target: HTMLElement }) {
	// target.style.height = '1px';
	target.style.height = +target.scrollHeight + 'px';
}

export function text_area_resize(el: HTMLElement) {
	resize({ target: el });
	tick().then(() => resize({ target: el }));
	setTimeout(() => resize({ target: el }), 100);
	el.style.overflow = 'hidden';
	el.addEventListener('input', () => resize({ target: el }));

	// const intervalId = setInterval(() => resize({ target: el }), 1000);

	return {
		destroy: () => {
			el.removeEventListener('input', () => resize({ target: el }));
			// clearInterval(intervalId);
		}
	};
}
