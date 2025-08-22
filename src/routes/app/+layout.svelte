<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { db, diaryUnlocked, user } from '$lib/pocketbase/index.svelte';
	import { type Snippet } from 'svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button.svelte';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	let mounted = $state(false);

	$effect(() => {
		if (!user.current && !data.pwa) {
			goto('/');
		}
		mounted = true;
	});

	$effect(() => {
		console.log(diaryUnlocked, page.url.pathname);
		if (!diaryUnlocked.current && page.url.pathname !== '/app') {
			goto('/app');
		}
	});
</script>

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
{/if}
