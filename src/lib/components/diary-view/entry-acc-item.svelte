<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';

	import { onMount, type Snippet } from 'svelte';

	let {
		id,
		header,
		content,
		forceFullOpacity = false,
		hideContent = false,
		stickyWithMonth = false,
		onmousemove = () => {}
	}: {
		id: string;
		header: Snippet<[boolean]>;
		content: Snippet;
		forceFullOpacity?: boolean;
		hideContent?: boolean;
		stickyWithMonth?: boolean;
		onmousemove?: () => void;
	} = $props();

	let headerElm: HTMLElement | null = $state(null);
	let isSticky = $state(false);

	function checkStickyness() {
		if (headerElm) {
			const rect = headerElm.getBoundingClientRect();
			isSticky = rect.top <= (stickyWithMonth ? 54 : 5);
		}
	}

	onMount(() => {
		window.addEventListener('scroll', checkStickyness);
	});
</script>

<Accordion.Item
	value={id}
	class={['border-foreground/10 group flex-grow border-b last:border-none']}
>
	<Accordion.Header
		bind:ref={headerElm}
		style="background-image: linear-gradient(to bottom, transparent, var(--color-background), var(--color-background), transparent)"
		class={[
			'sticky z-0 w-full pt-3 pb-3 data-[state=open]:z-20',
			'top-[calc(54px+env(safe-area-inset-top))]'
		]}
	>
		<Accordion.Trigger
			{onmousemove}
			class={[
				'flex w-full items-center gap-3 px-3 py-2  transition-colors',
				forceFullOpacity
					? 'text-foreground'
					: 'text-foreground/60 group-data-[state=open]:text-foreground '
			]}
		>
			<div class="flex grow items-center gap-3">
				{@render header(isSticky)}
			</div>
			<div class="transition-all group-data-[state=open]:rotate-180"><ChevronDown /></div>
		</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content forceMount={true}>
		{#snippet child({ props, open })}
			{#if open && !hideContent}
				<div {...props} class="pb-10">
					{@render content()}
				</div>
			{/if}
		{/snippet}
	</Accordion.Content>
</Accordion.Item>
