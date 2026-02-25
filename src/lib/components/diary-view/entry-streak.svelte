<script lang="ts">
	import clsx from 'clsx';
	import { AlertTriangle, Flame } from 'lucide-svelte';

	let { streak, style = 'past' }: { streak: number; style?: 'at-risk' | 'past' | 'secured' } =
		$props();
</script>

{#if streak > 1}
	<div class={['flex items-center pr-2', style === 'at-risk' && 'opacity-30']}>
		<div class="relative">
			<Flame class={style === 'secured' ? 'fill-foreground' : ''} size={24} />
			{#if style === 'at-risk'}
				<div class="absolute -right-0.5 -bottom-0.5">
					<AlertTriangle class="fill-background" size={16} />
				</div>
			{/if}
		</div>
		<div class={['text-sm', style === 'secured' ? 'font-semibold' : 'font-medium']}>
			{streak}
		</div>
	</div>
{/if}
