<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		center = false,
		screen = false,
		padding = false,
		children
	}: { center?: boolean; screen?: boolean; padding?: boolean; children?: Snippet } = $props();
</script>

<div
	class={[
		'flex flex-col gap-6',
		center && 'items-center justify-center',
		screen ? 'min-h-screen w-screen' : 'h-full w-full',
		padding && 'p-5'
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>
