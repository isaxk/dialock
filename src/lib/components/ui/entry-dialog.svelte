<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { X } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { render } from 'svelte/server';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<Dialog.Portal>
	<Dialog.Overlay
		class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
	/>
	<Dialog.Content
		class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 border-border fixed top-[50%] left-[50%] z-50 flex h-max max-h-[80vh] w-full max-w-xl translate-x-[-50%] translate-y-[-50%]  flex-col gap-4 overflow-hidden rounded-lg border px-7 py-5 pb-8 shadow-xs outline-hidden"
	>
		<div class="flex items-center">
			<Dialog.Title class="grow text-lg font-medium">{title}</Dialog.Title>
			<Dialog.Close class="p-3 pr-0"><X size={20} /></Dialog.Close>
		</div>
		<div class="min-h-0 grow overflow-y-scroll font-serif">
			{@render children()}
		</div>
	</Dialog.Content>
</Dialog.Portal>
