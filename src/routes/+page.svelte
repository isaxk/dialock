<script>
	import Decrypter from '$lib/components/decrypter.svelte';
	import DiaryList from '$lib/components/diary-list.svelte';
	import EntryWriter from '$lib/components/entry-writer.svelte';
	import {
		db,
		decrypted,
		diaryUnlocked,
		entries,
		getDecrypted,
		incorrectPassword,
		password,
		user
	} from '$lib/pocketbase/index.svelte';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import { fade, fly, slide } from 'svelte/transition';
	import { Lock, LogOut } from 'lucide-svelte';
	import { focused, typing } from '$lib/state.svelte';
	import LandingPage from '$lib/components/landing-page.svelte';

	let value = $state('');
	let confirm = $state('');
</script>

{#if user.current}
	{#if diaryUnlocked.current}
		<div class={['mx-auto w-full max-w-screen-sm pt-20 pb-20']}>
			<DiaryList />
		</div>

		<div class={['fixed top-0 right-0 left-0']} in:fade={{ duration: 200 }}>
			<div
				class="bg-background border-foreground/30 mx-auto flex h-16 w-full max-w-screen-sm items-center gap-2.5 px-5"
			>
				<img
					src="https://dialock.pockethost.io/api/files/_pb_users_auth_/{user.current.id}/{user
						.current.avatar}"
					alt=""
					class="h-8 w-8 rounded-md drop-shadow-sm"
				/>
				<div class="text-md">
					<span class="font-semibold">{user.current.name}</span>'s diary
				</div>
				<div class="flex-grow"></div>
				<button
					class="flex w-12 flex-col items-center justify-center text-xs"
					onclick={() => {
						diaryUnlocked.current = false;
						password.current = null;
						decrypted.clear();
					}}
				>
					<Lock size={20} />
					Lock
				</button>
				<button class="flex w-12 flex-col items-center justify-center text-xs" onclick={db.logOut}>
					<LogOut size={20} />
					Sign out
				</button>
			</div>
		</div>
	{:else}
		{#if entries.current}
			<div class="flex h-screen w-screen items-center justify-center">
				{#if entries.current.length > 0}
					<div class="flex flex-col items-center">
						<div class="flex flex-col items-center justify-center gap-2 pb-5">
							<Lock size={60} />
							<div class="text-center">
								<div class="text-xl/6 font-semibold">{user.current.name}'s vault</div>
								<div class="text-xs">End to end encryption</div>
							</div>
						</div>
						<div class="pb-1">
							<input
								class="border-foreground rounded-lg border p-2 px-3"
								type="password"
								bind:value
								placeholder="Enter password"
							/>
							<button
								class="bg-foreground text-background rounded-lg px-3 py-2"
								onclick={() => {
									db.unlockDiary(value);
									value = '';
								}}>Unlock</button
							>
						</div>
						<div class="h-4">
							{#if incorrectPassword.current}
								<div class="animate-[wiggle_0.2s_ease-in-out] text-sm text-red-500">
									Incorrect password
								</div>
							{/if}
						</div>
						<button onclick={db.logOut}>or sign out</button>
					</div>
				{:else}
					<div class="flex flex-col items-center">
						<div class="flex flex-col items-center justify-center gap-3 pb-5">
							<Lock size={60} />
							<div>
								<div class="text-2xl/5 font-semibold">Time to create a password</div>
							</div>
						</div>
						<div class="pb-5">
							<ul class="flex w-72 list-disc flex-col items-center gap-1 text-center text-sm/5">
								<li class="w-max">This password is used to encrypt/decrypt your diary entries</li>
								<li class="w-max">
									You <span class="font-semibold">cannot</span> change this password later
								</li>
								<li class="w-max">
									If you forget it, you will <span class="font-semibold">lose access</span> to your diary
								</li>
								<li class="w-max">Store it somewhere safe and secure</li>
							</ul>
						</div>
						<div class="flex flex-col gap-1 pb-1">
							<input
								class="border-foreground rounded-lg border p-2 px-3"
								type="password"
								bind:value
								placeholder="Enter password"
							/>
							<input
								class="border-foreground rounded-lg border p-2 px-3"
								type="password"
								bind:value={confirm}
								placeholder="Confirm password"
							/>
							<button
								class="bg-foreground text-background rounded-lg px-3 py-2"
								onclick={() => {
									if (value === confirm) {
										db.unlockDiary(value);
										value = '';
									}
								}}>Next</button
							>
						</div>
					</div>
				{/if}
			</div>
		{/if}
		<!-- <Decrypter /> -->
	{/if}
{:else}
	<LandingPage />
{/if}
