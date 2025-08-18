<script lang="ts">
	import type { Snippet } from 'svelte';

	let { center = false, children }: { center?: boolean; children?: Snippet } = $props();
</script>

<div class={['flex flex-col gap-1', center && 'items-center justify-center']}>
	{#if children}
		{@render children()}
	{/if}
</div>
