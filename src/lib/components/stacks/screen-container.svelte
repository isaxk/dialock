<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen w-full justify-center">
	<div class="w-full max-w-screen-sm px-2">
		{@render children()}
	</div>
</div>
