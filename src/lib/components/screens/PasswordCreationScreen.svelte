<script lang="ts">
	import { Lock } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	import { db } from '$lib/pocketbase/index.svelte';

	import IconHeader from '../header/icon-header.svelte';

	import Button from '../ui/button.svelte';
	import Input from '../ui/input.svelte';
	import Wiggler from '../ui/wiggler.svelte';

	let value = $state('');
	let confirm = $state('');

	let error: 'short' | 'mismatch' | null = $state(null);

	function handleSubmit() {
		if (value !== confirm) {
			error = 'mismatch';
		} else if (value.length < 8) {
			error = 'short';
		} else {
			db.unlockDiary(value);
			value = '';
		}
	}
</script>

<form
	class="flex flex-col items-center justify-center gap-6"
	onsubmit={(e) => e.preventDefault()}
	in:fade|global={{ duration: 200 }}
>
	<IconHeader
		Icon={Lock}
		title="Time to create a diary password"
		description="End to end encryption"
	/>
	<div>
		<ul class="flex w-72 list-disc flex-col items-center gap-1 text-center text-sm/5">
			<li class="w-max">This password is used to encrypt/decrypt your diary entries</li>
			<li class="w-max">
				You <span class="font-semibold">cannot</span> change this password later
			</li>
			<li class="w-max">
				If you forget it, you will <span class="font-semibold">lose access</span> to your diary
			</li>
			<li class="w-max">Store it secure, seperate from your Google Account</li>
		</ul>
	</div>
	<div class="w-screen max-w-2xs">
		<div class="flex flex-col items-center gap-1">
			<Input fullWidth type="password" bind:value placeholder="Enter password" />
			<Input fullWidth type="password" bind:value={confirm} placeholder="Confirm password" />
			<Button type="submit" onclick={handleSubmit} label="Next" fullWidth />
			<div class="h-4">
				{#if error === 'short'}
					<Wiggler message="Password must be at least 8 characters long" />
				{:else if error === 'mismatch'}
					<Wiggler message="Passwords do not match" />
				{:else if error}
					<Wiggler message="An error occurred" />
				{/if}
			</div>
		</div>
	</div>
</form>
