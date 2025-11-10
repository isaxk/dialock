<script lang="ts">
	import HeaderContainer from './header-container.svelte';
	import Avatar from '../ui/avatar.svelte';
	import { db, user } from '$lib/pocketbase/index.svelte';
	import Button from '../ui/button.svelte';
	import { Lock, LogOut, MenuIcon, Settings2, XIcon } from 'lucide-svelte';
	import FlexWide from '../stacks/flex-wide.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { fade, fly } from 'svelte/transition';

	let showMainHeader = $state(false);

	const md = new MediaQuery('(min-width: 768px)');
</script>

<HeaderContainer>
	{#if user.current}
		{#if user.current.avatar}
			<Avatar user={user.current.id} avatar={user.current.avatar} />
		{/if}
		{#if !showMainHeader}
			<div class="text-md" transition:fade={{ duration: 200 }}>
				<span class="font-semibold">{user.current.name}</span>'s diary
			</div>
		{/if}
	{/if}

	<div class="flex-grow"></div>
	{#if md.current || showMainHeader}
		<div
			transition:fly={{ x: 100, duration: 200 }}
			class={[
				!md.current &&
					'border-border/60 absolute top-3 right-16 bottom-3 flex items-center border-r pr-3'
			]}
		>
			<FlexWide center>
				<Button
					style="text"
					size="xs"
					type="link"
					stack="vertical"
					href="/app/settings"
					icon={Settings2}
					label="Settings"
				/>
				<Button
					style="text"
					size="xs"
					stack="vertical"
					onclick={db.lockDiary}
					icon={Lock}
					label="Lock"
				/>
				<Button
					style="text"
					size="xs"
					stack="vertical"
					onclick={db.logOut}
					icon={LogOut}
					label="Sign Out"
				/>
			</FlexWide>
		</div>
	{:else}{/if}

	{#if !md.current}
		{#if showMainHeader}
			<Button
				onclick={() => (showMainHeader = false)}
				style="text"
				size="xs"
				stack="vertical"
				icon={XIcon}
				label="Close"
			/>
		{:else}
			<Button
				onclick={() => (showMainHeader = true)}
				style="text"
				size="xs"
				stack="vertical"
				icon={MenuIcon}
				label="Menu"
			/>
		{/if}
	{/if}
</HeaderContainer>
