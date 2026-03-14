<script lang="ts">
	import { Accordion } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';

	import { onMount, type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

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

	const sm = new MediaQuery('(min-width: 640px)');

	function checkStickyness() {
		if (headerElm) {
			const rect = headerElm.getBoundingClientRect();
			isSticky = rect.top <= (stickyWithMonth ? (sm.current ? 54 : 5) : 5);
		}
	}

	onMount(() => {
		window.addEventListener('scroll', checkStickyness);
	});
</script>

<Accordion.Item value={id} class={['border-foreground/10 group flex-grow border-b']}>
	<Accordion.Header
		bind:ref={headerElm}
		class={[
			'bg-background shadow-background top-safe-top sticky z-0 w-full data-[state=open]:z-20 data-[state=open]:shadow-lg sm:top-[calc(54px+env(safe-area-inset-top))] sm:p-0'
		]}
	>
		<Accordion.Trigger
			{onmousemove}
			class={[
				'flex w-full items-center gap-3 px-3 py-5  transition-colors',
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
				<div {...props} class="pt-2 pb-10">
					{@render content()}
				</div>
			{/if}
		{/snippet}
	</Accordion.Content>
</Accordion.Item>
