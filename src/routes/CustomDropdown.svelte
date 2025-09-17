<script lang="ts">
  
  let {
    functionLT,
    functionRT, 
    functionBT,
    tooltipToggle,
    handleLayoutChange,
    selectedButtonLayout = $bindable(),
    LT1Toggle = $bindable(),
    RT1Toggle = $bindable(),
    ButtonToggle = $bindable()
  } = $props<{
    functionLT: () => void,
    functionRT: () => void,
    functionBT: (e: Event) => void,
    tooltipToggle: (text: string) => void,
    handleLayoutChange: () => void,
    selectedButtonLayout: string,
    LT1Toggle: boolean,
    RT1Toggle: boolean,
    ButtonToggle: boolean
  }>();

  // Main dropdown state
  let isMainOpen = $state(false);
  
  // Nested dropdown state
  let isNestedOpen = $state(false);

  const ButtonLayouts = ['Full', 'FGC', 'Split FGC', 'Platform Fighter', 'Custom'];

  // Close menus when clicking outside
  function handleClickOutside(e: MouseEvent) {
    if (!e.target) return;
    if (ButtonToggle) return;
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      isMainOpen = false;
      isNestedOpen = false;
    }
  }

  // Add/remove event listener
  $effect(() => {
    if (isMainOpen) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  });
</script>

<!-- <div class="dropdown-container">
  <button class="dropdown-button" onclick={() => isMainOpen = !isMainOpen}>
    Glyph Settings
  </button>

  {#if isMainOpen}
    <div class="dropdown-content"> -->

    <div class="dropdown-item"
    style:color=black
    style:margin-top=4px>
      <select bind:value={selectedButtonLayout}
        onchange={handleLayoutChange}>
        <option value="" disabled selected>Select a layout</option>
        {#each ButtonLayouts as layout}
            <option value={layout}>{layout}</option>
        {/each}
      </select>
    </div>

    <div class="dropdown-item">
      <div class="toggle-container"
      style:margin-left=4px>
        <span>27.5mm Left Thumb</span>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            class="toggle-checkbox"
            bind:checked={LT1Toggle}
            onclick={functionLT}
          >
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <div class="dropdown-item">
      <div class="toggle-container"
      style:margin-top=-8px
      style:margin-left=4px>
        <span>27.5mm Right Thumb</span>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            class="toggle-checkbox"
            bind:checked={RT1Toggle}
            onclick={functionRT}
          >
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <div class="dropdown-item"
    style="display: flex;
    justify-content: center;
    margin-left: -4px;">
      <button class="button-item"
        onclick={functionBT}
        style:background-color={ButtonToggle ? 'red' : '#121212'}
        onmouseenter={() => tooltipToggle("buttontoggle")}
        onmouseleave={() => tooltipToggle("")}>
        Button Toggle
      </button>
    </div>

      <!-- onclick={() => { 
          functionBT();
          ButtonToggle = !ButtonToggle;
        }} -->

    <!-- </div>
  {/if}
</div> -->

<style>

  select {
    padding: 6px;
    font-size: 16px;
    border: 1px solid #303436;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 2px;
    background-color: #121212;
    color: #e8e6e3;
    width: 242px;
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
  }

  .dropdown-container {
    position: relative;
    display: inline-block;
    font-family: sans-serif;
  }

  .dropdown-button {
    background: #4a5568;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
  }

  .dropdown-content {
    position: absolute;
    background: #3a495e;
    min-width: 264px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-radius: 4px;
    z-index: 100;
    padding: 0.5rem;
    color: white;
    font-size: 18px;
  }

  .dropdown-item {
    margin-bottom: 4px;
    margin-left: 1px;
  }

  .button-item {
    padding: 5px 10px;
    border: 1px solid #303436;
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
    margin-top: 2px;
    color: white;
  }

  .button-item:hover {
    border-color: #999;
  }

  .toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #091331;
    transition: .4s;
    border-radius: 24px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .toggle-slider {
    background-color: #4CAF50;
  }

  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }

  .toggle-checkbox {
    opacity: 0;
    width: 0;
    height: 0;
  }

</style>