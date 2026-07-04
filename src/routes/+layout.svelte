<script lang="ts">
	import { ModeWatcher, theme } from 'mode-watcher';
	import { onMount } from 'svelte';

	import '../app.css';
	import { db } from '$lib/pocketbase/index.svelte';
	import { isIOS } from '$lib/utils/state.svelte';
	import { AlertDialog } from 'bits-ui';

	let { children, data } = $props();

	onMount(() => {
		db.authStore();
		if (
			['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
				navigator.platform
			) ||
			// iPad on iOS 13 detection
			(navigator?.userAgent.includes('Mac') && 'ontouchend' in document)
		) {
			isIOS.current = true;
		}
		console.log(navigator.platform);
	});
</script>

<svelte:head>
	<title>Dialock</title>
	<meta name="theme-color" content={theme.current === 'dark' ? '#2b281b' : '#fefbed'} />
</svelte:head>

<ModeWatcher />

{@render children()}
