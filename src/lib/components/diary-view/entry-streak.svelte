<script lang="ts">
	import { Flame } from 'lucide-svelte';

	let { streak }: { streak: number } = $props();
</script>

{#if streak > 1}
	<div class="flex items-center pr-2">
		<Flame size={24} />
		<div class="text-sm font-medium">
			{streak}
		</div>
	</div>
{/if}
