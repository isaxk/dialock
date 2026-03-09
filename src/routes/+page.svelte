<script>
	import { goto } from '$app/navigation';
	import FlexThin from '$lib/components/stacks/flex-thin.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { db, user } from '$lib/pocketbase/index.svelte';
	import screenshotLight from '$assets/screenshot-light.png';
	import screenshotDark from '$assets/screenshot-dark.png';
	import { theme } from 'mode-watcher';
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
				<Button
					onclick={() => {
						db.loginInWithGoogle().then(() => {
							goto('/app', { replaceState: true });
						});
					}}
					label="Sign In With Google"
				/>
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
