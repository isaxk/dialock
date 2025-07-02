<script lang="ts">
	import { decryptDiary, deriveKey, encryptDiary } from '$lib/crypto';
	import { user } from '$lib/pocketbase/index.svelte';

	let value = $state('');
    let iv = $state('');
	let password = $state('');

	let encrypted = $state('');

	async function decrypt() {
		if (!user?.current?.salt) return;
		const key = await deriveKey(password, user?.current?.salt);
		const cypher = await decryptDiary(key, iv, value);
		encrypted = cypher;
	}
</script>

<div>
    <div class="text-xl">Decrypter</div>
    <input type="text" bind:value={iv} placeholder="Enter IT" />
	<input type="text" bind:value placeholder="Enter CT" />
	<input type="text" bind:value={password} placeholder="Password" />

	<button onclick={decrypt}>Decrypt</button>

	<div>
		{encrypted}
	</div>
</div>
