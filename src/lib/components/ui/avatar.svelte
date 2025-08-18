<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

	let { user, avatar }: { user: string; avatar: string } = $props();
</script>

<img
	src="{PUBLIC_POCKETBASE_URL}/api/files/_pb_users_auth_/{user}/{avatar}"
	alt=""
	class="h-8 w-8 rounded-md drop-shadow-sm"
/>
