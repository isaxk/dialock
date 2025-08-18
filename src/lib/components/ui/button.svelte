<script lang="ts">
	import clsx from 'clsx';
	import { type Icon as IconType } from 'lucide-svelte';
	let {
		style = 'primary',
		stack = 'horizontal',
		fullWidth = false,
		shape = 'rect',
		type = 'event',
		size = 'md',
		label = null,
		hiddenLabel = false,
		icon: Icon = null,
		onclick = () => {},
		href = ''
	}: {
		style?: 'primary' | 'secondary' | 'text';
		stack?: 'horizontal' | 'vertical';
		fullWidth?: boolean;
		shape?: 'circle' | 'rect' | 'text';
		type?: 'event' | 'link' | 'submit';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		label?: string | null;
		hiddenLabel?: boolean;
		icon?: typeof IconType | null;
		onclick?: (e: MouseEvent) => void;
		href?: string | null;
	} = $props();

	const styles = clsx('flex border transition-all duration-100 hover:cursor-pointer', {
		'bg-primary text-background border-primary hover:bg-primary/90 justify-center':
			style === 'primary',
		'bg-background text-foreground border-border hover:bg-foreground/10 justify-center':
			style === 'secondary',
		'bg-transparent text-foreground border-transparent pl-0 pr-0': style === 'text',
		'items-center': stack === 'horizontal',
		'flex-col items-center': stack === 'vertical',
		'w-full': fullWidth,
		'rounded-full p-2 aspect-square items-center justify-center': shape === 'circle',
		'rounded-lg px-5 py-2': shape === 'rect',
		'py-1 px-0': shape === 'text',
		'text-xs gap-0': size === 'xs',
		'text-sm gap-1': size === 'sm',
		'text-base gap-2': size === 'md',
		'text-lg gap-2': size === 'lg'
	});
</script>

{#if type === 'event' || type === 'submit'}
	<button type={type === 'submit' ? 'submit' : 'button'} class={styles} {onclick}>
		{#if Icon}
			<div>
				<Icon class="icon" size={size === 'sm' || size === 'xs' ? 18 : size === 'md' ? 18 : 24} />
			</div>
		{/if}
		<div class={[hiddenLabel && 'hidden']}>
			{label}
		</div>
	</button>
{:else if type === 'link'}
	<a class={styles} {href}>
		{#if Icon}
			<div>
				<Icon class="icon" size={size === 'sm' || size === 'xs' ? 18 : size === 'md' ? 18 : 24} />
			</div>
		{/if}
		<div class={[hiddenLabel && 'hidden']}>
			{label}
		</div>
	</a>
{/if}
