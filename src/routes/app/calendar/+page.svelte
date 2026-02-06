<script lang="ts">
	import { goto } from '$app/navigation';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import { decrypted, entries } from '$lib/pocketbase/index.svelte';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(`/app/calendar/${dayjs().year()}/${dayjs().month() + 1}`, { replaceState: true });
	});
</script>
