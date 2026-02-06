<script lang="ts">
	import HeaderContainer from './header-container.svelte';
	import Avatar from '../ui/avatar.svelte';
	import { db, user } from '$lib/pocketbase/index.svelte';
	import Button from '../ui/button.svelte';
	import {
		CalendarIcon,
		GalleryVertical,
		List,
		Lock,
		LogOut,
		Menu,
		MenuIcon,
		Search,
		Settings2,
		XIcon
	} from 'lucide-svelte';
	import FlexWide from '../stacks/flex-wide.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { fade, fly } from 'svelte/transition';
	import { DropdownMenu } from 'bits-ui';
	import { page } from '$app/state';
	import dayjs from 'dayjs';

	let showMainHeader = $state(false);

	const sm = new MediaQuery('(min-width: 640px)');
</script>

{#snippet menu()}
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			align="end"
			sideOffset={sm.current ? 6 : 10}
			class="bg-background border-border z-[10000] min-w-32 rounded-lg border px-1 py-2 text-sm drop-shadow-xs"
		>
			<a href="/app/settings">
				<DropdownMenu.Item class="flex items-center gap-1.5 p-3 py-1.5"
					><Settings2 size={18} /> Settings</DropdownMenu.Item
				>
			</a>
			<DropdownMenu.Item class="flex items-center gap-1.5 p-3 py-1.5" onclick={db.lockDiary}
				><Lock size={18} /> Lock</DropdownMenu.Item
			>
			<DropdownMenu.Item class="flex items-center gap-1.5 p-3 py-1.5" onclick={db.logOut}
				><LogOut size={18} /> Sign out</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
{/snippet}

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

	<div
		class="border-border pb-safe-bottom bg-background fixed right-0 bottom-0 left-0 flex items-center gap-0.5 rounded-none border-t p-1 sm:static sm:rounded-lg sm:border sm:p-0.5"
	>
		<a
			href="/app/diary"
			class={[
				' flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 text-xs transition-all sm:h-10 sm:w-16 sm:gap-0',

				page.url.pathname === '/app/diary'
					? 'border-outline bg-primary text-background dark:text-primary dark:bg-transparent'
					: 'border-transparent'
			]}
		>
			<GalleryVertical size={16} />
			Feed
		</a>
		<a
			href="/app/calendar/{dayjs().year()}/{dayjs().month() + 1}"
			class={[
				' flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 text-xs transition-all sm:h-10 sm:w-16 sm:gap-0',

				page.url.pathname.includes('/app/calendar')
					? 'border-outline bg-primary text-background dark:text-primary dark:bg-transparent'
					: 'border-transparent'
			]}
		>
			<CalendarIcon size={16} />
			Calendar
		</a>
		<a
			href="/app/search"
			class={[
				' flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 text-xs transition-all sm:h-10 sm:w-16 sm:gap-0',

				page.url.pathname === '/app/search'
					? 'border-outline bg-primary text-background dark:text-primary dark:bg-transparent'
					: 'border-transparent'
			]}
		>
			<Search size={16} />
			Search
		</a>
		{#if !sm.current}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="flex h-12 w-full flex-col items-center justify-center gap-0.5 rounded-md border border-transparent px-1 text-xs transition-all sm:h-10 sm:w-16 sm:gap-0"
				>
					<Menu size={16} />
					Menu
				</DropdownMenu.Trigger>
				{@render menu()}
			</DropdownMenu.Root>
		{/if}
	</div>

	{#if sm.current}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button
					onclick={() => (showMainHeader = true)}
					style="text"
					size="xs"
					stack="vertical"
					icon={MenuIcon}
					label="Menu"
				/>
			</DropdownMenu.Trigger>
			{@render menu()}
		</DropdownMenu.Root>
	{/if}

	<!-- {#if md.current || showMainHeader}
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
	{:else}{/if} -->

	<!-- {#if !md.current}
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
	{/if} -->
</HeaderContainer>
