<script lang="ts">
	import { onMount } from 'svelte';

	let elm: HTMLDivElement;

	function isElementInViewport(el: HTMLElement) {
		var rect = el.getBoundingClientRect();

		console.log(rect.top);

		if (rect.top <= 150) {
			return false;
		}

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
			rect.right <=
				(window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
		);
	}

	onMount(() => {
		console.log(isElementInViewport(elm));
		if (!isElementInViewport(elm)) {
			elm?.scrollIntoView({ block: 'start', inline: 'start' });
		}
	});
</script>

<div style:scroll-margin="150px" bind:this={elm}></div>
