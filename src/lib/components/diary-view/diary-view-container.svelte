<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let { children }: { children: Snippet } = $props();
</script>

<div class={['mx-auto w-full max-w-screen-sm py-20']} in:fly={{ duration: 400, y: -20 }}>
	{@render children()}
</div>
