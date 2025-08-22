<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';
	let {
		Icon,
		title,
		description = null
	}: { Icon: typeof IconType; title: string; description?: string | null } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-3">
	<Icon size={60} />
	<div class="text-center">
		<div class="text-2xl/7 font-semibold">{title}</div>
		{#if description}
			<div class="text-sm">{description}</div>
		{/if}
	</div>
</div>
