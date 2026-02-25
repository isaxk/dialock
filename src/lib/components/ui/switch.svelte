<script lang="ts">
	import { Switch } from 'bits-ui';

	let {
		id,
		name,
		checked = $bindable(false),
		onCheckedChange
	}: {
		id: string;
		name: string;
		checked: boolean;
		onCheckedChange: (checked: boolean) => void;
	} = $props();
</script>

<Switch.Root
	{onCheckedChange}
	bind:checked
	{id}
	{name}
	class="focus-visible:ring-foreground focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-border/30 dark:data-[state=unchecked]:bg-border/60 data-[state=unchecked]:shadow-mini-inset peer inline-flex h-[28px] min-h-[28px] w-[50px] shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
>
	<Switch.Thumb
		class="bg-background data-[state=unchecked]:shadow-mini dark:border-background/30 dark:shadow-popover pointer-events-none block size-[22px] shrink-0 rounded-full transition-transform data-[state=checked]:translate-x-5.5 data-[state=unchecked]:translate-x-0 dark:border dark:data-[state=unchecked]:border"
	/>
</Switch.Root>
