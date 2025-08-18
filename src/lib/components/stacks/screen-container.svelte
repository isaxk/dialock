<script lang="ts">
	let { children } = $props();
</script>

<div class="mx-auto min-h-screen w-full max-w-screen-sm px-2">
	{@render children()}
</div>
