<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { db } from '$lib/pocketbase/index.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		db.authStore();
	});
</script>

<svelte:head>
	<title>Dialock</title>
</svelte:head>

<ModeWatcher />

{@render children()}
