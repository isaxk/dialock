<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		center = false,
		screen = false,
		padding = false,
		fixed = false,
		children
	}: {
		center?: boolean;
		screen?: boolean;
		padding?: boolean;
		children?: Snippet;
		fixed?: boolean;
	} = $props();
</script>

<div
	class={[
		'flex flex-col gap-6',
		center && 'items-center justify-center',
		screen ? 'min-h-screen w-screen' : 'h-full w-full',
		padding && 'p-5',
		fixed && 'pb-safe-bottom fixed inset-0'
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>
