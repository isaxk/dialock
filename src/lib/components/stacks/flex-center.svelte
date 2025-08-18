<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		screen = false,
		children,
		grow = false
	}: { screen?: boolean; children?: Snippet; grow?: boolean } = $props();
</script>

<div
	class={[
		'flex items-center justify-center',
		screen ? 'h-screen w-screen' : 'h-full w-full',
		grow && 'flex-grow'
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>
