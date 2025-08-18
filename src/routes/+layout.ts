import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ url }) => {
	const search = new URLSearchParams(url.search);
	const source = search.get('source') || 'null';
	let pwa = false;
	if (source === 'pwa') {
		pwa = true;
	}
	return { pwa };
};
