<script>
	import { LogOut } from 'lucide-svelte';

	import ExistingLockScreen from '$lib/components/screens/ExistingLockScreen.svelte';
	import Loading from '$lib/components/screens/Loading.svelte';
	import PasswordCreationScreen from '$lib/components/screens/PasswordCreationScreen.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { db, entries, user } from '$lib/pocketbase/index.svelte';
</script>

{#if user.current && entries.current}
	<div class="pb-safe-bottom fixed inset-0 flex min-h-screen w-screen flex-col gap-6 p-5">
		<div class="flex items-center justify-center flex-grow">
			{#if entries.current.length > 0}
				<ExistingLockScreen />
			{:else}
				<PasswordCreationScreen />
			{/if}
		</div>
		<div class="flex items-center justify-center">
			<div class="pb-5">
				<Button
					style="text"
					shape="text"
					size="sm"
					stack="horizontal"
					label="Sign out"
					icon={LogOut}
					onclick={db.logOut}
				/>
			</div>
		</div>
	</div>
{:else}
	<Loading />
{/if}
