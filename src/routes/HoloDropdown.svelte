<script lang="ts">
  const HolographicList = ['Stardust', 'Ripple', 'Mosaic', 'Sparkle', 'Crystal', 'Glitter', 'Hyper Plaid', 'Milkyway', 'Star', 'Cracked Ice'];
  
  const holoDescriptions = {
    'Stardust': 'Fine glitter effect resembling cosmic dust',
    'Ripple': 'Wavy, liquid-like shimmer patterns',
    'Mosaic': 'Geometric tile-like reflective surfaces',
    'Sparkle': 'Intense, bright pinpoint reflections',
    'Crystal': 'Clear, prism-like light refraction',
    'Glitter': 'Classic metallic sparkle effect',
    'Hyper Plaid': 'Bold, intersecting line patterns',
    'Milkyway': 'Soft, nebula-like gradient shimmer',
    'Star': 'Distinct star-shaped light bursts',
    'Cracked Ice': 'Fractured, crystalline appearance'
  };

  let selectedHoloPattern = $state(HolographicList[0]);
  let hoveredHolo = $state<string | null>(null);

  function handleHoloChange() {
    // Your existing logic
  }

  function handleHoloMouseOver(e: Event) {
    const target = e.target as HTMLSelectElement;
    if (target && target.selectedIndex >= 0) {
      hoveredHolo = HolographicList[target.selectedIndex];
    }
  }

</script>


<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<select 
  bind:value={selectedHoloPattern}
  onchange={handleHoloChange}
  onmouseover={handleHoloMouseOver}
  onmouseout={() => hoveredHolo = null}
>
  {#each HolographicList as holo}
    <option value={holo}>{holo}</option>
  {/each}
</select>

{#if hoveredHolo}
  <div class="description" style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
    {hoveredHolo}
  </div>
{/if}


<style>
  select {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #303436;
    border-radius: 4px;
    cursor: pointer;
    margin: 8px;
    background-color: #121212;
    color: #e8e6e3;
  }

  .custom-dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-button {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    min-width: 150px;
    text-align: left;
  }

  .dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
  }

  .dropdown-option {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
  }

  .dropdown-option:hover {
    background: #f5f5f5;
  }

  .dropdown-option:last-child {
    border-bottom: none;
  }

  .tooltip {
    position: fixed;
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 1001;
    pointer-events: none;
    max-width: 250px;
    transform: translate(10px, 10px);
  }
</style>