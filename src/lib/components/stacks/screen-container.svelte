<script lang="ts">
	let { children, fixed = false } = $props();
</script>

<div class={['flex min-h-screen w-full justify-center', fixed ? 'fixed inset-0' : 'pb-32']}>
	<div class="w-full max-w-screen-sm px-2 pt-16">
		{@render children()}
	</div>
</div>
