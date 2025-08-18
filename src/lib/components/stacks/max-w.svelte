<script lang="ts">
	import type { Snippet } from 'svelte';

	let { w = 'md', children }: { w?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; children?: Snippet } =
		$props();
</script>

<div
	class={[
		'w-screen',
		{
			'max-w-2xs': w === '2xs',
			'max-w-xs': w === 'xs',
			'max-w-sm': w === 'sm',
			'max-w-md': w === 'md',
			'max-w-lg': w === 'lg',
			'max-w-xl': w === 'xl'
		}
	]}
>
	{#if children}{@render children()}{/if}
</div>
