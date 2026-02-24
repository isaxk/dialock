<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '../ui/button.svelte';
	import { Check } from 'lucide-svelte';
	import { Circle } from 'svelte-loading-spinners';

	let {
		title,
		description,
		children,
		unsavedChanges = false,
		vertical = false,
		onSave = async () => {}
	}: {
		title: string;
		description?: string;
		children: Snippet;
		vertical?: boolean;
		unsavedChanges?: boolean;
		onSave?: () => Promise<void>;
	} = $props();

	let saving = $state(false);

	async function handleSave() {
		saving = true;
		await onSave();
		saving = false;
	}
</script>

<div class={['flex', vertical ? 'flex-col gap-4' : 'flex-row items-center']}>
	<div class={['flex items-center', !vertical && 'h-full flex-grow ']}>
		<div class={['flex-grow']}>
			<div class="text-lg font-medium">{title}</div>
			{#if description}
				<div class="text-[10px] sm:text-xs">
					{description}
				</div>
			{/if}
		</div>
		{#if unsavedChanges && vertical}
			<div class="flex h-full items-center justify-center">
				{#if saving}
					<Circle size={25} unit="px" color="#000" />
				{:else}
					<Button
						onclick={handleSave}
						size="lg"
						icon={Check}
						label="Save"
						hiddenLabel
						shape="circle"
					/>
				{/if}
			</div>
		{/if}
	</div>
	{@render children()}
</div>
