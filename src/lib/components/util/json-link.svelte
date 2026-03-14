<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		json,
		children,
		fileName
	}: { json?: { date: string; text: string }[]; children: Snippet; fileName?: string } = $props();

	let parsedJson = $state(json ?? null);

	const jsonStr = $derived(parsedJson ? JSON.stringify(parsedJson, null, 2) : null);
	const href = $derived(
		jsonStr ? `data:text/json;charset=utf-8,${encodeURIComponent(jsonStr)}` : null
	);
</script>

<a {href} download={fileName} class={['contents']}>
	{@render children()}
</a>
