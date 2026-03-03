<script lang="ts">
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(`/app/calendar/${dayjs().year()}/${dayjs().month() + 1}`, { replaceState: true });
	});
</script>
