<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { db } from '$lib/pocketbase/index.svelte';
	import { ModeWatcher, theme } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		db.authStore();
	});
</script>

<svelte:head>
	<title>Dialock</title>
	<meta name="theme-color" content={theme.current === 'dark' ? '#2b281b' : '#fefbed'} />
</svelte:head>

<ModeWatcher />

{@render children()}
