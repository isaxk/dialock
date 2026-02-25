<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let {
		id,
		header,
		content,
		forceFullOpacity = false,
		hideContent = false,
		onmousemove = () => {}
	}: {
		id: string;
		header: Snippet;
		content: Snippet;
		forceFullOpacity?: boolean;
		hideContent?: boolean;
		onmousemove?: () => void;
	} = $props();
</script>

<Accordion.Item
	value={id}
	class={['border-foreground/20 group flex-grow border-b last:border-none']}
>
	<Accordion.Header class="bg-background sticky top-[calc(64px+env(safe-area-inset-top))] w-full">
		<Accordion.Trigger
			{onmousemove}
			class={[
				'flex w-full items-center gap-3 p-5 px-3 transition-all',
				forceFullOpacity
					? 'text-foreground'
					: 'text-foreground/60 group-data-[state=open]:text-foreground '
			]}
		>
			{@render header()}
			<div class="transition-all group-data-[state=open]:rotate-180"><ChevronDown /></div>
		</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content forceMount={true}>
		{#snippet child({ props, open })}
			{#if open && !hideContent}
				<div {...props} class="pb-10 font-serif whitespace-break-spaces">
					{@render content()}
				</div>
			{/if}
		{/snippet}
	</Accordion.Content>
</Accordion.Item>
