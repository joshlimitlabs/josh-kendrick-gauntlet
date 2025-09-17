<script lang="ts">
    import { onMount } from 'svelte';
    import CanvasTest from './CanvasTest.svelte';
    import CanvasTestcopy from './CanvasTestcopy.svelte';
    import TestPage from './TestPage.svelte';

    let error = $state<Error | null>(null);
    let startLatch = $state(false);

    onMount(async () => {
        try {
        // Your canvas initialization
        } catch (err) {
        error = err as Error;
        console.error('Canvas error:', err);
        }

        startLatch = true;
    });

</script>

{#if error}
  <div class="error">
    <h1>Something went wrong</h1>
    <p>{error.message}</p>
    <button onclick={() => location.reload()}>Retry</button>
  </div>
{:else if !startLatch}
  {() => startLatch = true}
{:else if startLatch}
   <!-- <CanvasTestcopy /> -->
  <!-- <CanvasTest /> -->
  <TestPage />
{/if}

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.slate.950);
	}
	:global(*) {
		font-family: 'Poppins', sans-serif;
		font-weight: 300;
		font-style: normal;
	}
</style>