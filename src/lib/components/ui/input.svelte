<script lang="ts">
	import { Icon } from 'lucide-svelte';

	let {
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		icon: IconComponent,
		fullWidth = false,
		autofocus = false
	}: {
		value?: string;
		placeholder?: string;
		icon?: typeof Icon;
		type?: 'text' | 'password';
		fullWidth?: boolean;
		autofocus?: boolean;
	} = $props();
</script>

{#if IconComponent}
	<div class="relative">
		<div class="absolute top-0 bottom-0 left-0 flex w-11 items-center justify-center">
			<IconComponent size={20} />
		</div>
		<input
			class={[
				'border-border focus:outline-outline rounded-lg border p-2 px-3 pl-10 outline-2 -outline-offset-2 outline-transparent transition-all outline-solid',
				fullWidth && 'w-full'
			]}
			{type}
			bind:value
			{placeholder}
			{autofocus}
		/>
	</div>
{:else}
	<input
		class={[
			'border-border focus:outline-outline rounded-lg border p-2 px-3 outline-2 -outline-offset-2 outline-transparent transition-all outline-solid',
			fullWidth && 'w-full'
		]}
		{type}
		bind:value
		{placeholder}
		{autofocus}
	/>
{/if}
