<script lang="ts">
    import { onMount } from 'svelte';
    import GauntletPage from './GauntletPage.svelte';

    let error = $state<Error | null>(null);
    let startLatch = $state(false);

    onMount(async () => {
        try {
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
  <GauntletPage />
{/if}

<style lang="postcss">
  
	:global(html) {
		background-color: theme(colors.black);
	}
	:global(*) {
		font-family: 'Courier New', Courier, monospace;
    color: #13c3ff;
		font-weight: 500;
	}

</style>