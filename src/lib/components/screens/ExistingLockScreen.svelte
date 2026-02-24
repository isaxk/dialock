<script>
	import { Lock } from 'lucide-svelte';
	import FlexColWide from '../stacks/flex-col-wide.svelte';
	import Button from '../ui/button.svelte';
	import { db, incorrectPassword, user } from '$lib/pocketbase/index.svelte';
	import IconHeader from '../header/icon-header.svelte';
	import FlexColThin from '../stacks/flex-col-thin.svelte';
	import FlexThin from '../stacks/flex-thin.svelte';
	import Input from '../ui/input.svelte';
	import Wiggler from '../ui/wiggler.svelte';
	import { fade } from 'svelte/transition';
	import { recoveringBackup } from '$lib/utils/state.svelte';

	let value = $state('');
</script>

<form onsubmit={(e) => e.preventDefault()}>
	<FlexColWide>
		<IconHeader
			Icon={Lock}
			title={user?.current?.name + "'s diary"}
			description="End to end encryption"
		/>
		<FlexColThin center>
			<FlexThin>
				<Input type="password" autofocus bind:value placeholder="Enter password" />
				<Button
					type="submit"
					onclick={() => {
						db.unlockDiary(value);
						value = '';
					}}
					label="Unlock"
				/>
			</FlexThin>
			<div class="h-4">
				{#if incorrectPassword.current}
					<Wiggler message="Incorrect password" />
				{:else if recoveringBackup.current}
					Recovering backup...
				{/if}
			</div>
		</FlexColThin>
	</FlexColWide>
</form>
