<script lang="ts">
	import Customicon from './customicon.svelte';
	import { fly, fade } from 'svelte/transition';
	
</script>



<div class="flex h-16 items-center gap-12 border-b border-slate-900 bg-slate-800 p-4 shadow shadow-black">
	<div>
		<div class="h-14 p-2 align-middle">
			<Customicon name="LL Logomark Offwhite" style="h-full w-full" alt={'Limit Labs logo'} />
		</div>
	</div>
    <div
        class="grid grid-rows-1 grid-cols-[auto_auto_auto_auto] gap-2 rounded-xl transition-all 'p-0'"
    >
        <!-- {#if glyphDevice == null}
            <button 
                class="highlight flex items-center rounded-lg bg-sky-300 shadow hover:bg-sky-200 transition-all"
                style="height: 2.5rem;"
                on:click={connect}
                in:fade={{ duration:200, delay:40 }}
            >
                <span class="px-4 py-2 font-bold text-slate-800">Connect</span>
            </button>
        {:else}
            <div
                class="flex items-center justify-center"
            >
                <span class="px-2 py-1 pr-0 font-bold text-slate-200">Glyph Connected</span>
            </div>
            <button 
                class="highlight flex items-center rounded-md bg-slate-900 outline-sky-300 shadow hover:bg-slate-800 transition-all text-slate-200 {commsBusy ? 'disabled' : ''}"
                on:click={() => glyphDevice = null}
                in:fade={{ duration:200, delay:40 }}
            >
                <span class="px-4 py-2 font-bold">Disconnect</span>
            </button>
            {#if buttonMessages.getConfig !== ""}
                <div
                    class="highlight flex items-center rounded-md shadow transition-all"
                    style="height: 2.2rem;"
                >
                    <span class="px-4 py-2 font-bold text-slate-200">{buttonMessages.getConfig}</span> 
                </div>
            {:else}
                <button 
                    class="highlight flex px-4 pr-3 items-center rounded-md bg-sky-300 shadow hover:bg-sky-200 transition-all {commsBusy ? 'disabled' : ''}"
                    on:click={getConfig}
                    in:fade={{ duration:200 }}
                >
                    <span class="py-2 font-bold text-slate-800">Load Config</span>
                    <span class="size-6 ml-1 py-2 font-bold text-slate-800 icon-[material-symbols--upload-rounded]"></span>
                </button>
            {/if}

            {#if buttonMessages.setConfig !== ""}
                <div
                    class="highlight flex items-center rounded-md shadow transition-all"
                    style="height: 2.2rem;"
                >
                    <span class="px-4 py-2 font-bold text-slate-200">{buttonMessages.setConfig}</span> 
                </div>
            {:else}
                <button 
                    class="highlight flex px-4 pr-3 items-center rounded-md bg-sky-300 shadow hover:bg-sky-200 transition-all {commsBusy ? 'disabled' : ''}"
                    on:click={setConfig}
                    in:fade={{ duration:200 }}
                >
                    <span class="py-2 font-bold text-slate-800">Save Config</span>
                    <span class="size-6 ml-1 py-2 font-bold text-slate-800 icon-[material-symbols--download-rounded]"></span>
                </button>
            {/if}
        {/if} -->
    </div>
</div>


<div
    class="absolute top-0 right-1 h-16"
>
    <div class="h-16 flex p-1 w-fit items-center">
    <button 
        class="highlight px-3 flex items-center mr-4 rounded-lg bg-sky-300 shadow hover:bg-sky-200 transition-all"
        style="height: 2.5rem;"
        in:fade={{ duration:200, delay:40 }}
    >
        <!-- <span class="py-2 font-bold text-slate-800">Load Defaults</span> JDW -->
        <!-- <span class="size-6 icon-[material-symbols--refresh-rounded]"></span> -->
        <!-- <span class="size-6 icon-[material-symbols--autorenew]"></span> -->
        <span class="size-7 ml-1 text-slate-800 icon-[material-symbols--cached-rounded]"></span>
        <!-- <span class="size-6 icon-[material-symbols--directory-sync-rounded]"></span> -->
    </button>

        <div
            class="grid grid-cols-[auto_auto_auto] p-2 pr-3 rounded-xl w-fit gap-2 items-center bg-slate-700"
        >

            <!-- <span class="px-2 font-bold text-slate-200">User Config File</span> JDW -->
            <button 
                class="highlight px-1 flex items-center rounded-md bg-sky-300 shadow hover:bg-sky-200 transition-all 'disabled'"
                in:fade={{ duration:200 }}
            >
                <!-- <span class="px-4 py-2 font-bold text-slate-800">download</span> -->
                <span class="px-4 py-2 size-6 text-slate-800 icon-[material-symbols--download-2-rounded]"></span>

            </button>

            <!-- <button  -->
            <!--     class="highlight flex items-center rounded-md bg-sky-300 shadow hover:bg-sky-200 transition-all {commsBusy ? 'disabled' : ''}" -->
            <!--     in:fade={{ duration:200 }} -->
            <!-- > -->
            <!--     <span class="px-4 py-2 font-bold text-slate-700">upload</span> -->
            <!-- </button> -->
            <input 
                accept=".json" 
                id="upload" 
                type="file" 
                class="hidden"
            />
            <label
                for="upload"
                class="highlight flex font-bold items-center text-center rounded-md bg-sky-300 shadow hover:bg-sky-200 transition-all 'disabled'"
            >
                <span class="px-5 py-2 size-6 text-slate-800 icon-[material-symbols--upload-2-rounded]"></span>
                <!-- <span  -->
                <!--     class="w-full font-bold text-center text-slate-800" -->
                <!-- > -->
                <!--     upload -->
                <!-- </span> -->
            </label>
        </div>

    </div>
</div>

<!-- prev -->
<!-- <div class="h-min-content flex items-center gap-12 bg-slate-800 p-4 shadow"> -->
<!-- 	<div> -->
<!-- 		<span class="h-16 p-2 align-middle text-slate-200">[LOGO]</span> -->
<!-- 	</div> -->
<!-- 	<button class="highlight flex items-center rounded-md bg-slate-700"> -->
<!-- 		<span class="px-4 py-2 text-slate-100">Connect</span> -->
<!-- 	</button> -->
<!-- </div> -->

<style>
	.highlight {
		box-shadow: inset 0 1px 0 0 #0000000f;
	}

    button, label {
        height: 2.2rem;
        cursor: pointer;
    }

    /* .disabled {
        pointer-events: none;
        opacity: 50%;
    } */
</style>