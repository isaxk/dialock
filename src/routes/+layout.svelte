<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { db } from '$lib/pocketbase/index.svelte';

	let { children } = $props();

	onMount(() => {
		db.authStore();
	});
</script>

{@render children()}
