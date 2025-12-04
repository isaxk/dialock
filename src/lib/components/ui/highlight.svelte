<script lang="ts">
	let { value } = $props();
</script>

{#if Array.isArray(value)}
	{#each value as { matches, text }, i (i)}
		{#if matches}
			<span class="text-foreground bg-zinc-200/80 font-semibold"
				>{@html text.replaceAll('\n', '<br />')}</span
			>
		{:else}
			{@html text.replaceAll('\n', '<br />')}
		{/if}
	{/each}
{:else}
	{value}
{/if}
