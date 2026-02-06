<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { db, diaryUnlocked, user } from '$lib/pocketbase/index.svelte';
	import { type Snippet } from 'svelte';
	import type { PageData } from './$types';
	import { fade, scale } from 'svelte/transition';
	import Button from '$lib/components/ui/button.svelte';
	import Loading from '$lib/components/screens/Loading.svelte';
	import MainHeader from '$lib/components/header/main-header.svelte';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	let mounted = $state(false);

	$effect(() => {
		if (!user.current && !data.pwa) {
			goto('/');
		}
		mounted = true;
	});

	$effect(() => {
		if (!diaryUnlocked.current && page.url.pathname !== '/app') {
			goto(page.url.pathname === '/app/diary' ? '/app' : '/app?afterUnlock=' + page.url.pathname);
		}
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
