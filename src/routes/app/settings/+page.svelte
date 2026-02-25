<script lang="ts">
	import HeaderContainer from '$lib/components/header/header-container.svelte';
	import SettingsItem from '$lib/components/settings/settings-item.svelte';
	import FlexColWide from '$lib/components/stacks/flex-col-wide.svelte';
	import FlexThin from '$lib/components/stacks/flex-thin.svelte';
	import ScreenContainer from '$lib/components/stacks/screen-container.svelte';
	import Alert from '$lib/components/ui/alert.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import JsonLink from '$lib/components/util/json-link.svelte';
	import { db, decrypted, entries, user } from '$lib/pocketbase/index.svelte';
	import { DropdownMenu } from 'bits-ui';
	import Switch from '$lib/components/ui/switch.svelte';
	import dayjs from 'dayjs';
	import {
		ArrowLeft,
		Braces,
		ChevronDownIcon,
		ComputerIcon,
		Download,
		MoonIcon,
		SunIcon,
		Table2,
		Trash2
	} from 'lucide-svelte';
	import { mode, resetMode, setMode } from 'mode-watcher';
	import { MediaQuery, type SvelteMap } from 'svelte/reactivity';

	const md = new MediaQuery('(min-width: 768px)');

	async function getAllEntries(
		decrypted: SvelteMap<string, string>
	): Promise<{ json: { date: string; text: string }[]; csv: string }> {
		if (!entries.current) return { json: [], csv: '' };
		const promises = Array.from(decrypted.entries()).map(async ([id, entry]) => {
			const entryDetails = entries.current?.find((e) => e.id === id);
			return {
				date: dayjs(entryDetails?.created).format('YYYY-MM-DD'),
				text: entry
			};
		});
		const parsed = await Promise.all(promises);

		// Create CSV header and content
		let csv = 'date,text\n';
		csv += parsed.map((entry) => `${entry.date},"${entry.text.replace(/"/g, '""')}"`).join('\n');

		return {
			json: parsed,
			csv: csv
		};
	}

	let parsed: { json: { date: string; text: string }[]; csv: string } | undefined = $state();

	$effect(() => {
		getAllEntries(decrypted).then((data) => {
			parsed = data;
		});
	});

	let entryTemplateValue = $state(user.current?.entry_template ?? '');
</script>

<HeaderContainer>
	<FlexThin center>
		<Button type="link" href="/app/diary" icon={ArrowLeft} style="text" />
		<div class="text-xl font-semibold">Settings</div>
	</FlexThin>
</HeaderContainer>

