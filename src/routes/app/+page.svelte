<script>
	import { db, diaryUnlocked, entries, user } from '$lib/pocketbase/index.svelte';
	import FlexCenter from '$lib/components/stacks/flex-center.svelte';
	import ExistingLockScreen from '$lib/components/screens/ExistingLockScreen.svelte';
	import PasswordCreationScreen from '$lib/components/screens/PasswordCreationScreen.svelte';
	import FlexColWide from '$lib/components/stacks/flex-col-wide.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { LogOut } from 'lucide-svelte';
	import Loading from '$lib/components/screens/Loading.svelte';
</script>

{#if user.current && entries.current}
	<FlexColWide padding screen fixed>
		<FlexCenter grow>
			{#if entries.current.length > 0}
				<ExistingLockScreen />
			{:else}
				<PasswordCreationScreen />
			{/if}
		</FlexCenter>
		<FlexCenter>
			<Button
				style="text"
				shape="text"
				size="sm"
				stack="horizontal"
				label="Sign out"
				icon={LogOut}
				onclick={db.logOut}
			/>
		</FlexCenter>
	</FlexColWide>
{:else}
	<Loading />
{/if}
