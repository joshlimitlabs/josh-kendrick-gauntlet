<script lang="ts">
  import gif1 from '$lib/assets/helpgif1.gif';
  import gif2 from '$lib/assets/helpgif2.gif';
  import gif3 from '$lib/assets/helpgif3.gif';
  import gif4 from '$lib/assets/helpgif4.gif';

  const gifs = [
    {
      src: gif1,
      alt: 'Help window 1'
    },
    {
      src: gif2,
      alt: 'Help window 2'
    },
    {
      src: gif3,
      alt: 'Help window 3'
    },
    {
      src: gif4,
      alt: 'Help window 4'
    }
  ];

  let currentIndex = $state(0);

  const nextGif = () => {
    currentIndex = (currentIndex + 1) % gifs.length;
  };

  const prevGif = () => {
    currentIndex = (currentIndex - 1 + gifs.length) % gifs.length;
  };

  const goToGif = (index: number) => {
    currentIndex = index;
  };

  $effect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextGif();
      } else if (event.key === 'ArrowLeft') {
        prevGif();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<div class="text-header">
  {#if currentIndex === 0}
    <h2>Selecting a Product</h2>
    <p>Start by opening the Product + Layout tab and selecting the device you'd like to create custom art for.</p>
    <p>If you're making art for a Glyph you can choose to select from a pre-made layout, or use the Button Toggle to create your very own custom layout.</p>
    <p>If you're using a different device, select the name of the device's associated company and select the specific product name from the dropdown.</p>
  {:else if currentIndex === 1}
    <h2>Adding an Image</h2>
    <p>Open the CMYK Image tab and upload an image with the "Select image file" button.</p>
    <p>You can drag and drop the image to move it, as well as scale and rotate it using the transform dots around the image or the numeric scales in the expanded tab.</p>
    <p>You may also use the alignment buttons to help orient the image, or use the "Best Fit" button to automatically size and center your image.</p>
  {:else if currentIndex === 2}
    <h2>Adding Foil and Holographic Layers</h2>
    <p>Open the Foil + Holographic tab to include any combination of a full metallic underprint layer, a holographic overprint pattern, and a custom spot-foil pattern that you can upload with the "Select foil file" button.</p>
    <p>Select a foil color for the underprint and spot foil layers, as well as a holographic pattern from the dropdowns.</p>
    <p>The uploaded spot foil design can be transformed in the same ways as the image, or you can click the "Match Image" buttons to have your foil transformations be the same as your image.</p>
  {:else if currentIndex === 3}
    <h2>Purchasing Your Design</h2>
    <p>Once your design is complete and your uploaded image fully covers the area of the selected product, the "Purchase Print" button will become enabled in the top right corner of the page.</p>
    <p>Clicking the "Purchase Print" button will prompt you to read and accept our Custom Art Upload Agreement.</p>
    <p>Once accepted, you will be able to generate a link that adds your custom art design directly to your Shopify cart for purchase!</p>
  {/if}
</div>

<div class="gif-carousel" aria-label="Image carousel">

  <div class="carousel-container">
    
    <button
      class="nav-arrow left-arrow"
      onclick={prevGif}
      aria-label="Previous image"
      disabled={gifs.length <= 1}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="gif-container">
      {#each gifs as gif, index}
        <img
          src={gif.src}
          alt={gif.alt}
          class:active={index === currentIndex}
          class="gif-image"
          loading="lazy"
        />
      {/each}
    </div>

    <button
      class="nav-arrow right-arrow"
      onclick={nextGif}
      aria-label="Next image"
      disabled={gifs.length <= 1}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>

  <div class="dots-container" aria-label="Image navigation dots">
    {#each gifs as _, index}
      <button
        class:active={index === currentIndex}
        class="dot"
        onclick={() => goToGif(index)}
        aria-label={`Go to image ${index + 1}`}
        aria-current={index === currentIndex ? 'true' : 'false'}
      >
        <span class="sr-only">Image {index + 1}</span>
      </button>
    {/each}
  </div>
</div>

<style>

  .text-header {
    text-align: left;
    margin-bottom: 1.5rem;
    margin-left: 4rem;
    max-width: 800px;
  }
  
  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #e8e6e3;
    margin-bottom: 1.0rem;
  }
  
  p {
    font-size: 1rem;
    color: #b9bec5;
    margin-bottom: 8px;
    line-height: 1.5;
    font-weight: 400;
  }
  
  .gif-carousel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 100%;
  }

  .carousel-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }

  .gif-container {
    position: relative;
    width: 800px;
    height: 450px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    border: 1px solid #ababab;
  }

  .gif-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .gif-image.active {
    opacity: 1;
  }

  .nav-arrow {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #e5e7eb;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #374151;
  }

  .nav-arrow:hover:not(:disabled) {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  .nav-arrow:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dots-container {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #3b82f6;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dot.active {
    background: #3b82f6;
    transform: scale(1.2);
  }

  .dot:hover:not(.active) {
    background: rgba(59, 130, 246, 0.5);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 800px) {
    .gif-container {
      width: 400px;
      height: 225px;
    }

    .nav-arrow {
      width: 40px;
      height: 40px;
    }
  }
  
</style>