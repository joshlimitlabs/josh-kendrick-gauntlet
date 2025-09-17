<script lang="ts">
	import { fade } from 'svelte/transition';
	import { fly, slide } from 'svelte/transition';
	import { editButtonLayout } from '$lib/buttonInfo';
	
</script>

<div class="p-t-6 flex h-full w-56 min-w-36 flex-col justify-between overflow-auto py-4 pl-4 transition-transform">
	<div class="">
		<!-- {#each $userProfileNames as mode, index (index)}
			<div class="relative grid grid-cols-1">
				<button
					class="group grid h-min rounded-l-lg border-r-2 px-4 py-3 text-right transition-all {currentMode ===
					mode
						? 'border-sky-400 bg-sky-950 font-bold text-sky-300'
						: 'border-slate-700 font-normal text-slate-300 hover:border-slate-400'}"
					transition:fade={{ duration: 200 }}
					on:click={() => {
						currentProfileName.set(mode);
					}}
				>
					{#if currentlyRenamingProfile === mode}
						<span
							class="text-right transition-colors {currentMode === mode
								? 'font-bold text-sky-300'
								: 'font-normal text-slate-300'}"
						>
							<div class="relative">
								<Editname profileName={mode} />
							</div>
							{mode}
						</span>
					{:else}
						<span
							class="text-right transition-colors {currentMode === mode
								? 'font-bold text-sky-300'
								: 'font-normal text-slate-300'}"
						>
							{#if currentMode === mode}
								<button
									class="opacity-0 transition-all group-hover:opacity-100"
									on:click={(e) => deleteProfile(e, mode)}
								>
									<span
										class="icon-[material-symbols--disabled-by-default-rounded] text-slate-300 hover:text-slate-400"
									></span>
								</button>
								<button
									class="opacity-0 transition-all group-hover:opacity-100"
									on:click={(e) => handleEditClick(e, mode)}
								>
									<span
										class="icon-[material-symbols--edit-rounded] text-slate-300 hover:text-slate-400"
									></span>
								</button>
							{/if}
							{mode}
						</span>
					{/if}
					<div class="flex w-full flex-row justify-end space-x-1 opacity-70">
						{#each Object.entries(getBackendsFromName(mode)) as backend}
							{#if backend[1] === true}
								<div class={backend[0]}>
									{#key backend[0]}
										<Customicon
											name={getIconPath(backend[0])}
											style={'text-slate-200 fill-slate-200 size-5'}
											alt={backend[0]}
										/>
									{/key}
								</div>
							{/if}
						{/each}
					</div>
				</button>
			</div>
		{/each}
		<Addprofile /> -->
	</div>
	<button
		id="settings-button"
		class="flex aspect-square w-fit place-items-center rounded-full px-3 py-2 transition-all">
		<!-- on:click={handleSettingsIconClick} -->
	
		<span
			class="icon-[material-symbols--settings] size-8 text-slate-300 transition-all hover:text-slate-400 'bg-sky-500'"
		></span>
	</button>
</div>

<!-- <div class="h-full max-h-full overflow-hidden p-3 pt-0">
	<div
		id="layout-card"
		class="grid h-full grid-cols-[1fr_auto] gap-2 overflow-visible rounded-lg p-4"
	>
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
						<div class="w-full space-y-2" transition:fly={{ duration: 80, x: -50 }}>
							<div id="spacer" class="h-1"></div>
						</div>
			</div>
		</div>
	</div>
</div> -->