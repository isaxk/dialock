<script lang="ts">
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<div class={['fixed top-0 right-0 left-0 z-50']}>
	<div
		class="bg-background border-foreground/30 mx-auto flex h-16 w-full max-w-screen-sm items-center gap-2.5 px-5"
	>
		{@render children()}
	</div>
</div>
