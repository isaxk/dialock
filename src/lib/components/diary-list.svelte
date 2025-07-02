<script lang="ts">
	import {
		db,
		decrypted,
		entries,
		getDecrypted,
		incorrectPassword,
		password,
		user
	} from '$lib/pocketbase/index.svelte';
	import autosize from 'svelte-autosize';
	import { Accordion } from 'bits-ui';
	import dayjs from 'dayjs';
	import EntryWriter from './entry-writer.svelte';
	import { crossfade, slide } from 'svelte/transition';
	import { get } from 'svelte/store';
	import { decryptDiary, deriveKey } from '$lib/crypto';
	import { receive, send } from '$lib/transition';
	import DiaryEntry from './diary-entry.svelte';
	import { ArrowUp, ChevronDown } from 'lucide-svelte';
	import { focused, ignoreScroll, typing } from '$lib/state.svelte';
	import SmartTextarea from './smart-textarea.svelte';
	import { onMount } from 'svelte';

	let value = $state('');
	let clientHeight = $state();
	let scrollIntoView: HTMLDivElement | undefined = $state();

	let accordionVal = $state('today');
	let now = $state(dayjs());

	function handleKeyDown() {
		typing.current = true;
		scrollIntoView?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
	}

	function toggleToday() {
		if (accordionVal === 'today') {
			accordionVal = 'null';
		} else {
			accordionVal = 'today';
		}
	}

	onMount(() => {
		const interval = setInterval(() => {
			now = dayjs();
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<svelte:window
	onmousemove={() => {
		typing.current = false;
	}}
	onscroll={() => {
		if (!ignoreScroll.current) {
			typing.current = false;
		}
	}}
/>

{#if entries.current}
	<Accordion.Root bind:value={accordionVal} type="single">
		{#each entries.current as entry (entry.id)}
			<DiaryEntry {entry} />
		{/each}
		<!-- {#if !entries.current.some((entry) => dayjs(entry.created).isSame(now, 'day'))} -->
		{#if true}
			<div class="" transition:slide={{ duration: 200 }}>
				<Accordion.Item class="group" value="today">
					<Accordion.Header class="sticky top-16 w-full">
						<div
							in:receive|global={{ key: 'today' }}
							out:send|global={{ key: 'today' }}
							class={['bg-background flex items-center gap-4 px-5 pr-5 transition-all']}
						>
							<button onclick={toggleToday} class={['w-full py-5 text-left transition-all']}>
								<div class="text-xl font-semibold">New entry</div>
								<div class="">
									{dayjs().format('MMM D, YYYY')}
								</div>
							</button>

							<button
								onclick={() => {
									db.createEntry(value);
								}}
								class={[
									'bg-foreground text-background hidden h-10 max-h-10 min-h-10 w-10 max-w-10 min-w-10 items-center justify-center rounded-full transition-all group-data-[state=open]:flex'
								]}
							>
								<ArrowUp />
							</button>

							<button
								onclick={toggleToday}
								class={['transition-all group-data-[state=open]:rotate-180']}
							>
								<ChevronDown />
							</button>
						</div>
					</Accordion.Header>
					<Accordion.Content class="">
						<SmartTextarea bind:value></SmartTextarea>
					</Accordion.Content>
				</Accordion.Item>
			</div>
		{:else}
			<div class="p-4" transition:slide={{ duration: 200 }}>You have already written today</div>
		{/if}
	</Accordion.Root>
{/if}
