<script lang="ts">
	import { goto, preloadCode } from '$app/navigation';
	import { page } from '$app/state';

	import dayjs from 'dayjs';
	import { onMount, type Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	import MainHeader from '$lib/components/header/main-header.svelte';
	import Loading from '$lib/components/screens/Loading.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { db, diaryUnlocked, user } from '$lib/pocketbase/index.svelte';

	import type { PageData } from './$types';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	let mounted = $state(false);

	$effect(() => {
		if (!user.current && !data.pwa) {
			goto('/', { replaceState: true });
		}
		mounted = true;
	});

	$effect(() => {
		if (!diaryUnlocked.current && page.url.pathname !== '/app') {
			goto(page.url.pathname === '/app/diary' ? '/app' : '/app?afterUnlock=' + page.url.pathname, {
				replaceState: true
			});
		}
	});
	onMount(() => {
		preloadCode('/app/diary');
		preloadCode(`/app/calendar/${dayjs().year()}/${dayjs().month() + 1}`);
		preloadCode('/app/search');
		preloadCode('/app/settings');
	});
</script>

{#if (data.url === '/app/diary' || data.url.includes('/app/calendar') || data.url === '/app/search') && diaryUnlocked.current}
	<MainHeader />
{/if}

{#key data.url}
	<div
		class="pt-safe-top"
		out:fade={{ duration: 100 }}
		in:scale={{ duration: 200, start: 0.99, delay: 125 }}
	>
		{#if user.current && mounted && (page.url.pathname === '/app' || diaryUnlocked.current)}
			{@render children()}
		{:else if data.pwa}
			<div class="flex h-screen items-center justify-center">
				<div class="flex flex-col items-center">
					<div class="font-serif text-4xl font-semibold">Dialock</div>
					<div class="pb-3 text-lg font-medium">The simple, secure diary.</div>
					<Button label="Sign in with Google" onclick={db.loginInWithGoogle} />
				</div>
				<div class="fixed bottom-6">PWA Installed</div>
			</div>
		{:else}
			<Loading></Loading>
		{/if}
	</div>
{/key}
