<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { db, user } from '$lib/pocketbase/index.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		db.authStore();
	});

	$inspect(user.current);
</script>

<svelte:head>
	<title>Dialock</title>
</svelte:head>

<ModeWatcher />

{@render children()}
