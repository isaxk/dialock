<script lang="ts">
	import type { Snippet } from 'svelte';

	let { center = false, children }: { center?: boolean; children?: Snippet } = $props();
</script>

<div class={['flex gap-3', center && 'items-center justify-center']}>
	{#if children}
		{@render children()}
	{/if}
</div>
