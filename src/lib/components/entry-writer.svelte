<script lang="ts">
	import { db } from '$lib/pocketbase/index.svelte';
	import { receive, send } from '$lib/transition';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { ArrowUp, ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import SmartTextarea from './smart-textarea.svelte';

	let value = $state('');
	let clientHeight = $state();

	let topElm: HTMLDivElement|undefined = $state();
</script>

<div class="" transition:slide={{ duration: 200 }}>
	<div bind:this={topElm}></div>
	<Accordion.Item class="group" value="today">
		<Accordion.Header class="sticky top-0 w-full">
			<div
				in:receive|global={{ key: 'today' }}
				out:send|global={{ key: 'today' }}
				class={['bg-background flex items-center gap-4 pr-5 transition-all']}
			>
				<Accordion.Trigger class={['w-full px-5 py-5 text-left transition-all']}>
					<div class="text-xl font-semibold">New entry</div>
					<div class="">
						{dayjs().format('MMM D, YYYY')}
					</div>
				</Accordion.Trigger>

				<button
					onclick={() => {
						db.createEntry(value);
					}}
					class={[
						'bg-foreground text-background hidden h-10 max-h-10 min-h-10 w-10 max-w-10 min-w-10 items-center justify-center rounded-full transition-all group-data-[state=open]:flex'
					]}
				>
					<ArrowUp />
				</button>

				<Accordion.Trigger class={['transition-all group-data-[state=open]:rotate-180']}>
					<ChevronDown />
				</Accordion.Trigger>
			</div>
		</Accordion.Header>
		<Accordion.Content class="" forceMount={true}>
			{#snippet child({ props, open })}
				{#if open}
					<div
						{...props}
						style:height="{clientHeight}px"
						class="overflow-hidden"
						transition:slide={{ duration: 500 }}
					>
						<div bind:clientHeight>
							<SmartTextarea bind:value></SmartTextarea>
						</div>
					</div>
				{/if}
			{/snippet}
		</Accordion.Content>
	</Accordion.Item>
</div>
