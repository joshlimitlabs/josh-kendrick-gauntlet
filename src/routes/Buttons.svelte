<script lang="ts">
	import { buttonLocations, editButtonLayout } from '$lib/buttonInfo';

	function toggleEnable(e: Event, index: number) {
        if(editButtonLayout.enabled && !buttonLocations[index].name.includes('MB'))
			buttonLocations[index].enabled = !buttonLocations[index].enabled;
    }
	
</script>



<div id="buttons"
	class="absolute size-full">
	<!-- @ts-ignore -->
	{#each buttonLocations as button, index (index)}
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button id={button.name}
		onclick={(e) => toggleEnable(e, index)}
		class="absolute transition-all z-0 aspect-square {button.height} overflow-visible rounded-full font-bold {button.enabled ? "hover:bg-slate-500 bg-slate-600" : "hover:bg-slate-100"}"
		style="left: {button.left}%; top: {button.top}%; transform: translate(-50%, -50%);
		border-width: 4px;
		border-color: var(--{button.name}-border-color; box-shadow: 0px 0px 3px 2px var(--{button.name}-border-color);
		"
		>
		</button>
	{/each}
</div>