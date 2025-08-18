<script lang="ts">
	let { value = $bindable(), placeholder = '' }: { value: string; placeholder?: string } = $props();
</script>

<textarea
	bind:value
	{placeholder}
	class="border-border focus:outline-outline h-48 w-full resize-none rounded-lg border p-3 font-serif outline-2 -outline-offset-2 outline-transparent transition-all outline-solid"
></textarea>
