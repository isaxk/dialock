<script>
	import { Lock } from 'lucide-svelte';

	import { db, incorrectPassword, user } from '$lib/pocketbase/index.svelte';
	import { recoveringBackup } from '$lib/utils/state.svelte';

	import IconHeader from '../header/icon-header.svelte';

	import Button from '../ui/button.svelte';
	import Input from '../ui/input.svelte';
	import Wiggler from '../ui/wiggler.svelte';

	let value = $state('');
</script>

<form class="flex flex-col gap-6" onsubmit={(e) => e.preventDefault()}>
		<IconHeader
			Icon={Lock}
			title={user?.current?.name + "'s diary"}
			description="End to end encryption"
		/>
		<div class="flex flex-col items-center gap-1">
			<div class="flex gap-1">
				<Input type="password" autofocus bind:value placeholder="Enter password" />
				<Button
					type="submit"
					onclick={() => {
						db.unlockDiary(value);
						value = '';
					}}
					label="Unlock"
				/>
			</div>
			<div class="h-4">
				{#if incorrectPassword.current}
					<Wiggler message="Incorrect password" />
				{:else if recoveringBackup.current}
					<div class="text-sm">Recovering local backup...</div>
				{/if}
			</div>
		</div>
</form>
