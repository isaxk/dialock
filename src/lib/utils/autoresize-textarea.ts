function resize({ target }: { target: HTMLElement }) {
	target.style.height = '1px';
	target.style.height = +target.scrollHeight + 'px';
}

export function text_area_resize(el: HTMLElement) {
	resize({ target: el });
	el.style.overflow = 'hidden';
	el.addEventListener('input', () => resize({ target: el }));

	return {
		destroy: () => el.removeEventListener('input', () => resize({ target: el }))
	};
}
