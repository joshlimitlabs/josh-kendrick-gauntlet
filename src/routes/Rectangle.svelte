<script lang="ts">
	import Buttons from "./Buttons.svelte";
	import { fly, slide } from 'svelte/transition';
	import { editButtonLayout } from '$lib/buttonInfo';

	let rectangle: HTMLElement;
	let rectangleHeight: number;
</script>

<!-- <div id="rectangle"
	class="aspect-[1.849] min-w-[36rem] max-w-[100%] rounded-3xl border border-slate-800 bg-slate-900 shadow shadow-black">
	<div class="relative size-full">
		<div class="absolute size-full" style="">
            <Buttons />
		</div>
	</div>
</div> -->

<div class="h-full max-h-full overflow-hidden p-3 pt-0">
	<div
		id="layout-card"
		class="grid h-full grid-cols-[1fr_auto] gap-2 overflow-visible rounded-lg p-4"
	>
		<div class="overflow-visible">
			<div
				id="rectangle"
				class="aspect-[1.849] min-w-[36rem] max-w-[100%] rounded-3xl border border-slate-800 bg-slate-900 shadow shadow-black"
				bind:this={rectangle}
			>
				<div class=" relative size-full">
					<!-- {#key $hoveredPlate}
						{#if $hoveredPlate !== null || $plateSlamAnimation === true}
							<Plateanimation2 bind:animating rectangleParent={rectangle} />
						{/if}
					{/key}
					{#if $currentProfileName !== null}
						{#if $currentModeType === 'controller'}
							{#key $currentProfileName} -->

								<Buttons />

							<!-- {/key}
						{:else if $currentModeType === 'keyboard'}
							{#key $currentProfileName}
								<Keyboardbuttons />
							{/key}
						{/if}
					{/if} -->
				</div>
			</div>
			<!-- <div id="platform" class="w-full col-span-2"> -->
			<!--     <Platformoptions /> -->
			<!-- </div> -->
		</div>
        <!-- {#if $currentProfileName !== null} -->
            
		<div
			id="rectangle-menu"
			class="flex max-h-full min-w-fit flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 px-2 py-2 pt-0"
		>
            <div class="h-fit w-full py-2 pt-3">
                <div id="modeSwitch" class="grid h-fit w-full border border-slate-800 flex-none gap-1 grid-cols-1 rounded-lg {editButtonLayout.enabled ? "bg-slate-600 p-1" : "bg-slate-950 p-1"}">
                    <button
                        class="w-full rounded-md p-3 font-bold text-slate-200 transition-all 'bg-slate-700'"
						onclick={() => editButtonLayout.enabled = !editButtonLayout.enabled}
                    >
                        Edit button layout
                    </button>
                </div>
            </div>
			<div
				id="scrollable-settings"
				class="min-h-0 w-full shrink grow overflow-y-auto overflow-x-hidden rounded-md border border-slate-800 bg-slate-950 px-2 shadow-inner shadow-black transition-all"
			>
				<div id="spacer" class="h-2"></div>
				<!-- {#key $currentProfileName}
					{#if $currentModeType === 'controller'} -->
						<div class="w-full space-y-2" transition:fly={{ duration: 80, x: -50 }}>
							<!-- <Plateoptions bind:animating />
							<Platformoptions2 />
                            {#if hasModifiers($currentProfile.backends)} 
                                <Modifierdoptions />
                            {/if}
							<Socdoptions />
							<Rgboptions />
							<Presetoptions keyboard={false} /> -->
							<div id="spacer" class="h-1"></div>
						</div>
					<!-- {:else}
						<div class="w-full" transition:fly={{ duration: 80, x: 50 }}>
							<Plateoptions bind:animating />
							<div id="spacer" class="h-2"></div>
							<Keyboardsocd />
							<div id="spacer" class="h-2"></div>
							<Rgboptions />
							<div id="spacer" class="h-2"></div>
							<Presetoptions keyboard={true} />
							<div id="spacer" class="h-1"></div>
						</div> -->
						<!-- <span class="text-slate-200"> [keyboard-specific socd options] </span> -->
						<!-- <Socdoptions /> -->
					<!-- {/if}
				{/key} -->
				<!-- <div class="absolute text-red-400 bottom-0 h-4 w-full bg-slate-800"> -->
				<!--     hhh -->
				<!-- </div> -->
			</div>
		</div>
		<!-- <div id="options" class="flex justify-start gap-4"> -->
		<!-- <Rectangleoptions optType={'Game Type'} initialValue={'Platform Fighter'} /> -->
		<!-- 	<Rectangleoptions optType={'Option'} initialValue={'Option Example'} /> -->
		<!-- </div> -->
        <!-- {/if} -->
	</div>
</div>

<style>
	#scrollable-settings {
		scrollbar-gutter: stable !important;
		transition: --scrollcolor 0.2s;
	}
	::-webkit-scrollbar {
		width: 5px;
	}

	@property --scrollcolor {
		syntax: '<color>';
		inherits: true;
		initial-value: #00000000;
	}

	/* Handle */
	#scrollable-settings::-webkit-scrollbar-thumb {
		background: var(--scrollcolor) !important;
		border-radius: 5px;
	}

	#scrollable-settings:hover {
		border-radius: 5px;
		--scrollcolor: theme(colors.slate.700);
	}
</style>
