<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		fullWidth = false,
		autofocus = false
	}: {
		value?: string;
		placeholder?: string;
		type?: 'text' | 'password';
		fullWidth?: boolean;
		autofocus?: boolean;
	} = $props();
</script>

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
