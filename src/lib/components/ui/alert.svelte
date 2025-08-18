<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		trigger,
		title,
		description,
		content,
		onConfirm = () => {},
		submitText = 'Continue'
	}: {
		trigger: Snippet;
		title: string;
		description?: string;
		content?: Snippet;
		onConfirm?: () => void;
		submitText?: string;
	} = $props();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>{@render trigger()}</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<AlertDialog.Content
			class="bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-7 outline-hidden sm:max-w-lg md:w-full "
		>
			<div class="flex flex-col gap-4 pb-6">
				<AlertDialog.Title class="text-lg font-semibold tracking-tight">
					{title}
				</AlertDialog.Title>
				{#if description}
					<AlertDialog.Description class="text-foreground-alt text-sm">
						{description}
					</AlertDialog.Description>
				{/if}
				{#if content}
					{@render content()}
				{/if}
			</div>

			<div class="flex w-full items-center justify-center gap-2">
				<AlertDialog.Cancel
					class="bg-background text-foreground border-border hover:bg-foreground/10 flex w-full items-center justify-center rounded-lg border px-5 py-2 transition-all duration-100 hover:cursor-pointer"
				>
					Cancel
				</AlertDialog.Cancel>
				<AlertDialog.Action
					onclick={onConfirm}
					class="bg-foreground text-background border-foreground hover:bg-foreground/90 flex w-full items-center justify-center rounded-lg border px-5 py-2 transition-all duration-100 hover:cursor-pointer"
				>
					{submitText}
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
