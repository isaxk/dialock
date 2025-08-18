<script lang="ts">
	import { focused, ignoreScroll, typing } from '$lib/state.svelte';
	import { onMount, tick } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import autosize from 'svelte-autosize';
	import { updated } from '$app/state';

	let { value = $bindable('') } = $props();

	let textarea: HTMLTextAreaElement;
	let mirror: HTMLDivElement;
	let mirrorCaret: HTMLSpanElement;
	let timeout: number | undefined;
	let keyUpdate: number = 0;

	function syncMirrorStyles() {
		const s = getComputedStyle(textarea);
		[
			'width',
			'font-size',
			'font-family',
			'line-height',
			'padding',
			'border',
			'letter-spacing',
			'white-space',
			'word-wrap'
		].forEach((prop: string) => {
			mirror.style.setProperty(prop, s.getPropertyValue(prop));
		});
	}

	function resizeTextarea() {
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function updateMirrorPosition() {
		const r = textarea.getBoundingClientRect();
		mirror.style.top = `${r.top + window.pageYOffset}px`;
		mirror.style.left = `${r.left + window.pageXOffset}px`;
	}

	let mirrorContent: string = $state(value);

	async function scrollCaretIfNeeded() {
		// find the caret position in the mirror
		if (!mirrorCaret) return;
		const { top } = mirrorCaret.getBoundingClientRect();
		const H = window.innerHeight;

		// safe band
		const safeTop = H * 0.3;
		const safeBottom = H * 0.7;

		// only scroll if caret is above safeTop or below safeBottom
		if (top < safeTop || top > safeBottom) {
			let delta = 0;
			if (top < safeTop) {
				delta = top - H * 0.3;
			}
			if (top > safeBottom) {
				delta = top - H * 0.7;
			}

			ignoreScroll.current = true;
			window.scrollTo({ top: window.pageYOffset + delta, behavior: 'smooth' });
			clearTimeout(timeout);
			timeout = window.setTimeout(() => {
				ignoreScroll.current = false;
			}, 400);
		}
	}

	function update() {
		resizeTextarea();
		updateMirrorPosition();
		if (textarea) {
			const pos = textarea.selectionEnd;
			const mirrorText = value.slice(0, pos);
			mirrorContent = mirrorText;
		} else {
			mirrorContent = '';
		}
		scrollCaretIfNeeded();
	}

	onMount(() => {
		syncMirrorStyles();
		focused.current = false;
		typing.current = false;
		update();
		window.addEventListener('resize', syncMirrorStyles);
		return () => {
			window.removeEventListener('resize', syncMirrorStyles);
			focused.current = false;
			typing.current = false;
		};
	});

	$effect(() => {
		console.log(value);
		keyUpdate++;
		update();
	});
</script>

<div class="p-5">
	<textarea
		bind:this={textarea}
		bind:value
		autofocus
		rows="1"
		placeholder="Start typing…"
		class={[
			'block min-h-20 w-full resize-none rounded font-serif text-base/7 placeholder-gray-400 outline-none'
		]}
		onkeydown={() => {
			keyUpdate++;
			if (focused.current === false) {
				setTimeout(update, 20);
			} else {
				setTimeout(update, 50);
			}
			focused.current = true;
			typing.current = true;
		}}
		onblur={() => {
			setTimeout(() => {
				focused.current = false;
			}, 100);
		}}
		onfocus={() => {
			window.setTimeout(() => {
				if (focused.current) {
					update();
				}
			}, 50);
		}}
		onclick={() => {
			if (focused.current && typing.current) {
				update();
			}
		}}
	></textarea>
</div>
<!-- hidden mirror for measuring caret -->
<div bind:this={mirror} aria-hidden="true" class="mirror">
	{mirrorContent}<span bind:this={mirrorCaret}>&#x200b;</span>
</div>

<style>
	.mirror {
		position: absolute;
		top: 0;
		left: -9999px;
		visibility: hidden;
		white-space: pre-wrap;
		word-wrap: break-word;
		user-select: none;
		pointer-events: none;
		z-index: -1;
	}
</style>
