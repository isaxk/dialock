<script>
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';

	import { Dialog } from 'bits-ui';
	import { theme } from 'mode-watcher';

	import FlexThin from '$lib/components/stacks/flex-thin.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { db, user } from '$lib/pocketbase/index.svelte';

	import screenshotDark from '$assets/screenshot-dark.png';
	import screenshotLight from '$assets/screenshot-light.png';

	let username = $state('');
	let password = $state('');
</script>

<div class="flex w-screen justify-center">
	<div
		class="flex w-full max-w-screen-md flex-col-reverse items-center gap-10 px-10 pt-10 sm:flex-row sm:pt-50"
	>
		<div class="flex flex-grow flex-col items-center text-center sm:items-start sm:text-left">
			<div>
				<div class="font-serif text-4xl font-semibold">Dialock</div>
				<div class="text-lg font-medium">The simple, secure diary.</div>
			</div>
			<div class="py-3 pb-5 text-left">
				<ul class="list-disc pl-5">
					<li>End to end encrypted</li>
					<li>Open source</li>
					<li>Minimal, cosy design</li>
				</ul>
			</div>
			{#if user.current}
				<FlexThin center>
					<Button type="link" href="/app" label="Go to Diary" />
					<Button style="secondary" onclick={db.logOut} label="Sign Out" />
				</FlexThin>
			{:else}
				<FlexThin>
					<Button
						onclick={() => {
							db.loginInWithGoogle().then(() => {
								goto('/app', { replaceState: true });
							});
						}}
						label="Sign In With Google"
					/>
					{#if dev}
						<Dialog.Root>
							<Dialog.Trigger
								><Button style="secondary" onclick={() => {}} label="Test" /></Dialog.Trigger
							>
							<Dialog.Portal>
								<Dialog.Content
									class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 border-border fixed top-[50%] left-[50%] z-50 flex h-max max-h-[80vh] w-full max-w-xl translate-x-[-50%] translate-y-[-50%]  flex-col gap-4 overflow-hidden rounded-lg border px-7 py-5 pb-8 shadow-xs outline-hidden"
								>
									<div class="flex items-center">
										<div class="w-24">Username</div>
										<div class="grow">
											<Input bind:value={username} fullWidth />
										</div>
									</div>
									<div class="flex items-center">
										<div class="w-24">Password</div>
										<div class="grow">
											<Input bind:value={password} fullWidth type="password" />
										</div>
									</div>
									<Button
										onclick={() => {
											db.loginWithPassword(username, password);
										}}
										label="Sign In"
									/>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>
					{/if}
				</FlexThin>
			{/if}
			<a href="https://github.com/isaxk/dialock" class="text-foreground/80 block pt-2 underline"
				>View on GitHub {theme.current}</a
			>
		</div>
		<div>
			<div
				class="border-border bg-background aspect-square h-84 max-h-[50vh] rounded-xl border p-4 drop-shadow-sm sm:h-auto"
			>
				<img src={screenshotDark} class="hidden h-full sm:w-82 dark:block" alt="" />
				<img src={screenshotLight} class="block h-full sm:w-82 dark:hidden" alt="" />
			</div>
		</div>
	</div>
</div>