<ScreenContainer>
	<FlexColWide padding>
		<SettingsItem
			onSave={async () => {
				await db.updateEntryTemplate(entryTemplateValue);
			}}
			unsavedChanges={entryTemplateValue !== user.current?.entry_template}
			vertical
			title="Template"
			description="Give yourself some prompts. Not end-to-end encrypted, but still stored securely."
		>
			<Textarea bind:value={entryTemplateValue} />
		</SettingsItem>
		<SettingsItem title="Color Scheme" description="Customize how the app appears.">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="bg-background border-border hover:bg-primary/5 flex h-max w-max items-center  rounded-lg border px-3 py-2 transition-all"
				>
					{#if mode.current === 'light'}
						<SunIcon size={20} />
					{:else}
						<MoonIcon size={20} />
					{/if}

					<div class="w-full flex-grow pl-2 text-left">
						Select <span class="hidden sm:inline">Theme</span>
					</div>
					<ChevronDownIcon size={16} />
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						align="end"
						sideOffset={8}
						class="bg-background border-border z-[1000] w-52 rounded-lg border px-1 py-1.5 drop-shadow-xl"
					>
						<DropdownMenu.Item
							class="hover:bg-primary/5 flex h-10 items-center gap-1.5 rounded-lg py-3 pr-1.5 pl-3 transition-all"
							onclick={() => setMode('light')}><SunIcon size={18} /> Light</DropdownMenu.Item
						>
						<DropdownMenu.Item
							class="hover:bg-primary/5 flex h-10 items-center gap-1.5 rounded-lg py-3 pr-1.5 pl-3 transition-all"
							onclick={() => setMode('dark')}><MoonIcon size={18} /> Dark</DropdownMenu.Item
						>
						<DropdownMenu.Item
							class="hover:bg-primary/5 flex h-10 items-center gap-1.5 rounded-lg py-3 pr-1.5 pl-3 transition-all"
							onclick={() => resetMode()}><ComputerIcon size={18} /> System</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</SettingsItem>
		<SettingsItem title="Autosave" description="Automatically save your diary entry drafts">
			<Switch
				id="autosave"
				name="autosave"
				checked={!(user.current?.manual_save ?? false)}
				onCheckedChange={(checked) => {
					db.updateGenericSettings({ manual_save: !checked });
				}}
			/>
		</SettingsItem>
		<SettingsItem title="Export Diary" description="Exported diary is not encrypted.">
			{#if parsed && md.current}
				<div class="flex gap-2">
					<JsonLink
						json={parsed.json}
						fileName={`dialock_export_${dayjs().format('YYYYMMDD_HHMM')}.json`}
					>
						<Button icon={Download} label="JSON" />
					</JsonLink>
					<a
						class="contents"
						href={`data:text/csv;charset=utf-8,${encodeURIComponent(parsed.csv)}`}
						download={`dialock_export_${dayjs().format('YYYYMMDD_HHMM')}.csv`}
					>
						<Button icon={Download} label="CSV" />
					</a>
				</div>
			{:else if parsed}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button icon={Download} label="Download" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content
							class="bg-background border-border flex w-36 flex-col rounded-lg border p-1"
						>
							<DropdownMenu.Item>
								<JsonLink
									json={parsed.json}
									fileName={`dialock_export_${dayjs().format('YYYYMMDD_HHMM')}.json`}
								>
									<div class="flex items-center gap-2 p-2">
										<Braces size={18} />
										JSON
									</div>
								</JsonLink>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a
									href={`data:text/csv;charset=utf-8,${encodeURIComponent(parsed.csv)}`}
									download={`dialock_export_${dayjs().format('YYYYMMDD_HHMM')}.csv`}
								>
									<div class="flex items-center gap-2 p-2">
										<Table2 size={18} />
										CSV
									</div>
								</a>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			{/if}
		</SettingsItem>
		<SettingsItem title="Delete Account & Diary" description="Cannot be undone.">
			<Alert
				title="Are you sure you want to delete your account and diary?"
				description="This action cannot be undone. You can make a new account with a new diary at any time."
				submitText="Delete"
				onConfirm={() => {
					db.deleteAccount();
				}}
			>
				{#snippet trigger()}
					<Button icon={Trash2} label="Delete" />
				{/snippet}
				{#snippet content()}
					{#if parsed}
						<div>
							<JsonLink
								json={parsed.json}
								fileName={`dialock_export_${dayjs().format('YYYYMMDD_HHMM')}.json`}
							>
								<div class="underline">Export JSON</div>
							</JsonLink>
							<a
								class="block underline"
								href={`data:text/csv;charset=utf-8,${encodeURIComponent(parsed.csv)}`}
								download={`dialock_export_${dayjs().format('YYYYMMDD_HHMM')}.csv`}
							>
								Export CSV
							</a>
						</div>
					{/if}
				{/snippet}
			</Alert>
		</SettingsItem>
		<div class="border-border mt-5 flex items-center gap-3 border-t pt-5">
			<div class="flex-grow">
				<div class="font-serif text-2xl">Dialock</div>
			</div>
			<div>
				<div class="flex justify-end gap-3">
					<a class="underline" href="https://www.isaxk.com">isaxk.com</a>
					<a class="underline" href="https://github.com/isaxk/dialock">GitHub project</a>
				</div>
				<div>
					<a class="text-sm" href="https://www.isaxk.com">Copyright &copy; Isaac Boorman 2026</a>
				</div>
			</div>
		</div>
	</FlexColWide>
</ScreenContainer>
