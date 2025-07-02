<script>
	import { db } from '$lib/pocketbase/index.svelte';
</script>

<div class="flex w-screen justify-center">
	<div class="w-full max-w-screen-md pt-50">
		<div>
			<div class="font-serif text-4xl font-semibold">Dialock</div>
			<div class="text-lg font-medium">the simple, secure diary.</div>
		</div>
		<div class="py-3 pb-5">
			<ul class="list-disc pl-5">
				<li>End to end encrypted</li>
				<li>Open source</li>
				<li>Minimal, cosy design</li>
			</ul>
		</div>
		<button
			onclick={db.loginInWithGoogle}
			class="bg-foreground text-background rounded-md px-5 py-2">Sign In With Google</button
		>
	</div>
</div>
