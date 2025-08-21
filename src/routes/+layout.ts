import type { LayoutLoad } from './$types';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import { browser } from '$app/environment';
import posthog from 'posthog-js';

export const ssr = false;

export const load: LayoutLoad = async ({ url }) => {
	if (browser) {
		posthog.init(PUBLIC_POSTHOG_KEY, {
			api_host: 'https://eu.i.posthog.com',
			defaults: '2025-05-24',
			person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
		});
	}

	const search = new URLSearchParams(url.search);
	const source = search.get('source') || 'null';
	let pwa = false;
	if (source === 'pwa') {
		pwa = true;
	}
	return { pwa };
};
