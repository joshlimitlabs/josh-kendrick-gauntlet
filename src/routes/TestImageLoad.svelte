<script lang='ts'>
  import { onMount, tick } from "svelte";
  import silverFoil from '$lib/assets/foil/silver_metallic.png';
  let testCanvas = $state<HTMLCanvasElement>();
  let testCtx: CanvasRenderingContext2D | null;
  let bgCanvas = $state<HTMLCanvasElement>();
  let bgCtx: CanvasRenderingContext2D | null;
  let imageFile = $state<File | null>(null);
  let imageFileName = $state('No file chosen');
  let img: HTMLImageElement;
  let underprintImg = new Image();

  onMount(async () => {
    if(testCanvas)
      testCtx = testCanvas.getContext('2d', { willReadFrequently: false });

    if(bgCanvas)
      bgCtx = bgCanvas.getContext('2d', { willReadFrequently: false });
  });

  async function imageProcess() {
    if (!testCanvas || !testCtx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    if (!tempCtx) return;

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // check if the pixel is solid white (#FFFFFF)
      if (r === 255 && g === 255 && b === 255)
        data[i + 3] = 0; // alpha (0-255)
      else
        data[i + 3] = 220; // alpha (0-255)
    }
    
    tempCtx.putImageData(imageData, 0, 0);

    await new Promise<void>((resolve) => {
      const dataURL = tempCanvas.toDataURL();
      img = new Image();
      img.src = dataURL;
      img.onload = () => {
        if (!testCanvas || !testCtx) return;
        testCtx.clearRect(0, 0, testCanvas.width, testCanvas.height);
        testCtx.drawImage(img, 0, 0, testCanvas.width, testCanvas.height);
        resolve();
      };
    });
  }

  async function drawBackground() {
    underprintImg.src = silverFoil;

    await new Promise<void>((resolve) => {
      underprintImg.onload = () => {
        if (!bgCanvas || !bgCtx) return;
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.drawImage(underprintImg, 0, 0, bgCanvas.width, bgCanvas.height);
        resolve();
      };
    });
  }

  function handleImageUpload(e: Event) {
    const target = e.target as HTMLInputElement;
      imageFileName = target.files?.[0]?.name || imageFileName;
    
    if (target.files && target.files[0]) {
    imageFile = target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      img = new Image();
      img.src = e.target?.result as string;
            
      img.onload = () => {
        imageProcess();
        drawBackground();
      };
    };

    reader.readAsDataURL(imageFile);
    }
  }

</script>

<div class="file-input-wrapper">
  <input type="file" onchange={handleImageUpload}
  class="file-input"
  accept="image/*" />
  <button type="button" class="custom-button"
  style="white-space: nowrap;
         margin-bottom: 8px;">
    Select image file
  </button>
</div>

<canvas bind:this={bgCanvas}
  class="canvas-layer bgLayer"
  width={1116}
  height={620}
></canvas>
<canvas bind:this={testCanvas}
  class="canvas-layer testLayer"
  width={1116}
  height={620}
></canvas>

<style>

  .file-input {
    margin: 0px 0px;
    position: absolute;
    top: 0;
    left: 0;
    width: 160px;
    height: 40px;
    opacity: 0;
    cursor: pointer;
  }

  .file-input-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .custom-button {
    padding: 8px 16px;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    font: inherit;
    width: 160px;
    height: 40px;
    cursor: pointer;
  }

  .canvas-layer {
    position: absolute;
  }

  .bgLayer { z-index: 1; }
  .testLayer { z-index: 2; }

</style>