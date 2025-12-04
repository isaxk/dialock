<script>
	import { goto } from '$app/navigation';
	import DiaryView from '$lib/components/diary-view/diary-view.svelte';
	import MainHeader from '$lib/components/header/main-header.svelte';
	import { diaryUnlocked } from '$lib/pocketbase/index.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!diaryUnlocked.current) {
			goto('/app');
		}
	});
</script>

<MainHeader />
<DiaryView />
