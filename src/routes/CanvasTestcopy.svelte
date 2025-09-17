<script lang='ts'>
  import { rgbaToHex } from '$lib/utils';
	import { type Circle, Circles, CustomLayout, Layouts, Tooltips } from "./objStore";
	import { onMount } from "svelte";
  import { fade } from 'svelte/transition';
  import Customicon from './customicon.svelte';
  import { jsPDF } from 'jspdf';
  import eye_0 from '$lib/assets/eye_0.png';
  import eye_1 from '$lib/assets/eye_1.png';
  import lock_0 from '$lib/assets/lock_0.png';
  import lock_1 from '$lib/assets/lock_1.png';
  import info from '$lib/assets/info.png';
  import close from '$lib/assets/close.png';
  import { updateDeviceInfo } from './CustomDevices';
	
  let rectangleCanvas = $state<HTMLCanvasElement>();
  let imageCanvas = $state<HTMLCanvasElement>();
  let foilCanvas = $state<HTMLCanvasElement>();
  let imageFile = $state<File | null>(null);
  let foilFile = $state<File | undefined>(undefined);
  let foilInput = $state<HTMLInputElement>(); // Bind to the file input element
  let image = $state<HTMLImageElement | null>(null);
  let foil = $state<HTMLImageElement | null>(null);

  let rectanglePreview = $state<HTMLCanvasElement>();
  let imagePreview = $state<HTMLCanvasElement>();
  let foilPreview = $state<HTMLCanvasElement>();
  
  let rectangleCtx: CanvasRenderingContext2D | null;
  let imageCtx: CanvasRenderingContext2D | null;
  let foilCtx: CanvasRenderingContext2D | null;

  const dpiScale = 11.81;
	const OuterRectangleWidth = 364.5;
  const OuterRectangleHeight = 196.5;
	const canvasScale = 3;
  const lineColor = "#7f849c";

  let foilUnprocessed: HTMLImageElement | null = null;
  const canvasPadding = 6; //Canvas padding is 6px
  const origin = 0; //Image loads in at (0,0)
	let imageX = origin;
	let imageY = origin;
  let imageXdisplay = $state(0);
  let imageYdisplay = $state(0);
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;
  let buttonHover = "";

  let foilX = origin;
	let foilY = origin;
  let foilOffsetX = 0;
	let foilOffsetY = 0;
  let foilXdisplay = $state(0);
  let foilYdisplay = $state(0);

  let ButtonToggle = $state(false);
  let LT1Toggle = $state(false);
  let RT1Toggle = $state(false);
  let oldCircles = $state($Circles);
  let activeWindow = $state(1);
  let imageUploaded = $state(false);
  let foilUploaded = $state(false);
  let foilUnprocessedWidth = 0;
  let foilUnprocessedHeight = 0;

  // Scaling state
  let imageScale = $state(1); // Initial scale factor
  const minImageScale = 0.1; // Minimum scale factor
  const maxImageScale = 10; // Maximum scale factor

  // Rotation state
  let rotation = $state(0); // Initial rotation angle in radians
  const minRotation = -180; // Minimum rotation angle
  const maxRotation = 180; // Maximum rotation angle

  let foilScale = $state(1); // Initial scale factor
  let foilRotation = $state(0); // Initial rotation angle in radians

  // Foil color settings
  let foilR = $state(128);  // R (0-255)
  let foilG = $state(0);    // G
  let foilB = $state(128);  // B
  let foilAlpha = 0.7; // Alpha (0-1)

  // Reactive variable to store the selected option
  let selectedButtonLayout: string = $state('');
  let selectedDevice: string = $state('');
  const deviceBox1Contents = ['Glyph', 'Agetec', 'Arcade Shock', 'ASI LVL', 'BNB', 'Brook', 'Buttercade', 'DuelPad', 'Etokki', 'GuileKeys', 'Hit Box',
  'Qanba',
  'Overdrive Arcade', 'PDP', 'PowerA', 'SEGA', 'Universal Arcade Stick Panel' ];
  // const deviceBox1Contents = ['Glyph', 'Agetec', 'Arcade Shock', 'ASI LVL', 'BNB', 'Brook', 'Buttercade', 'DuelPad', 'Etokki', 'GuileKeys', 'Haute42', 'Hit Box', 'Hori',
  // 'Jonyfraze Espada, 4TW', 'Junkfood Custom Arcades', 'Mad Catz', 'MakeStick', 'Mavercade', 'Mayflash, Venom', 'MixBox', 'Nacon', 'Punk Workshop', 'Qanba', 'Razer',
  // 'TR Fightsticks', 'Overdrive Arcade', 'PDP', 'PowerA', 'SEGA', 'Universal Arcade Stick Panel' ];

  // Array of dropdown options
  const ButtonLayouts = ['Full', 'FGC', 'Split FGC', 'Platform Fighter', 'Custom'];
  const FoilColors = ['Purple', 'Blue', 'Silver'];
  let colorHex = $state("#800080b3");

  let selectedFoilColor: string = $state(FoilColors[0]);
  let fullFoilEnabled = $state(false);

  let SmoothingOptions = ['Smoothing', 'No Smoothing'];
  let selectedSmoothingOption: string = $state(SmoothingOptions[0]);
  let imageSmoothing = $state(true);

  let visibleLayers = $state([true, true, true]);
  let visibleColors = $state(['red', 'red', 'red']);
  let lockedLayers = $state([false, false, false]);

  let imageTransparency = $state(true);
  let errorWindow = $state(false);
  let errorMessage = $state("");
  let disclaimerWindow = $state(false);

  let imageButtonText = $state('Select File');
  let imageFileName = $state('No file chosen');

  let foilButtonText = $state('Select File');
  let foilFileName = $state('No file chosen');
  let foilLocation = $state("below");

  let isExporting = $state(false);
  let exportButtonText = $state("Export to PDF/CSV");
  
  let tooltip = $state("");
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let tooltipMessage = $state("");

  let deviceDrawn = $state(false);
  const tempCanvas = document.createElement('canvas');
  const maskCanvas = document.createElement('canvas');
  let maskDataCache: ImageData | null = null;
  let lastMaskPath = '';

  let deviceFullWidth = $state(0);
  let deviceFullHeight = $state(0);
  let deviceMaskImg = $state<HTMLImageElement>(new Image());
  let deviceScaledImg = $state<HTMLImageElement>(new Image());
  let deviceFullImg = $state<HTMLImageElement>(new Image());
  
  let deviceBox2 = $state(false);
  let deviceBox3 = $state(false);
  let deviceBox2Contents: string[] = $state([]);
  let deviceBox3Contents: string[] = $state([]);
  let deviceBox1Select: string = $state('');
  let deviceBox2Select: string = $state('');
  let deviceBox3Select: string = $state('');
  let deviceBox2Default: string = $state('');
  let deviceBox3Default: string = $state('');

  const canvasPageWidth = (OuterRectangleWidth+2*canvasPadding)*canvasScale;
  const canvasPageHeight = (OuterRectangleHeight+2*canvasPadding)*canvasScale;
  let boxCoords = $state([0, 0, 0, 0]);
  let imageScreenWidth = $state(0);
  let imageScreenHeight = $state(0);
  let foilScreenWidth = $state(0);
  let foilScreenHeight = $state(0);

  onMount(() => {
    rotation = Math.round(rotation * 100) / 100; // Update the rotation angle, round to 2 decimal places
    foilRotation = Math.round(foilRotation * 100) / 100; // Update the rotation angle, round to 2 decimal places

    if(rectangleCanvas)
      rectangleCtx = rectangleCanvas.getContext('2d');
    if(imageCanvas)
      imageCtx = imageCanvas.getContext('2d');
    if(foilCanvas)
      foilCtx = foilCanvas.getContext('2d');
		
    (function loop() {
      canvasRedraw(1, 0.5, lineColor, false);
		})();
	})

  function canvasRedraw(drawScale: number, drawWidth: number, drawColor: string, exporting: boolean){

    if(visibleLayers[1]) // Image layer
    {
      drawImage(drawScale*(canvasScale/dpiScale), exporting);
      imageTransparency = hasTransparency();

      if (exporting && imageCtx && imageCanvas)
      {
        const dpiPixels = 75;

        if (selectedDevice == "Glyph")
        {
          const exportTranslateX = 546;
          const exportTranslateY = 638;

          // Save the original content inside the rectangle
          const imageData = imageCtx.getImageData(exportTranslateX - dpiPixels, exportTranslateY - dpiPixels, 
          imageCanvas.width - 2*exportTranslateX + 2*dpiPixels, imageCanvas.height - 2*exportTranslateY + 2*dpiPixels);

          // Clear the entire canvas
          imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

          // Restore the content inside the rectangle
          imageCtx.putImageData(imageData, exportTranslateX - dpiPixels, exportTranslateY - dpiPixels);
        }
        else if (selectedDevice != '')
        {
          const exportTranslateX = (imageCanvas.width - (deviceFullWidth + 2*dpiPixels))/2;
          const exportTranslateY = (imageCanvas.height - (deviceFullHeight + 2*dpiPixels))/2;

          const imageData = imageCtx.getImageData(exportTranslateX, exportTranslateY, deviceFullWidth + 2*dpiPixels, deviceFullHeight + 2*dpiPixels);

          // Clear the entire canvas
          imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

          // Restore the content inside the rectangle
          imageCtx.putImageData(imageData, exportTranslateX, exportTranslateY);
        }
      }
      else if (!exporting)
      {
        updatePreviews(1);

        if(visibleLayers[0] && selectedDevice != '')
        {
          if(selectedDevice == "Glyph")
            clearRectangleArea("image", canvasScale);
          else
            clearDeviceArea("image");
        }
      }
    }
    else
    {
      if(!imageCanvas) return;
      if(!imageCtx) return;
      imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    }

    if(visibleLayers[2])
    {
      fillCanvas();

      if (!fullFoilEnabled)
        drawFoil(drawScale*(canvasScale/dpiScale), exporting);

      if (exporting && foilCtx && foilCanvas)
      {
        const dpiPixels = 75;

        if (selectedDevice == "Glyph")
        {
          const exportTranslateX = 546;
          const exportTranslateY = 638;

          // Save the original content inside the rectangle
          const imageData = foilCtx.getImageData(exportTranslateX - dpiPixels, exportTranslateY - dpiPixels, 
          foilCanvas.width - 2*exportTranslateX + 2*dpiPixels, foilCanvas.height - 2*exportTranslateY + 2*dpiPixels);

          // Clear the entire canvas
          foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);

          // Restore the content inside the rectangle
          foilCtx.putImageData(imageData, exportTranslateX - dpiPixels, exportTranslateY - dpiPixels);
        }
        else if (selectedDevice != '')
        {
          const exportTranslateX = (foilCanvas.width - (deviceFullWidth + 2*dpiPixels))/2;
          const exportTranslateY = (foilCanvas.height - (deviceFullHeight + 2*dpiPixels))/2;

          const imageData = foilCtx.getImageData(exportTranslateX, exportTranslateY, deviceFullWidth + 2*dpiPixels, deviceFullHeight + 2*dpiPixels);

          // Clear the entire canvas
          foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);

          // Restore the content inside the rectangle
          foilCtx.putImageData(imageData, exportTranslateX, exportTranslateY);
        }
      }
      else if (!exporting)
      {
        updatePreviews(2);

        if(visibleLayers[0] && selectedDevice != '')
        {
          if(selectedDevice == "Glyph")
            clearRectangleArea("foil", canvasScale);
          else
            clearDeviceArea("foil");
        }
      }
    }
    else
    {
      if(!foilCanvas) return;
      if(!foilCtx) return;
      foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);
    }

    if(visibleLayers[0])
    {
      if (selectedDevice == "Glyph")
      {
        drawRectangle(drawScale, 1.5, lineColor, false);
        updatePreviews(0);
        drawRectangle(drawScale, drawWidth, drawColor, exporting);
      }
      else
      {
        drawImportedLayout(exporting);
        updatePreviews(0);
      }
    }
    
    if(!exporting && (!visibleLayers[0] || selectedDevice == ''))
    {
      deviceDrawn = false;

      if(!rectangleCanvas) return;
      if(!rectangleCtx) return;
      rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height);

      //Draw rectangle border instead of glyph layout
      rectangleCtx.save();
      rectangleCtx.lineWidth = 2;
      rectangleCtx.strokeStyle = "#303436";
      rectangleCtx.beginPath();
      if (selectedDevice == '' || selectedDevice == "Glyph")
        rectangleCtx.rect(1, 1, rectangleCanvas.width - 2, rectangleCanvas.height - 2);
      else
      {
        let pageBleedScale = deviceFullWidth/1095 >= deviceFullHeight/591 ? deviceFullWidth/1095 : deviceFullHeight/591;
        let pageBleedWidth = (deviceFullWidth+136)/pageBleedScale; //136 instead of 150 to account for rounding error in multiplication
        let pageBleedHeight = (deviceFullHeight+136)/pageBleedScale;
        rectangleCtx.rect(deviceFullWidth/1095 >= deviceFullHeight/591 ? 1 : (rectangleCanvas.width - pageBleedWidth)/2,
                          deviceFullWidth/1095 >= deviceFullHeight/591 ? (rectangleCanvas.height - pageBleedHeight)/2 : 1,
                          deviceFullWidth/1095 >= deviceFullHeight/591 ? rectangleCanvas.width - 2 : pageBleedWidth,
                          deviceFullWidth/1095 >= deviceFullHeight/591 ? pageBleedHeight : rectangleCanvas.height - 2);
        
        if(!imageCtx) return;
        imageCtx.save();
        imageCtx.globalCompositeOperation = 'destination-in';
        imageCtx.beginPath();
        imageCtx.rect(deviceFullWidth/1095 >= deviceFullHeight/591 ? 0 : (rectangleCanvas.width - pageBleedWidth)/2,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? (rectangleCanvas.height - pageBleedHeight)/2 : 0,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? rectangleCanvas.width : pageBleedWidth,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? pageBleedHeight : rectangleCanvas.height);
        imageCtx.closePath();
        imageCtx.fill();
        imageCtx.restore();

        if(!foilCtx) return;
        foilCtx.save();
        foilCtx.globalCompositeOperation = 'destination-in';
        foilCtx.beginPath();
        foilCtx.rect(deviceFullWidth/1095 >= deviceFullHeight/591 ? 0 : (rectangleCanvas.width - pageBleedWidth)/2,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? (rectangleCanvas.height - pageBleedHeight)/2 : 0,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? rectangleCanvas.width : pageBleedWidth,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? pageBleedHeight : rectangleCanvas.height);
        foilCtx.closePath();
        foilCtx.fill();
        foilCtx.restore();
      }
      rectangleCtx.closePath();
      rectangleCtx.stroke();
      rectangleCtx.restore();
    }

  }

  function drawRectangle(drawScale: number, drawWidth: number, drawColor: string, exporting: boolean)
  {
    if(!rectangleCanvas) return;
    if(!rectangleCtx) return;

    drawScale = drawScale * canvasScale;

    rectangleCtx.save();
    rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height);

    if (exporting)
      rectangleCtx.translate((5400 - drawScale*(OuterRectangleWidth + 2*canvasPadding))/2, 
                             (3600 - drawScale*(OuterRectangleHeight + 2*canvasPadding))/2);

    rectangleCtx.scale(drawScale, drawScale);
    rectangleCtx.translate(canvasPadding, canvasPadding);

    rectangleCtx.lineWidth = drawWidth;
    rectangleCtx.strokeStyle = drawColor;
    rectangleCtx.lineCap = "round";
    
    // Clear area outside of the rectangle
    rectangleCtx.save();
    rectangleCtx.globalCompositeOperation = 'destination-in';
    drawRoundedRect(rectangleCtx, 0, 0, OuterRectangleWidth, OuterRectangleHeight, 10.25);
    rectangleCtx.fill();
    rectangleCtx.restore();

    // Draw the rectangle
    rectangleCtx.save();
    drawRoundedRect(rectangleCtx, 0, 0, OuterRectangleWidth, OuterRectangleHeight, 10.25);
    rectangleCtx.stroke();
    rectangleCtx.restore();

    // Draw the buttons
    drawButtons(drawWidth, drawColor);
  }

  function clearRectangleArea(layer: string, drawScale: number)
  {
    if(imageCanvas && imageCtx && layer == "image")
    {
      // Clear area outside of the rectangle
      imageCtx.save();
      imageCtx.scale(drawScale, drawScale);
      imageCtx.translate(canvasPadding, canvasPadding);
      imageCtx.globalCompositeOperation = 'destination-in';
      drawRoundedRect(imageCtx, 0, 0, OuterRectangleWidth + 0, OuterRectangleHeight + 0, 10.25);
      imageCtx.fill();
      imageCtx.restore();

      // Clear the screen rectangle
      imageCtx.save();
      imageCtx.scale(drawScale, drawScale);
      imageCtx.translate(canvasPadding, canvasPadding);
      drawRoundedRect(imageCtx, 110.962, 3.557, 24.276, 13.386, 1.485);
      imageCtx.clip();
      imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); // Clear everything inside the screen rectangle
      imageCtx.restore();

      // Clear circles
      imageCtx.save();
      imageCtx.scale(drawScale, drawScale);
      imageCtx.translate(canvasPadding, canvasPadding);
      
      for(let i = 0; i < $Circles.length; i++) {
          let cir = $Circles[i];

          imageCtx.beginPath();
          imageCtx.save(); // Save the current context state
          imageCtx.beginPath();

          if(cir.enabled) 
            imageCtx.arc(cir.cx, cir.cy, cir.r, 0, 2 * Math.PI);
          
          imageCtx.clip(); // Set the circle as the clipping region
          imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); // Clear the clipped area
          imageCtx.restore(); // Restore the context state
          imageCtx.closePath();
      }

      imageCtx.restore();
    }
    else if(foilCanvas && foilCtx && layer == "foil")
    {
      // Clear area outside of the rectangle
      foilCtx.save();
      foilCtx.scale(drawScale, drawScale);
      foilCtx.translate(canvasPadding, canvasPadding);
      foilCtx.globalCompositeOperation = 'destination-in';
      drawRoundedRect(foilCtx, 0, 0, OuterRectangleWidth + 0, OuterRectangleHeight + 0, 10.25);
      foilCtx.fill();
      foilCtx.restore();

      // Clear the screen rectangle
      foilCtx.save();
      foilCtx.scale(drawScale, drawScale);
      foilCtx.translate(canvasPadding, canvasPadding);
      drawRoundedRect(foilCtx, 110.962, 3.557, 24.276, 13.386, 1.485);
      foilCtx.clip();
      foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height); // Clear everything inside the screen rectangle
      foilCtx.restore();

      // Clear circles
      foilCtx.save();
      foilCtx.scale(drawScale, drawScale);
      foilCtx.translate(canvasPadding, canvasPadding);

      for(let i = 0; i < $Circles.length; i++) {
          let cir = $Circles[i];

          foilCtx.beginPath();
          foilCtx.save(); // Save the current context state
          foilCtx.beginPath();

          if(cir.enabled) 
            foilCtx.arc(cir.cx, cir.cy, cir.r, 0, 2 * Math.PI);
          
          foilCtx.clip(); // Set the circle as the clipping region
          foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height); // Clear the clipped area
          foilCtx.restore(); // Restore the context state
          foilCtx.closePath();
      }

      foilCtx.restore();
    }
  }

  async function clearDeviceArea(layer: string)
  {
    if(imageCanvas && imageCtx && layer == "image")
      await applyPixelMask(imageCtx, deviceMaskImg.src);
    else if(foilCanvas && foilCtx && layer == "foil")
      await applyPixelMask(foilCtx, deviceMaskImg.src);
  }

  async function applyPixelMask(ctx: CanvasRenderingContext2D, maskImagePath: string, threshold = 128)
  {
    // Cache mask data if same mask is reused
    if (maskImagePath !== lastMaskPath)
    {
      const maskImg = new Image();

      await new Promise<void>((resolve, reject) => {
        maskImg.onload = () => resolve();
        maskImg.onerror = () => reject(new Error('Image failed to load'));
        maskImg.src = maskImagePath;
      });
      
      maskCanvas.width = maskImg.width;
      maskCanvas.height = maskImg.height;
      const maskCtx = maskCanvas.getContext('2d')!;
      maskCtx.drawImage(maskImg, 0, 0);
      maskDataCache = maskCtx.getImageData(0, 0, maskImg.width, maskImg.height);
      lastMaskPath = maskImagePath;
      processMask(ctx, maskDataCache, threshold);
    }
    else
    {
      processMask(ctx, maskDataCache!, threshold);
    }

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const maskWidth = deviceMaskImg.width;
    const maskHeight = deviceMaskImg.height;
    const x = (ctx.canvas.width - maskWidth) / 2;
    const y = (ctx.canvas.height - maskHeight) / 2;

    // Clear everything outside the mask area
    ctx.save();
    ctx.beginPath();
    // Clear left of mask
    ctx.rect(0, 0, x, canvasHeight);
    // Clear right of mask
    ctx.rect(x + maskWidth, 0, canvasWidth - (x + maskWidth), canvasHeight);
    // Clear above mask
    ctx.rect(x, 0, maskWidth, y);
    // Clear below mask
    ctx.rect(x, y + maskHeight, maskWidth, canvasHeight - (y + maskHeight));
    ctx.clip();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
}

async function processMask(ctx: CanvasRenderingContext2D, maskData: ImageData, threshold: number)
{
    requestAnimationFrame(() => {
      const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
      const maskWidth = maskData.width;
      const maskHeight = maskData.height;
      const x = (canvasWidth - maskWidth) / 2;
      const y = (canvasHeight - maskHeight) / 2;

      // 1. Set up temp canvas
      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;
      const tempCtx = tempCanvas.getContext('2d')!;
      
      // 2. Draw current content (using putImageData is faster than drawImage)
      const originalData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      tempCtx.putImageData(originalData, 0, 0);
      
      // 3. Process only the mask area
      const contentData = tempCtx.getImageData(x, y, maskWidth, maskHeight);
      const contentPixels = contentData.data;
      const maskPixels = maskData.data;
      
      // Use Uint32Array for 4x faster pixel processing
      const contentU32 = new Uint32Array(contentPixels.buffer);
      const maskU32 = new Uint32Array(maskPixels.buffer);
      
      for (let i = 0; i < maskU32.length; i++) {
        // Check mask's red channel (assuming grayscale)
        if ((maskPixels[i * 4] < threshold)) {
          contentPixels[i * 4 + 3] = 0; // Set alpha to 0
        }
      }
      
      // 4. Apply back to temp canvas
      tempCtx.putImageData(contentData, x, y);
      
      // 5. Clear and draw to main canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(tempCanvas, 0, 0);
    });
}

  function drawButtons(drawWidth: number, drawColor: string)
  {
    if(!rectangleCanvas) return;
    if(!rectangleCtx) return;

    // Draw the screen rectangle
    rectangleCtx.save();
    rectangleCtx.lineWidth = drawWidth*2;
    drawRoundedRect(rectangleCtx, 110.962, 3.557, 24.276, 13.386, 1.485);
    rectangleCtx.clip();
    rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height); // Clear everything inside the screen rectangle
    rectangleCtx.stroke();
    rectangleCtx.restore();

    // Draw circles
    rectangleCtx.lineWidth = drawWidth; //Circle width
    rectangleCtx.strokeStyle = drawColor;

    for(let i = 0; i < $Circles.length; i++) {
        let cir = $Circles[i];
        rectangleCtx.beginPath();
        drawCircle(cir, rectangleCtx, rectangleCanvas);
        rectangleCtx.closePath();
        rectangleCtx.stroke();
    }
    rectangleCtx.restore();
  }

	function drawCircle(circle: Circle, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {

		context.save(); // Save the current context state
		context.beginPath();
    
    if(ButtonToggle || circle.enabled) 
		  context.arc(circle.cx, circle.cy, circle.r, 0, 2 * Math.PI);
    
		context.clip(); // Set the circle as the clipping region
    
    if (ButtonToggle && !circle.name.startsWith("MB"))
    {
      if (circle.name == buttonHover)
        context.fillStyle = circle.enabled ? "#e7e7e7" : "#171717";
      else
        context.fillStyle = circle.enabled ? "white" : "black";

      context.fill();
    }
    else
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the clipped area
    
		context.restore(); // Restore the context state
    }

    function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
    ) {
    ctx.beginPath();
    // Top-left corner
    ctx.moveTo(x + radius, y);
    // Top edge
    ctx.lineTo(x + width - radius, y);
    // Top-right corner
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    // Right edge
    ctx.lineTo(x + width, y + height - radius);
    // Bottom-right corner
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    // Bottom edge
    ctx.lineTo(x + radius, y + height);
    // Bottom-left corner
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    // Left edge
    ctx.lineTo(x, y + radius);
    // Top-left corner
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  // Check if a point is inside a circle
  function isPointInCircle(x: number, y: number, circle: Circle): boolean {
    if (activeWindow == 1 && (lockedLayers[0] || !visibleLayers[0])) return false;
    // Calculate the scaled width and height
    const scaledWidth = circle.r * canvasScale;
    const scaledHeight = circle.r * canvasScale;

    const circleOffsetX =  canvasPadding + (circle.r - scaledWidth) / 2;
    const circleOffsetY =  canvasPadding + (circle.r - scaledHeight) / 2;

    const circleLeft = canvasScale*(circle.cx + circleOffsetX);
    const circleRight = circleLeft + 2*circle.r*canvasScale;
    const circleTop = canvasScale*(circle.cy + circleOffsetY);
    const circleBottom = circleTop + 2*circle.r*canvasScale;

    const dx = (circleLeft + circleRight) / 2;
    const dy = (circleTop + circleBottom) / 2;

    return ((x - dx) * (x - dx) + (y - dy) * (y - dy) <= canvasScale*circle.r * canvasScale*circle.r);
  }

  async function drawImportedLayout(exporting: boolean)
  {
    if(!rectangleCanvas) return;
    if(!rectangleCtx) return;

    if (!deviceDrawn)
    {
      const img = new Image();
      img.src = deviceScaledImg.src;

      img.onload = () => {
      
        if (rectangleCanvas && rectangleCtx)
        {
          rectangleCtx.save();

          rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height);

          if (exporting)
          {
            rectangleCtx.drawImage(img, 0, 0);
          }
          else
          {
            const x = (rectangleCanvas.width - img.width) / 2;
            const y = (rectangleCanvas.height - img.height) / 2;
            rectangleCtx.drawImage(img, x, y);
          }

          rectangleCtx.restore();
          deviceDrawn = true;
        }
      };
    }
  }

	// Handle file upload
	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
    imageFileName = target.files?.[0]?.name || imageFileName;
    
		if (target.files && target.files[0]) {
		imageFile = target.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			image = new Image();
			image.src = e.target?.result as string;

			// Once the image is loaded, draw it on the canvas
			image.onload = () => {
        imageUploaded = true;
        imageX = Math.ceil(boxCoords[0]*(dpiScale/canvasScale));
        imageY = Math.ceil(boxCoords[1]*(dpiScale/canvasScale));
        imageXdisplay = imageX - origin;
        imageYdisplay = imageY - origin;
				canvasRedraw(1, 0.5, lineColor, false);
			};
		};

		reader.readAsDataURL(imageFile); // Read the file as a data URL
		}
	}

  // Handle file upload for foil
	async function handleFoilUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    foilFileName = target.files?.[0]?.name || foilFileName;

    foilFile = (e.target as HTMLInputElement).files?.[0];
    if (!foilFile) return;
    
    foilUnprocessed = await loadFoil(foilFile);
    processFoil(foilCtx, foilCanvas);
  }

  function processFoil(ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | undefined) {
    if (!foilUnprocessed) return;
    
    foilUnprocessedWidth = foilUnprocessed.width;
    foilUnprocessedHeight = foilUnprocessed.height;
    
    if (!canvas || !ctx) return;

    // Draw the image onto the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(foilUnprocessed, 0, 0);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, foilUnprocessed.width, foilUnprocessed.height);
    const data = imageData.data;

    // Iterate through the pixel data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; // Red channel
      const g = data[i + 1]; // Green channel
      const b = data[i + 2]; // Blue channel

      // Check if the pixel is solid black (#000000)
      if (r === 0 && g === 0 && b === 0) {
        // Replace black with transparent purple
        data[i] = foilR;     // R
        data[i + 1] = foilG; // G
        data[i + 2] = foilB; // B
        data[i + 3] = foilAlpha * 255; // Alpha (0-255)
      } else {
        // Make the pixel fully transparent
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas content to a data URL and create a new HTMLImageElement
    const dataURL = canvas.toDataURL();
    foil = new Image();
    foil.src = dataURL;

    // Once the image is loaded, draw it on the canvas
    foil.onload = () => {
      foilUploaded = true;
      foilX = Math.ceil(boxCoords[0]*(dpiScale/canvasScale));
      foilY = Math.ceil(boxCoords[1]*(dpiScale/canvasScale));
      foilXdisplay = foilX - origin;
      foilYdisplay = foilY - origin;
      canvasRedraw(1, 0.5, lineColor, false);
    };
	}

  function loadFoil(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => resolve(img);
    });
  }

  // Draw the image on the canvas
	function drawImage(drawScale: number, exporting: boolean) {
		if (!imageCanvas) return;
		if (!imageCtx) return;
    if (!image) return;

    imageCtx.imageSmoothingEnabled = imageSmoothing;
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height); // Clear the canvas
    imageCtx.save(); // Save the current context state

    let deviceScale = 1;
    
    if (exporting)
    {
      deviceScale = deviceFullWidth/1095 >= deviceFullHeight/591 ? deviceFullWidth/4308 : deviceFullHeight/2324;
      imageCtx.translate((5400 - dpiScale*deviceScale*(OuterRectangleWidth + 2*canvasPadding))/2, 
                        (3600 - dpiScale*deviceScale*(OuterRectangleHeight + 2*canvasPadding))/2);
    }

    // imageCtx.scale(deviceScale*drawScale, deviceScale*drawScale); //scale and rotate from center

    // // Adjust the image position so it scales from the center
    // const offsetX = image.width * (1 - imageScale) / 2;
    // const offsetY = image.height * (1 - imageScale) / 2;

    // // Apply translation and scaling
    // imageCtx.translate(imageX + offsetX, imageY + offsetY);
    // imageCtx.scale(imageScale, imageScale);

    // // Apply rotation
    // let radians = (rotation * Math.PI) / 180;
    // imageCtx.translate(image.width/2, image.height/2);
    // imageCtx.rotate(radians);

    // // Draw the image centered at the origin
    // imageCtx.drawImage(image, -image.width/2, -image.height/2);

    // // Restore the context state
    // imageCtx.restore();

    imageCtx.scale(deviceScale*drawScale, deviceScale*drawScale);

    // Apply translation and scaling
    imageCtx.translate(imageX, imageY);
    imageCtx.scale(imageScale, imageScale);

    // Apply rotation
    imageCtx.translate(image.width/2, image.height/2);
    let radians = (rotation * Math.PI) / 180;
    imageCtx.rotate(radians);

    // Draw the image centered at the origin
    imageCtx.drawImage(image, -image.width/2, -image.height/2);

    // Restore the context state
    imageCtx.restore();

    imageScreenWidth = Math.round(image.width * (imageScale*canvasScale/dpiScale));
    imageScreenHeight = Math.round(image.height * (imageScale*canvasScale/dpiScale));
	}

	// Draw the foil on the canvas
	function drawFoil(drawScale: number, exporting: boolean) {
    if (!foilCanvas) return;
    if (!foilCtx) return;
    if (!foil) return;

    foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height); // Clear the canvas
    foilCtx.save(); // Save the current context state
    
    let deviceScale = 1;

    if (exporting)
    {
      deviceScale = deviceFullWidth/1095 >= deviceFullHeight/591 ? deviceFullWidth/4308 : deviceFullHeight/2324;
      foilCtx.translate((5400 - dpiScale*deviceScale*(OuterRectangleWidth + 2*canvasPadding))/2, 
                        (3600 - dpiScale*deviceScale*(OuterRectangleHeight + 2*canvasPadding))/2);
    }

    // foilCtx.scale(deviceScale*drawScale, deviceScale*drawScale); //scale and rotate from center

    // // Adjust the image position so it scales from the center
    // const offsetX = foilUnprocessedWidth * (1 - foilScale) / 2;
    // const offsetY = foilUnprocessedHeight * (1 - foilScale) / 2;

    // // Apply translation and scaling
    // foilCtx.imageSmoothingEnabled = false;
    // foilCtx.translate(foilX + offsetX, foilY + offsetY);
    // foilCtx.scale(foilScale, foilScale);
    
    // // Apply rotation
    // let radians = (foilRotation * Math.PI) / 180;
    // foilCtx.translate(foilUnprocessedWidth/2, foilUnprocessedHeight/2);
    // foilCtx.rotate(radians);

    // // Draw the image centered at the origin
    // foilCtx.drawImage(foil, -foilUnprocessedWidth/2, -foilUnprocessedHeight/2);
    
    foilCtx.scale(deviceScale*drawScale, deviceScale*drawScale);

    // Apply translation and scaling
    foilCtx.imageSmoothingEnabled = false;
    foilCtx.translate(foilX, foilY);
    foilCtx.scale(foilScale, foilScale);
    
    // Apply rotation
    foilCtx.translate(foilUnprocessedWidth/2, foilUnprocessedHeight/2);
    let radians = (foilRotation * Math.PI) / 180;
    foilCtx.rotate(radians);

    // Draw the image centered at the origin
    foilCtx.drawImage(foil, -foilUnprocessedWidth/2, -foilUnprocessedHeight/2);

    // Restore the context state
    foilCtx.restore();

    foilScreenWidth = Math.round(foilUnprocessedWidth * (foilScale*canvasScale/dpiScale));
    foilScreenHeight = Math.round(foilUnprocessedHeight * (foilScale*canvasScale/dpiScale));
	}

	// Handle mouse down event
	function handleMouseDown(e: MouseEvent) {
  if (activeWindow == 2 && (lockedLayers[1] || !visibleLayers[1])) return;
  if (activeWindow == 3 && (lockedLayers[2] || !visibleLayers[2])) return;

  let canvas = rectangleCanvas;
	if(!canvas) return;
  
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (image && activeWindow === 2)
    {
      offsetX = mouseX - imageX/(dpiScale/canvasScale);
      offsetY = mouseY - imageY/(dpiScale/canvasScale);
      isDragging = true;
    }
    else if (foil && !fullFoilEnabled && activeWindow === 3)
    {
      isDragging = true;
      foilOffsetX = mouseX - foilX/(dpiScale/canvasScale);
      foilOffsetY = mouseY - foilY/(dpiScale/canvasScale);
    }
  }

  // Handle mouse move event
  function handleMouseMove(e: MouseEvent) {
  let canvas = rectangleCanvas;
	if(!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging && image && activeWindow === 2) {
      // Update the image position
      imageX = Math.round((mouseX - offsetX)*dpiScale/canvasScale); //*dpiScale/canvasScale
      imageY = Math.round((mouseY - offsetY)*dpiScale/canvasScale);
      imageXdisplay = imageX - origin;
      imageYdisplay = imageY - origin;
    }
    else if (isDragging && foil && activeWindow === 3) {
      // Update the image position
      foilX = Math.round((mouseX - foilOffsetX)*dpiScale/canvasScale);
      foilY = Math.round((mouseY - foilOffsetY)*dpiScale/canvasScale);
      foilXdisplay = foilX - origin;
      foilYdisplay = foilY - origin;
    }
    else if (ButtonToggle) //TBD - have buttons light up with mouse hover
    {
      buttonHover = "";

      $Circles.forEach((circle) => {
        if (isPointInCircle(mouseX, mouseY, circle) && rectangleCtx) {
          buttonHover = circle.name;
        }
      });
    }

    canvasRedraw(1, 0.5, lineColor, false);
  }

  // Handle click event
  function handleClick(e: MouseEvent) {
    let canvas = rectangleCanvas;
    if(!ButtonToggle) return;
    if(!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    $Circles.forEach((circle) => {
      if (isPointInCircle(mouseX, mouseY, circle) && !circle.name.startsWith('MB')) {

        circle.enabled = !circle.enabled;

        if (circle.name.startsWith('LT') && circle.name !== "LT1" && circle.name !== "LT6")
        {
          circle.former = !circle.former;
          if (LT1Toggle)
            LT1size();
        }
        else if (circle.name.startsWith('RT') && circle.name !== "RT1")
        {
          circle.former = !circle.former;
          if (RT1Toggle)
            RT1size();
        }

      }
    });

    canvasRedraw(1, 0.5, lineColor, false);
  }


  // Handle mouse up event
  function handleMouseUp() {
    isDragging = false;
  }

  // Save canvas content as an image file
  function saveCanvasAsImage(inputCanvas: HTMLCanvasElement) {
    // Convert canvas content to a data URL
    const dataUrl = inputCanvas.toDataURL("image/png");

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-image.png"; // Set the file name
    link.click(); // Trigger the download
  }

  // Handle scaling changes
  function handleScaleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    let newScale = parseFloat(target.value);

    // Ensure the scale is within bounds
    if (isNaN(newScale)) newScale = 1; // Default to 1 if the input is invalid
        newScale = Math.min(maxImageScale, Math.max(minImageScale, newScale));

    if (activeWindow === 2)
      imageScale = newScale; // Update the scale factor
    else if (activeWindow === 3)
      foilScale = newScale;
    
    canvasRedraw(1, 0.5, lineColor, false);
  }

  // Handle rotation changes
  function handleRotationChange(e: Event) {
    const target = e.target as HTMLInputElement;

    let newRotation = parseFloat(parseFloat(target.value).toFixed(2));

    if (isNaN(newRotation)) newRotation = 0; // Default to 0 if the input is invalid
    
    // Ensure the rotation is within bounds
    newRotation = Math.min(maxRotation, Math.max(minRotation, newRotation));

    if (activeWindow === 2)
      rotation = newRotation; // Update the rotation angle, rounded to 2 decimal places
    else if (activeWindow === 3)
      foilRotation = newRotation; // Update the rotation angle, rounded to 2 decimal places

    canvasRedraw(1, 0.5, lineColor, false);
  }


  function handleButtonToggleClick(e: Event){
    if (!ButtonToggle)
    {
      for(let i = 0; i < $Circles.length; i++)
          oldCircles[i].enabled = $Circles[i].enabled;
    }
    else
    {
      for(let i = 0; i < $Circles.length; i++)
      {
        if (oldCircles[i].enabled !== $Circles[i].enabled)
          selectedButtonLayout = ButtonLayouts[4]; //Custom
      }
    }

    if (selectedButtonLayout === ButtonLayouts[4])
      updateCustom();

    ButtonToggle = !ButtonToggle
    canvasRedraw(1, 0.5, lineColor, false);
  }

  async function updatePreviews(layer: number){
    const previewMargin = 3;
    
    // Draw scaled-down versions
    if (layer == 0 && rectanglePreview && rectangleCanvas)
    {
      const bgPrevCtx = rectanglePreview.getContext('2d')!;
      bgPrevCtx.save();

      if (selectedDevice == "Glyph")
      {
        bgPrevCtx.clearRect(0, 0, rectanglePreview.width, rectanglePreview.height);
        bgPrevCtx.drawImage(rectangleCanvas, 
        0, 0, (OuterRectangleWidth + canvasScale*previewMargin) * canvasScale, (OuterRectangleHeight + canvasScale*previewMargin) * canvasScale,
        0, 0, rectanglePreview.width, rectanglePreview.height);
      }
      else if (selectedDevice != "")
      {
        await new Promise<void>((resolve, reject) => {
          deviceScaledImg.onload = () => resolve();
          deviceScaledImg.onerror = () => reject(new Error('Image failed to load'));
        });
        bgPrevCtx.clearRect(0, 0, rectanglePreview.width, rectanglePreview.height);

        for (let i = 0; i < 5; i++)
        {
          bgPrevCtx.drawImage(deviceScaledImg, 
          0, 0, deviceScaledImg.width, deviceScaledImg.height,
          0, 0, rectanglePreview.width, rectanglePreview.height);
          bgPrevCtx.drawImage(deviceScaledImg, 
          1, 1, deviceScaledImg.width, deviceScaledImg.height,
          0, 0, rectanglePreview.width, rectanglePreview.height);
        }
      }
      else
        bgPrevCtx.clearRect(0, 0, rectanglePreview.width, rectanglePreview.height);

      bgPrevCtx.restore();
    }
    else if (layer == 1 && imagePreview && imageCanvas)
    {
      const bgPrevCtx = imagePreview.getContext('2d')!;
      bgPrevCtx.save();
      bgPrevCtx.clearRect(0, 0, imagePreview.width, imagePreview.height);
      bgPrevCtx.drawImage(imageCanvas, 
      0, 0, (OuterRectangleWidth + 2*canvasPadding) * canvasScale, (OuterRectangleHeight + 2*canvasPadding) * canvasScale,
      0, 0, imagePreview.width, imagePreview.height);
      bgPrevCtx.restore();
    }
    else if (layer == 2 && foilPreview && foilCanvas)
    {
      const bgPrevCtx = foilPreview.getContext('2d')!;
      bgPrevCtx.save();
      bgPrevCtx.clearRect(0, 0, foilPreview.width, foilPreview.height);
      bgPrevCtx.drawImage(foilCanvas, 
      0, 0, (OuterRectangleWidth + 2*canvasPadding) * canvasScale, (OuterRectangleHeight + 2*canvasPadding) * canvasScale,
      0, 0, foilPreview.width, foilPreview.height);
      bgPrevCtx.restore();
    }
  }

  function updatePresetButtonLayout(){
    for(let i = 0; i < $Layouts.length; i++) {
      if ($Layouts[i].name === selectedButtonLayout) //Full
      {
        let layout = $Layouts[i];
        for(let j = 0; j < $Circles.length; j++) {
          let circle = $Circles[j];
          circle.enabled = layout.buttons[j];
        }
      }
    }
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function resetScale() {
    if (activeWindow === 2)
      imageScale = 1;
    else if (activeWindow === 3)
      foilScale = 1;

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function resetRotation() {
    if (activeWindow === 2)
      rotation = 0;
    else if (activeWindow === 3)
      foilRotation = 0;
    
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function resetPosition() {
    if (activeWindow === 2)
    {
      imageX = origin;
      imageY = origin;
      imageXdisplay = imageX - origin;
      imageYdisplay = imageY - origin;
    }
    else if (activeWindow === 3)
    {
      foilX = origin;
      foilY = origin;
      foilXdisplay = foilX - origin;
      foilYdisplay = foilY - origin;
    }
    
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function LT1size() {
    LT1Toggle = !LT1Toggle;
    let ChangeFlag = false;

    if(LT1Toggle)
    {
      $Circles[8].r = 27.5 / 2;

      for(let i = 9; i <= 12; i++) {
        if ($Circles[i].enabled)
          ChangeFlag = true;

        $Circles[i].enabled = false;
      }

      if (ChangeFlag && selectedButtonLayout !== ButtonLayouts[2]) //Don't change it to custom if picking Split FGC
        selectedButtonLayout = ButtonLayouts[4]; //Set it to custom if it turns off buttons
    }
    else
    {
      $Circles[8].r = 23 / 2;

      for(let i = 9; i <= 12; i++) {
        if ($Circles[i].former)
          $Circles[i].enabled = true;
      }
    }

    if (selectedButtonLayout === ButtonLayouts[4])
    {
      $CustomLayout[8].r = $Circles[8].r;
      if ($CustomLayout[8].r === 27.5 / 2)
      {
        for(let i = 9; i <= 12; i++)
          $CustomLayout[i].enabled = false;
      }
    }

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function RT1size() {
    RT1Toggle = !RT1Toggle;
    let ChangeFlag = false;

    if(RT1Toggle)
    {
      $Circles[30].r = 27.5 / 2;
      for(let i = 31; i <= 34; i++) {
        if ($Circles[i].enabled)
          ChangeFlag = true;

        $Circles[i].enabled = false;
      }

      if (ChangeFlag && selectedButtonLayout !== ButtonLayouts[2]) //Don't change it to custom if picking Split FGC
        selectedButtonLayout = ButtonLayouts[4]; //Set it to custom if it turns off buttons
    }
    else
    {
      $Circles[30].r = 23 / 2;

      for(let i = 31; i <= 34; i++) {
        if ($Circles[i].former)
          $Circles[i].enabled = true;
      }
    }

    if (selectedButtonLayout === ButtonLayouts[4])
    {
      $CustomLayout[30].r = $Circles[30].r;

      if ($CustomLayout[30].r === 27.5 / 2)
      {
        for(let i = 31; i <= 34; i++)
          $CustomLayout[i].enabled = false;
      }
    }

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleWindowChange(window: number) {
    activeWindow = window;

    if (activeWindow !== 1)
      ButtonToggle = false;
    


    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleLayoutChange() {
    if (selectedButtonLayout === ButtonLayouts[0] || selectedButtonLayout === ButtonLayouts[1] || selectedButtonLayout === ButtonLayouts[3])
    {
      if (LT1Toggle)
        LT1size();
      if (RT1Toggle)
        RT1size();
      updatePresetButtonLayout();
    }
    else if (selectedButtonLayout === ButtonLayouts[2])
    {
      if (!LT1Toggle)
        LT1size();
      if (!RT1Toggle)
        RT1size();
      updatePresetButtonLayout();
    }
    else if (selectedButtonLayout === ButtonLayouts[4])
    {
      let resizeLT1 = $Circles[8].r !== $CustomLayout[8].r;
      let resizeRT1 = $Circles[30].r !== $CustomLayout[30].r;

      for(let i = 0; i < $Circles.length; i++) {
        $Circles[i].enabled = $CustomLayout[i].enabled;
        $Circles[i].former = $CustomLayout[i].former;
        $Circles[i].r = $CustomLayout[i].r;
      }

      LT1size();
      RT1size();
      LT1size();
      RT1size();

      if (!resizeLT1)
        LT1size();

      if (!resizeRT1)
        RT1size();
    }

    if (selectedButtonLayout === ButtonLayouts[0] || selectedButtonLayout === ButtonLayouts[3])
    {
      for(let i = 9; i <= 12; i++)
        $Circles[i].former = true;
      
      for(let i = 31; i <= 34; i++)
        $Circles[i].former = true;
    }
    else if (selectedButtonLayout === ButtonLayouts[1] || selectedButtonLayout === ButtonLayouts[2])
    {
      for(let i = 9; i <= 12; i++)
        $Circles[i].former = false;
      
      for(let i = 31; i <= 34; i++)
        $Circles[i].former = false;
    }
  }

  function handleDeviceChange(box: number) {
    deviceDrawn = false;
    ButtonToggle = false;
    deviceBox3Contents = [];
    deviceBox3Default = '';

    if (deviceBox1Select == "Arcade Shock")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['All Button Modern', 'FST Noir', 'FST Vewlix', 'FST-EX'];
    }
    else if (deviceBox1Select == "ASI LVL")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['ABC', 'WASD'];
    }
    else if (deviceBox1Select == "BNB")
    {
      deviceBox2 = true;
      deviceBox3 = true;
      deviceBox2Default = 'Generation';
      deviceBox3Default = 'Model';
      deviceBox2Contents = ['Gen 1', 'Gen 2/3'];
      if (deviceBox2Select == 'Gen 1')
        deviceBox3Contents = ['All 24mm Button', 'Allbutton', 'Noir', 'Noir KOR', 'Sega 2P Extended', 'Sega 2P Extended KOR', 'Vewlix', 'WASD'];
      else if (deviceBox2Select == 'Gen 2/3')
        deviceBox3Contents = ['6GAWD Allbutton', '6GAWD Joystick 30mm', '6GAWD Joystick', 'Allbutton Plus Four', 'Allbutton', 'Mixup', 'Mixup KOR', 'Noir', 'Noir KOR',
        'Sega 2P Extended', 'Sega 2P Extended KOR', 'Shiokenstar', 'Vewlix', 'WASD'];
    }
    else if (deviceBox1Select == "Buttercade")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Bomber JPN Lever Noir', 'Bomber KOR Lever Noir', 'Bomber Stickless Noir 24mm', 'Bomber Stickless Noir 30mm'];
    }
    else if (deviceBox1Select == "DuelPad")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['A16 NEW Cross', 'A16 NEW Epic', 'A16 ORIGINAL Cross', 'A16 ORIGINAL Epic', 'Zen 16'];
    }
    else if (deviceBox1Select == "Etokki")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['JPN', 'KOR'];
    }
    else if (deviceBox1Select == "Haute42")
    {
      deviceBox2 = true;
      deviceBox3 = true;
      deviceBox2Default = 'Device';
      deviceBox3Default = 'Model';
      deviceBox2Contents = ['Haute Board', 'HautePad'];
      if (deviceBox2Select == 'Haute Board')
        deviceBox3Contents = ['B16', 'B16 Bottom', 'Mini', 'Mini Bottom'];
      else if (deviceBox2Select == 'HautePad')
        deviceBox3Contents = ['C16', 'G and S Series Bottom', 'G12', 'G13', 'G16', 'R and T Series Bottom', 'R16', 'S12', 'S13', 'S16', 'T12', 'T13', 'T16', 'U12', 'U16'];
    }
    else if (deviceBox1Select == "Hit Box")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Hit Box Panel', 'Smash Box', 'CrossUp', 'PS360+', 'Ultra'];
    }
    else if (deviceBox1Select == "Hori")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Fighting Edge', 'Fighting Edge 2017', 'Fighting Stick Alpha', 'RAP 2/3/EX Series', 'RAP 3 Tekken Series', 'RAP N', 'RAP N/DOA5',
      'RAP N/DOA5 Shiokenstar', 'RAP N/DOA5 Stickless', 'RAP V3-SA, VX-SA', 'RAP V3-SA, VX-SA KAI', 'RAP4 Kai (PS3/PS4), RAPV Kai (XB1/XB360), Switch',
      'Real Arcade ProV Japan Import' ];
    }
    // else if (deviceBox1Select == "Jonyfraze Espada, 4TW")
    // {
    //   deviceBox2 = true;
    //   deviceBox3 = true;
    //   deviceBox2Default = 'Device';
    //   deviceBox3Default = 'Model';
    //   deviceBox2Contents = ['Espada', '4TW'];
    //   if (deviceBox2Select == 'Espada')
    //     deviceBox3Contents = ['B16', 'B16 Bottom', 'Mini', 'Mini Bottom'];
    //   else if (deviceBox2Select == '4TW')
    //     deviceBox3Contents = ['C16', 'G and S Series Bottom', 'G12', 'G13', 'G16', 'R and T Series Bottom', 'R16', 'S12', 'S13', 'S16', 'T12', 'T13', 'T16', 'U12', 'U16'];
    // }
    else if (deviceBox1Select == "Qanba")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Crystal, Q2 Pro Glow', 'Dragon', 'Obsidian', 'Obsidian Stickless', 'Obsidian 2 JPN', 'Obsidian 2 KOR', 'Obsidian 2 Noir', 'Obsidian 2 Stickless',
        'Pearl JPN', 'Pearl KOR', 'Q1 CUT Version 2, Carbon', 'Q4-RAF, Eightarc', 'Sapphire'];
    }
    else
    {
      deviceBox2 = false;
      deviceBox3 = false;
    }

    if (box == 1)
    {
      deviceBox2Select = "";
      deviceBox3Select = "";
    }
    else if (box == 2)
      deviceBox3Select = "";

    const result = updateDeviceInfo([deviceBox1Select, deviceBox2Select, deviceBox3Select], deviceMaskImg, deviceScaledImg, deviceFullImg);
    deviceFullWidth = result.width;
    deviceFullHeight = result.height;
    selectedDevice = result.device;

    let pageBleedScale = deviceFullWidth/1095 >= deviceFullHeight/591 ? deviceFullWidth/1095 : deviceFullHeight/591;
    let pageBleedWidth = (deviceFullWidth+136)/pageBleedScale; //136 instead of 150 to account for rounding error in multiplication
    let pageBleedHeight = (deviceFullHeight+136)/pageBleedScale;

    if (selectedDevice == '')
      boxCoords = [0,0,0,0];
    else
      boxCoords = [deviceFullWidth/1095 >= deviceFullHeight/591 ? 0 : Math.floor((canvasPageWidth - pageBleedWidth)/2),
                  deviceFullWidth/1095 >= deviceFullHeight/591 ? Math.floor((canvasPageHeight - pageBleedHeight)/2) : 0,
                  deviceFullWidth/1095 >= deviceFullHeight/591 ? Math.ceil(canvasPageWidth) : Math.ceil(pageBleedWidth), //maybe need to subtract by first coords? JDW
                  deviceFullWidth/1095 >= deviceFullHeight/591 ? Math.ceil(pageBleedHeight) : Math.ceil(canvasPageHeight)];

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleFoilColorChange() {
    if (selectedFoilColor === 'Purple')
    {
      foilR = 128;
      foilG = 0;
      foilB = 128;
      foilAlpha = 0.7;
    }
    else if (selectedFoilColor === 'Blue')
    {
      foilR = 0;
      foilG = 0;
      foilB = 128;
      foilAlpha = 0.7;
    }
    else if (selectedFoilColor === 'Silver')
    {
      foilR = 100;
      foilG = 100;
      foilB = 100;
      foilAlpha = 0.7;
    }

    colorHex = rgbaToHex(foilR, foilG, foilB, foilAlpha);

    if (foilUploaded)
      processFoil(foilCtx, foilCanvas);

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleSmoothingChange() {
    if (selectedSmoothingOption === SmoothingOptions[0])
      imageSmoothing = true;
    else if (selectedSmoothingOption === SmoothingOptions[1])
      imageSmoothing = false;

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function updateCustom() {
    for(let i = 0; i < $Circles.length; i++) {
      $CustomLayout[i].r = $Circles[i].r;
      $CustomLayout[i].enabled = $Circles[i].enabled;
      $CustomLayout[i].former = $Circles[i].former;
    }
  }

  function downloadCSV() {
    let csvData = `no_foil`;
    
    if (foilUploaded || fullFoilEnabled)
      csvData = (fullFoilEnabled ? `full_foil` : `spot_foil`) + `,`
      + selectedFoilColor + `,`
      + foilLocation;

    // Create CSV blob
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', 'glyph_art_settings.csv');
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function exportToPDF() {
    isExporting = true;
    deviceDrawn = false;
    exportButtonText = "Exporting...";

    if(!rectangleCanvas) return;
    if(!foilCanvas) return;
    if(!imageCanvas) return;

    let scaleRatio = dpiScale/canvasScale;
    
    let oldSizes = [rectangleCanvas.width, rectangleCanvas.height, imageCanvas.width, imageCanvas.height, foilCanvas.width, foilCanvas.height];

    rectangleCanvas.width = 5400;
    rectangleCanvas.height = 3600;
    imageCanvas.width = 5400;
    imageCanvas.height = 3600;
    foilCanvas.width = 5400;
    foilCanvas.height = 3600;

    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [rectangleCanvas.width, rectangleCanvas.height]
    });
    
    ButtonToggle = false;
    let previousVisibleLayers = [visibleLayers[0], visibleLayers[1], visibleLayers[2]];

    // Add each canvas as a separate page
    visibleLayers[0] = true;
    visibleLayers[1] = false;
    visibleLayers[2] = false;
    if (selectedDevice == "Glyph")
    {
      canvasRedraw(scaleRatio, 1/scaleRatio, "black", true);
      await addCanvasToPDF(pdf, rectangleCanvas, '');
    }
    else
    {
      const firstPageCanvas = document.createElement('canvas');
      firstPageCanvas.width = 5400;
      firstPageCanvas.height = 3600;
      const firstPageCtx = firstPageCanvas.getContext('2d')!;
      const fullDeviceImage = new Image();
      fullDeviceImage.src = deviceFullImg.src;

      await new Promise<void>((resolve) => {
        fullDeviceImage.onload = () => {
          firstPageCtx.drawImage(fullDeviceImage, 0, 0, 5400, 3600);
          resolve();
        };
      });

      await addCanvasToPDF(pdf, firstPageCanvas, '');
    }
    
    pdf.addPage();

    visibleLayers[0] = false;
    visibleLayers[1] = true;
    visibleLayers[2] = false;
    canvasRedraw(scaleRatio, 1, "black", true);
    await addCanvasToPDF(pdf, imageCanvas, '');
    pdf.addPage();

    visibleLayers[0] = false;
    visibleLayers[1] = false;
    visibleLayers[2] = true;
    canvasRedraw(scaleRatio, 1, "black", true);
    await addCanvasToPDF(pdf, foilCanvas, '');

    rectangleCanvas.width = oldSizes[0];
    rectangleCanvas.height = oldSizes[1];
    imageCanvas.width = oldSizes[2];
    imageCanvas.height = oldSizes[3];
    foilCanvas.width = oldSizes[4];
    foilCanvas.height = oldSizes[5];

    visibleLayers = [true, true, true];
    canvasRedraw(1, 0.5, lineColor, false);

    visibleLayers = [previousVisibleLayers[0], previousVisibleLayers[1], previousVisibleLayers[2]];
    canvasRedraw(1, 0.5, lineColor, false);

    // Save the CSV
    downloadCSV();

    // Save the PDF
    pdf.save('glyph_art.pdf');

    exportButtonText = "Export to PDF/CSV";
    isExporting = false;
    disclaimerWindow = false;
  }

  function addCanvasToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, label: string): Promise<void> {
    return new Promise((resolve) => {
      // Add canvas image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Optional: Add layer label
      pdf.setFontSize(12);
      pdf.text(label, 10, 20);
      
      resolve();
    });
  }

  async function exportLayout() {
    isExporting = true;
    
    if (selectedDevice == "Glyph")
    {
      if(!rectangleCanvas) return;

      let scaleRatio = dpiScale/canvasScale;
      
      let oldSizes = [rectangleCanvas.width, rectangleCanvas.height];

      rectangleCanvas.width = 5400;
      rectangleCanvas.height = 3600;
      
      ButtonToggle = false;
      let previousVisibleLayers = [visibleLayers[0], visibleLayers[1], visibleLayers[2]];

      visibleLayers[0] = true;
    
      canvasRedraw(scaleRatio, 1/scaleRatio, "black", true);
      saveCanvasAsImage(rectangleCanvas);

      rectangleCanvas.width = oldSizes[0];
      rectangleCanvas.height = oldSizes[1];

      visibleLayers = [true, true, true];
      canvasRedraw(1, 0.5, lineColor, false);

      visibleLayers = [previousVisibleLayers[0], previousVisibleLayers[1], previousVisibleLayers[2]];
      canvasRedraw(1, 0.5, lineColor, false);
    }
    else
    {
      const firstPageCanvas = document.createElement('canvas');
      firstPageCanvas.width = 5400;
      firstPageCanvas.height = 3600;
      const firstPageCtx = firstPageCanvas.getContext('2d')!;
      const fullDeviceImage = new Image();
      fullDeviceImage.src = deviceFullImg.src;

      await new Promise<void>((resolve) => {
        fullDeviceImage.onload = () => {
          firstPageCtx.drawImage(fullDeviceImage, 0, 0, 5400, 3600);
          resolve();
        };
      });

      saveCanvasAsImage(firstPageCanvas);
    }
    
    isExporting = false;
  }

  function handleVisibleLayers(layer: number)
  {
    if (ButtonToggle)
    {
      ButtonToggle = false;
      canvasRedraw(1, 0.5, lineColor, false);
    }

    visibleLayers[layer] = !visibleLayers[layer];
    visibleColors[layer] = (visibleColors[layer] == 'transparent') ? 'red' : 'transparent';
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleMatch(match: string)
  {
    if (match == "scaleitf")
      imageScale = foilScale;
    else if (match == "rotationitf")
      rotation = foilRotation;
    else if (match == "positionitf")
    {
      imageX = foilX;
      imageY = foilY;
      imageXdisplay = foilXdisplay;
      imageYdisplay = foilYdisplay;
    }
    else if (match == "scalefti")
      foilScale = imageScale;
    else if (match == "rotationfti")
      foilRotation = rotation;
    else if (match == "positionfti")
    {
      foilX = imageX;
      foilY = imageY;
      foilXdisplay = imageXdisplay;
      foilYdisplay = imageYdisplay;
    }

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleLockedLayers(layer: number){
    if (ButtonToggle)
    {
      ButtonToggle = false;
      canvasRedraw(1, 0.5, lineColor, false);
    }

    if (!visibleLayers[layer])
    {
      visibleLayers[layer] = true;
      lockedLayers[layer] = false;
    }
    else
      lockedLayers[layer] = !lockedLayers[layer];
  }

  function hasTransparency(): boolean {
    if (!imageCanvas) return true;
    if (!imageCtx) return true;

    let pageBleedScale = deviceFullWidth/1095 >= deviceFullHeight/591 ? deviceFullWidth/1095 : deviceFullHeight/591;
    let pageBleedWidth = (deviceFullWidth+136)/pageBleedScale; //136 instead of 150 to account for rounding error in multiplication
    let pageBleedHeight = (deviceFullHeight+136)/pageBleedScale;

    let imageData: ImageData;

    if (selectedDevice == "Glyph" || selectedDevice == '')
      imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    else
      imageData = imageCtx.getImageData(deviceFullWidth/1095 >= deviceFullHeight/591 ? 0 : (imageCanvas.width - pageBleedWidth)/2,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? (imageCanvas.height - pageBleedHeight)/2 : 0,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? imageCanvas.width : pageBleedWidth,
                      deviceFullWidth/1095 >= deviceFullHeight/591 ? pageBleedHeight : imageCanvas.height);
    
    const data = imageData.data;
    
    // Check every 4th value (alpha channel)
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
            return true; // Found non-opaque pixel
        }
    }
    
    return false; // All pixels opaque
  }

  function removeFoil(){
    foil = null; // Clear the foil reference
    foilUploaded = false;
    foilFileName = 'No file chosen';
    foilFile = undefined;
    if (foilInput) foilInput.value = ''; // Clear the file input
    resetPosition();
    resetRotation();
    resetScale();
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleFullFoilChange(){
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function fillCanvas(){
    if (!foilCanvas) return;
    if (!foilCtx) return;

    foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height); // Clear the canvas

    if (fullFoilEnabled)
    {
      // Save current composite operation
      const oldComposite = foilCtx.globalCompositeOperation;
      
      // Fill entire canvas with selected color
      foilCtx.globalCompositeOperation = 'source-over';
      foilCtx.fillStyle = colorHex;
      foilCtx.fillRect(0, 0, foilCanvas.width, foilCanvas.height);
      
      // Restore composite operation
      foilCtx.globalCompositeOperation = oldComposite;
    }
  }

  function tooltipToggle(name: string){
    if (name != "")
    {
      for(let i = 0; i < Tooltips.length; i++)
      {
        if(Tooltips[i].name == name)
        {
          tooltip = Tooltips[i].name;
          tooltipX = Tooltips[i].cx;
          tooltipY = Tooltips[i].cy;
          tooltipMessage = Tooltips[i].message;
        }
      }
    }
    else
    {
      tooltip = "";
      tooltipX = 0;
      tooltipY = 0;
      tooltipMessage = "";
    }
  }

  function handleExportButtonClick(){
    if (selectedDevice == '')
    {
      errorMessage = `No device selected!
        Please select a device before exporting.`;
      errorWindow = true;
    }
    else if (imageTransparency)
    {
        errorMessage = `Image does not cover the full layout.
      Increase the image size before exporting.`;
      errorWindow = true;
    }
    else
      disclaimerWindow = true;
  }

  function handleAlignment(layer: string, direction: string){ //JDW
    
    let posX = 0;
    let posY = 0;
    let posWidth = 0;
    let posHeight = 0;

    if (layer == "image")
    {
      posWidth = imageScreenWidth;
      posHeight = imageScreenHeight;
    }
    else if (layer == "foil")
    {
      posWidth = foilScreenWidth;
      posHeight = foilScreenHeight;
    }

    if (direction == "UL")
    {
      posX = Math.ceil(boxCoords[0]*(dpiScale/canvasScale));
      posY = Math.ceil(boxCoords[1]*(dpiScale/canvasScale));
    }
    else if (direction == "UM") 
    {
      posX = Math.ceil((boxCoords[2] + 2*boxCoords[0] - posWidth)*(dpiScale/canvasScale)/2);
      posY = Math.ceil(boxCoords[1]*(dpiScale/canvasScale));
    }
    else if (direction == "UR")
    {
      posX = Math.ceil((boxCoords[2] + boxCoords[0] - posWidth)*(dpiScale/canvasScale));
      posY = Math.ceil(boxCoords[1]*(dpiScale/canvasScale));
    }
    if (direction == "L")
    {
      posX = Math.ceil(boxCoords[0]*(dpiScale/canvasScale));
      posY = Math.ceil((boxCoords[3] + 2*boxCoords[1] - posHeight)*(dpiScale/canvasScale)/2);
    }
    else if (direction == "M")
    {
      posX = Math.ceil((boxCoords[2] + 2*boxCoords[0] - posWidth)*(dpiScale/canvasScale)/2);
      posY = Math.ceil((boxCoords[3] + 2*boxCoords[1] - posHeight)*(dpiScale/canvasScale)/2);
    }
    else if (direction == "R")
    {
      posX = Math.ceil((boxCoords[2] + boxCoords[0] - posWidth)*(dpiScale/canvasScale));
      posY = Math.ceil((boxCoords[3] + 2*boxCoords[1] - posHeight)*(dpiScale/canvasScale)/2);
    }
    if (direction == "DL")
    {
      posX = Math.ceil(boxCoords[0]*(dpiScale/canvasScale));
      posY = Math.ceil((boxCoords[3] + boxCoords[1] - posHeight)*(dpiScale/canvasScale));
    }
    else if (direction == "DM")
    {
      posX = Math.ceil((boxCoords[2] + 2*boxCoords[0] - posWidth)*(dpiScale/canvasScale)/2);
      posY = Math.ceil((boxCoords[3] + boxCoords[1] - posHeight)*(dpiScale/canvasScale));
    }
    else if (direction == "DR")
    {
      posX = Math.ceil((boxCoords[2] + boxCoords[0] - posWidth)*(dpiScale/canvasScale));
      posY = Math.ceil((boxCoords[3] + boxCoords[1] - posHeight)*(dpiScale/canvasScale));
    }

    if (layer == "image")
    {
      imageX = posX - ((selectedDevice != "Glyph")&&(deviceFullWidth/1095 < deviceFullHeight/591) ? 3 : 0);
      imageY = posY - ((selectedDevice != "Glyph")&&(deviceFullWidth/1095 > deviceFullHeight/591) ? 3 : 0);
      imageXdisplay = imageX - origin;
      imageYdisplay = imageY - origin;
    }
    else if (layer == "foil")
    {
      foilX = posX - ((selectedDevice != "Glyph")&&(deviceFullWidth/1095 < deviceFullHeight/591) ? 3 : 0);
      foilY = posY - ((selectedDevice != "Glyph")&&(deviceFullWidth/1095 > deviceFullHeight/591) ? 3 : 0);
      foilXdisplay = foilX - origin;
      foilYdisplay = foilY - origin;
    }

    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleBestFit(){
    if (image)
    if (boxCoords[2]/boxCoords[3] <= image.width/image.height)
      imageScale = Math.round(100*boxCoords[3]/(image.height*canvasScale/dpiScale))/100;
    else
      imageScale = Math.round(100*boxCoords[2]/(image.width*canvasScale/dpiScale))/100;

    canvasRedraw(1, 0.5, lineColor, false);
    handleAlignment("image", "M");
    canvasRedraw(1, 0.5, lineColor, false);
  }

  function handleRotationClick(direction: string){
    if (direction == "left")
      rotation += rotation >= -90 ? -90 : 270;
    else if (direction == "right")
      rotation += rotation <= 90 ? 90 : -270;

    canvasRedraw(1, 0.5, lineColor, false);
  }

</script>

<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------- -->

<div class="main-container">

  {#if errorWindow}
    <div transition:fade="{{ duration: 100 }}" class="warning-overlay">
    <div class="warning-box">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <img src={close} alt="Close error message" class="layer-icon"
      style:position=fixed
      style:top=40px
      style:right=70px
      style:width=30px
      style:height=30px
      style:display=flex
      style:justify-content=center
      style:align-items=center
      style:z-index=100
      onclick={() => errorWindow = false} />
      <h1 style:margin-left=0px>Warning!</h1>
      <h2>{errorMessage}</h2>
      <button onclick={() => (errorWindow = false)} class="close-button">
        Okay
      </button>
    </div>
  </div>
  {:else if disclaimerWindow}
    <div transition:fade="{{ duration: 100 }}" class="warning-overlay">
    <div class="warning-box">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <img src={close} alt="Close error message" class="layer-icon"
      style:position=fixed
      style:top=40px
      style:right=70px
      style:width=30px
      style:height=30px
      style:display=flex
      style:justify-content=center
      style:align-items=center
      style:z-index=100
      onclick={() => disclaimerWindow = false} />
      <h1 style:margin-left=0px>Disclaimer:</h1>
      <h2>Disclaimer agreement here (TBD)</h2>
      <button onclick={exportToPDF} class="close-button">
        Export
      </button>
    </div>
  </div>
  {/if}

  <div class="top-bar">
    <div style:height=56px
      style:padding=0.5rem
      style:vertical-align=middle>
      <Customicon name="LL Logomark Offwhite" style="h-full w-full" alt={'Limit Labs logo'} />
    </div>
  </div>

  <div class="middle-row">

    <!-- Left Sidebar -->
    <div class="sidebar left">
    
      <!-- Layer Previews -->
      <div class="layer-previews">
        <h1>Layers</h1>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="preview-box"
        style:border-width={activeWindow === 1 ? "4px" : "0px"}
        style:background-color={activeWindow === 1 ? "#202223" : "#181a1b"}
        style:padding={activeWindow === 1 ? "11px" : "15px"}
        style:border-color={activeWindow === 1 ? "#b2aca2" : "transparent"}
        onclick={() => handleWindowChange(1)}>
          <div class="preview-container">
            <h3>Button Layout</h3>
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img src={visibleLayers[0] ? eye_1 : eye_0} alt="Visible?" class="layer-icon"
            style:right=11%
            onclick={() => handleVisibleLayers(0)} />
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img src={lockedLayers[0] || !visibleLayers[0] ? lock_0 : lock_1} alt="Locked?" class="layer-icon"
            style:right=0.5%
            onclick={() => handleLockedLayers(0)} />
            <canvas bind:this={rectanglePreview} class="preview-canvas"
            style:border-color={selectedDevice === "" ? "#303436" : "transparent"}></canvas>
          </div>
        </div>
        
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="preview-box"
        style:border-width={activeWindow === 2 ? "4px" : "0px"}
        style:background-color={activeWindow === 2 ? "#202223" : "#181a1b"}
        style:padding={activeWindow === 2 ? "11px" : "15px"}
        style:border-color={activeWindow === 2 ? "#b2aca2" : "transparent"}
        onclick={() => handleWindowChange(2)}>
          <div class="preview-container">
            <h3>Image</h3>
            {#if imageUploaded}
              <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
              <img src={visibleLayers[1] ? eye_1 : eye_0} alt="Visible?" class="layer-icon"
              style:right=11%
              onclick={() => handleVisibleLayers(1)} />
              <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
              <img src={lockedLayers[1] || !visibleLayers[1] ? lock_0 : lock_1} alt="Locked?" class="layer-icon"
              style:right=0.5%
              onclick={() => handleLockedLayers(1)} />
            {/if}
            <canvas bind:this={imagePreview} class="preview-canvas"></canvas>
          </div>
        </div>
        
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="preview-box"
        style:border-width={activeWindow === 3 ? "4px" : "0px"}
        style:background-color={activeWindow === 3 ? "#202223" : "#181a1b"}
        style:padding={activeWindow === 3 ? "11px" : "15px"}
        style:border-color={activeWindow === 3 ? "#b2aca2" : "transparent"}
        onclick={() => handleWindowChange(3)}>
          <div class="preview-container">
            <h3>Foil</h3>
            {#if foilUploaded || fullFoilEnabled}
              <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
              <img src={visibleLayers[2] ? eye_1 : eye_0} alt="Visible?" class="layer-icon"
              style:right=11%
              onclick={() => handleVisibleLayers(2)} />
              <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
              <img src={lockedLayers[2] || !visibleLayers[2] ? lock_0 : lock_1} alt="Locked?" class="layer-icon"
              style:right=0.5%
              onclick={() => handleLockedLayers(2)} />
            {/if}
            <canvas bind:this={foilPreview} class="preview-canvas"></canvas>
          </div>
        </div>

      </div>

      <br>

      <!-- Button to save the canvas as a pdf JDW -->
      <button onclick={handleExportButtonClick} class="export-button"
      disabled={isExporting}
      style:background-color={(imageTransparency || selectedDevice == '') ? "red" : "transparent"}
      onmouseenter={() => tooltipToggle("exporttopdf")}
      onmouseleave={() => tooltipToggle("")}>
      {exportButtonText}
      </button>
      <!-- <button onclick={() => (false ? errorWindow = true : disclaimerWindow = true)} class="export-button"
      disabled={isExporting}
      style:background-color={false ? "red" : "transparent"}
      onmouseenter={() => tooltipToggle("exporttopdf")}
      onmouseleave={() => tooltipToggle("")}>
      {exportButtonText}
      </button> -->
      {#if tooltip === "exporttopdf"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    
  </div>
      
    <div class="canvas-container">
      <canvas bind:this={imageCanvas}
      class="canvas-layer imageLayer"
      width={canvasPageWidth}
      height={canvasPageHeight}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
      onmouseleave={handleMouseUp}
      ></canvas>
      <canvas bind:this={foilCanvas}
      class="canvas-layer foilLayer"
      width={canvasPageWidth}
      height={canvasPageHeight}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
      onmouseleave={handleMouseUp}
      ></canvas>
      <canvas bind:this={rectangleCanvas}
      class="canvas-layer rectangleLayer"
      width={canvasPageWidth}
      height={canvasPageHeight}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
      onmouseleave={handleMouseUp}
      onclick={handleClick}
      ></canvas>
      <!-- 1129.5 x 625.5 -->
    </div>

    <!-- Right Sidebar -->
    <div class="sidebar right">

      {#if activeWindow === 1}

      {#if lockedLayers[0] || !visibleLayers[0]}
        <div transition:fade="{{ duration: 100 }}" class="lock-overlay"></div>
      {/if}

      <h1>Button Layout</h1>

    <!-- Layout dropdown -->
    <select bind:value={deviceBox1Select}
      onchange={() => handleDeviceChange(1)}>
      <option value="" disabled selected>Select a device</option>
      {#each deviceBox1Contents as device}
        <option value={device}>{device}</option>
      {/each}
    </select>

    {#if selectedDevice === "Glyph"}

      <!-- Layout dropdown -->
      <select bind:value={selectedButtonLayout}
        onchange={handleLayoutChange}>
        <option value="" disabled selected>Select a layout</option>
        {#each ButtonLayouts as layout}
          <!-- {#if layout === 'Custom'}
            <option value={layout} disabled selected>{layout}</option>
          {:else} -->
            <option value={layout}>{layout}</option>
          <!-- {/if} -->
        {/each}
      </select>

      <br>

      <button
        class="buttonToggle"
        onclick={handleButtonToggleClick}
        style:background-color={ButtonToggle ? 'red' : 'transparent'}
        onmouseenter={() => tooltipToggle("buttontoggle")}
        onmouseleave={() => tooltipToggle("")}>
          Button Toggle
        </button>
        {#if tooltip === "buttontoggle"}
          <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
            {tooltipMessage}
          </div>
        {/if}

        <br>

      <button class="buttonToggle"
        style:background-color={LT1Toggle ? 'red' : 'transparent'}
        onclick={LT1size}
        onmouseenter={() => tooltipToggle("leftthumb")}
        onmouseleave={() => tooltipToggle("")}>
        Large Size Left Thumb Button
      </button>
      {#if tooltip === "leftthumb"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
      <br>
      <button class="buttonToggle"
        style:background-color={RT1Toggle ? 'red' : 'transparent'}
        onclick={RT1size}
        onmouseenter={() => tooltipToggle("rightthumb")}
        onmouseleave={() => tooltipToggle("")}>
        Large Size Right Thumb Button
      </button>
      {#if tooltip === "rightthumb"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}

    {#if deviceBox2}
    <br>
      <select bind:value={deviceBox2Select}
        onchange={() => handleDeviceChange(2)}>
        <option value="" disabled selected>{deviceBox2Default}</option>
        {#each deviceBox2Contents as content}
          <option value={content}>{content}</option>
        {/each}
      </select>
    {/if}

    {#if deviceBox3}
      <select bind:value={deviceBox3Select}
        onchange={() => handleDeviceChange(3)}>
        <option value="" disabled selected>{deviceBox3Default}</option>
        {#each deviceBox3Contents as content}
          <option value={content}>{content}</option>
        {/each}
      </select>
    {/if}
    
    {#if selectedDevice !== ""}
      <br>

      <button onclick={exportLayout} class="export-button"
      disabled={isExporting}
      onmouseenter={() => tooltipToggle("exportlayout")}
      onmouseleave={() => tooltipToggle("")}>
        Export Layout to Image
      </button>
      {#if tooltip === "exportlayout"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}

    {:else if activeWindow === 2} <!-- Image settings -->

    <div style:display="flex">
      <h1>Image</h1>
      {#if tooltip === "imagedescription"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img src={info} class="tooltip-icon" alt="Image placement info"
      onmouseenter={() => tooltipToggle("imagedescription")}
      onmouseleave={() => tooltipToggle("")}
      style:margin-top="8px"
      style:margin-left="8px"
      />
    </div>

    {#if lockedLayers[1] || !visibleLayers[1]}
      <div transition:fade="{{ duration: 100 }}" class="lock-overlay"></div>
    {/if}

    <!-- File input for uploading an image -->
    <!-- <input type="file"
    accept="image/*"
    onchange={handleImageUpload}
    bind:this={imageInput}
    style:background-color='transparent' /> -->

    <div class="file-input-wrapper">
      <button type="button" class="custom-button">
        {imageButtonText}
      </button>
      <input type="file" onchange={handleImageUpload} class="file-input" />
      <span class="file-display">{imageFileName}</span>
    </div>

    {#if imageUploaded}
    <br><br>

    <!-- Scale controls -->
    <label class="scale">
      Scale:
      <input
        type="range"
        bind:value={imageScale}
        min={minImageScale}
        max={maxImageScale}
        step="0.01"
        oninput={handleScaleChange}
      />
      <input class="number-input"
        type="number"
        bind:value={imageScale}
        min={minImageScale}
        max={maxImageScale}
        step="0.01"
        oninput={handleScaleChange}
      />
      {#if tooltip === "imagescale"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <img src={info} class="tooltip-icon" alt="Scale info"
      onmouseenter={() => tooltipToggle("imagescale")}
      onmouseleave={() => tooltipToggle("")}
      />
    </label>
      
    <!-- Reset scale button -->
    <button onclick={resetScale}
    onmouseenter={() => tooltipToggle("resetimagescale")}
    onmouseleave={() => tooltipToggle("")}>
      Reset Scale
    </button>
    {#if tooltip === "resetimagescale"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    {#if foil && !fullFoilEnabled}
      <button onclick={() => handleMatch("scaleitf")}
      onmouseenter={() => tooltipToggle("matchfoilscale")}
      onmouseleave={() => tooltipToggle("")}>
        Match Foil
      </button>
      
      {#if tooltip === "matchfoilscale"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}
    <br><br>

    <!-- Rotation controls -->
    <label class="scale">
      Rotation:
      <input
        type="range"
        bind:value={rotation}
        min={minRotation}
        max={maxRotation}
        step="0.01"
        oninput={handleRotationChange}
      />
      <input class="number-input"
        type="number" 
        bind:value={rotation}
        min={minRotation}
        max={maxRotation}
        step="0.1"
        oninput={handleRotationChange}
      />
    </label>

    <button class="alignment-button" style:margin-left="8px" onclick={() => handleRotationClick("left")}>↶</button>
    <button class="alignment-button" onclick={() => handleRotationClick("right")}>↷</button><br>

    <!-- Reset rotation button -->
    <button onclick={resetRotation}
    onmouseenter={() => tooltipToggle("resetimagerotation")}
    onmouseleave={() => tooltipToggle("")}>
      Reset Rotation
    </button>
    {#if tooltip === "resetimagerotation"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    {#if foil && !fullFoilEnabled}
      <button onclick={() => handleMatch("rotationitf")}
      onmouseenter={() => tooltipToggle("matchfoilrotation")}
      onmouseleave={() => tooltipToggle("")}>
        Match Foil
      </button>
      {#if tooltip === "matchfoilrotation"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}
    <br><br>

    <!-- Position Controls -->
    <label class="scale">
      Position:
      <input class="number-input"
          type="number"
          bind:value={imageXdisplay}
          step="1"
          oninput={() => (imageX = imageXdisplay + origin, canvasRedraw(1, 0.5, lineColor, false))}
        />

      <input class="number-input"
        type="number"
        bind:value={imageYdisplay}
        step="1"
        oninput={() => (imageY = imageYdisplay + origin, canvasRedraw(1, 0.5, lineColor, false))}
      />
    </label>
    
    <!-- Reset Position button -->
    <button onclick={resetPosition}
    onmouseenter={() => tooltipToggle("resetimageposition")}
    onmouseleave={() => tooltipToggle("")}>
      Reset Position
    </button>
    {#if tooltip === "resetimageposition"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    {#if foil && !fullFoilEnabled}
      <button onclick={() => handleMatch("positionitf")}
      onmouseenter={() => tooltipToggle("matchfoilposition")}
      onmouseleave={() => tooltipToggle("")}>
        Match Foil
      </button>
      {#if tooltip === "matchfoilposition"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}

    <!-- ↺↻↷↶ -->
    
    <br>

    {#if selectedDevice !== ''}
      <h2>Alignment:
        <button onclick={() => handleBestFit()}
        onmouseenter={() => tooltipToggle("imagebestfit")}
        onmouseleave={() => tooltipToggle("")}
        style:position="absolute"
        style="transform: translateX(98px) translateY(-7px)">
          Best Fit
        </button>
        {#if tooltip === "imagebestfit"}
          <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
            {tooltipMessage}
          </div>
        {/if}
        <button class="alignment-button" style:margin-left="4px" onclick={() => handleAlignment("image", "UL")}>↖</button>
        <button class="alignment-button" onclick={() => handleAlignment("image", "UM")}>↑</button>
        <button class="alignment-button" onclick={() => handleAlignment("image", "UR")}>↗</button><br>
        <button class="alignment-button" style:margin-left="84px" onclick={() => handleAlignment("image", "L")}>←</button>
        <button class="alignment-button" onclick={() => handleAlignment("image", "M")}>○</button>
        <button class="alignment-button" onclick={() => handleAlignment("image", "R")}>→</button><br>
        <button class="alignment-button" style:margin-left="84px" onclick={() => handleAlignment("image", "DL")}>↙</button>
        <button class="alignment-button" onclick={() => handleAlignment("image", "DM")}>↓</button>
        <button class="alignment-button" onclick={() => handleAlignment("image", "DR")}>↘</button>
      </h2>
      
      
    {/if}

    <!-- Image smoothing dropdown -->
    <div style:display="flex">
      <h2>Image Smoothing: 
        <select bind:value={selectedSmoothingOption}
        onchange={handleSmoothingChange}>
          {#each SmoothingOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </h2>


      {#if tooltip === "imagesmoothing"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img src={info} class="tooltip-icon" alt="Image smoothing info"
      onmouseenter={() => tooltipToggle("imagesmoothing")}
      onmouseleave={() => tooltipToggle("")}
      style:margin-top="20px"
      style:margin-left="0px"
      />

    </div>

    {/if}

    <!-- /////////////////////////////////////////////////////////// -->
      
  {:else if activeWindow === 3}

  <div style:display="flex">
    <h1>Foil</h1>
    {#if tooltip === "foildescription"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img src={info} class="tooltip-icon" alt="Foil placement info"
    onmouseenter={() => tooltipToggle("foildescription")}
    onmouseleave={() => tooltipToggle("")}
    style:margin-top="8px"
    style:margin-left="8px"
    />
  </div>

  {#if lockedLayers[2] || !visibleLayers[2]}
    <div transition:fade="{{ duration: 100 }}" class="lock-overlay"></div>
  {/if}

  <div class="full-foil-control">
    <label>
      <input 
        type="checkbox" 
        bind:checked={fullFoilEnabled}
        onchange={handleFullFoilChange}
      />
      Enable Full Foil
    </label>
  </div>

  {#if foilUploaded || fullFoilEnabled}

    <!-- Foil color dropdown -->
    <div style:display="flex">
      <h2>Foil Color: 
        <select bind:value={selectedFoilColor}
        onchange={handleFoilColorChange}>
          {#each FoilColors as color}
            <option value={color}>{color}</option>
          {/each}
        </select>
        <select bind:value={foilLocation}
        style:margin-left="0px">
          <option value={"below"}>Foil Below</option>
          <option value={"above"}>Foil Above</option>
        </select>
      </h2>

      {#if tooltip === "foillocation"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <img src={info} class="tooltip-icon" alt="Foil placement info"
      onmouseenter={() => tooltipToggle("foillocation")}
      onmouseleave={() => tooltipToggle("")}
      style:margin-top="21px"
      style:margin-left="0px"
      />
    </div>

    <br>
  {/if}
  
  {#if !fullFoilEnabled}

  <div class="file-input-wrapper">
    <button type="button" class="custom-button">
      {foilButtonText}
    </button>
    <input type="file" bind:this={foilInput} onchange={handleFoilUpload} class="file-input" />
    <span class="file-display">{foilFileName}</span>
  </div>

  {/if}

  {#if foilUploaded && !fullFoilEnabled}
    <br><br>

    <!-- Scale controls -->
    <label class="scale">
      Scale:
      <input
        type="range"
        bind:value={foilScale}
        min={minImageScale}
        max={maxImageScale}
        step="0.01"
        oninput={handleScaleChange}
      />
      <input class="number-input"
        type="number"
        bind:value={foilScale}
        min={minImageScale}
        max={maxImageScale}
        step="0.01"
        oninput={handleScaleChange}
      />
    </label>

    <!-- Reset scale button -->
    <button onclick={resetScale}
    onmouseenter={() => tooltipToggle("resetfoilscale")}
    onmouseleave={() => tooltipToggle("")}>
      Reset Scale
    </button>
    {#if tooltip === "resetfoilscale"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    {#if image}
      <button onclick={() => handleMatch("scalefti")}
      onmouseenter={() => tooltipToggle("matchimagescale")}
      onmouseleave={() => tooltipToggle("")}>
        Match Image
      </button>
      {#if tooltip === "matchimagescale"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}
    <br><br>

    <!-- Rotation controls -->
    <label class="scale">
      Rotation:
      <input
        type="range"
        bind:value={foilRotation}
        min={minRotation}
        max={maxRotation}
        step="0.01"
        oninput={handleRotationChange}
      />
      <input class="number-input"
        type="number" 
        bind:value={foilRotation}
        min={minRotation}
        max={maxRotation}
        step="0.1"
        oninput={handleRotationChange}
      />
    </label>

    <!-- Reset rotation button -->
    <button onclick={resetRotation}
    onmouseenter={() => tooltipToggle("resetfoilrotation")}
    onmouseleave={() => tooltipToggle("")}>
      Reset Rotation
    </button>
    {#if tooltip === "resetfoilrotation"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    {#if image}
      <button onclick={() => handleMatch("rotationfti")}
      onmouseenter={() => tooltipToggle("matchimagerotation")}
      onmouseleave={() => tooltipToggle("")}>
        Match Image
      </button>
      {#if tooltip === "matchimagerotation"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}
    <br><br>

    <!-- Position Controls -->
    <label class="scale">
      Position:
      <input class="number-input"
          type="number"
          bind:value={foilXdisplay}
          step="1"
          oninput={() => (foilX = foilXdisplay + origin, canvasRedraw(1, 0.5, lineColor, false))}
        />

      <input class="number-input"
        type="number"
        bind:value={foilYdisplay}
        step="1"
        oninput={() => (foilY = foilYdisplay + origin, canvasRedraw(1, 0.5, lineColor, false))}
      />
    </label>

    <!-- Reset Position button -->
    <button onclick={resetPosition}
    onmouseenter={() => tooltipToggle("resetfoilposition")}
    onmouseleave={() => tooltipToggle("")}>
      Reset Position
    </button>
    {#if tooltip === "resetfoilposition"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    {#if image}
      <button onclick={() => handleMatch("positionfti")}
      onmouseenter={() => tooltipToggle("matchimageposition")}
      onmouseleave={() => tooltipToggle("")}>
        Match Image
      </button>
      {#if tooltip === "matchimageposition"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}
    {/if}
    <br><br>

    <button onclick={removeFoil}
    onmouseenter={() => tooltipToggle("removefoil")}
    onmouseleave={() => tooltipToggle("")}>
    Remove Foil
    </button>
    {#if tooltip === "removefoil"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

  {/if}
{/if}
    
    </div>
  </div>
</div>

<!-- ----------------------------------------------------------------------------------------------------------------------------------------------------------- -->
<style>

  /* .main-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  } */

  .main-container {
    display: flex;
    flex-direction: column;
    min-width: 100%; /* Fixed width (adjust as needed) */
    height: 100vh; /* Fixed height */
    overflow: auto; /* Enable scrollbars */
    position: relative;
    margin: 0;
    padding: 0;
    background-color: #1e2122;
  }

  .top-bar {
    min-width: 100%; /* Match container */
    flex: 1;
    min-height: 6%;
    max-height: 6.5%;
    flex-shrink: 0; /* Prevent height changes */

    display: flex;
    align-items: center;
    gap: 3rem;
    border-bottom-width: 1px;
    --tw-border-opacity: 1;
    border-color: rgb(15 23 42 / var(--tw-border-opacity, 1)) /* #0f172a */;
    --tw-bg-opacity: 1;
    background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1)) /* #1e293b */;
    padding: 1rem;
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  .middle-row {
    overflow-y: auto;
    display: flex;
    flex: 1;
    min-height: calc(100vh - 4rem);; /* Total height minus top bar */
    width: 1920px; /* Match parent width */
  }

  .sidebar {
    padding-top: 20px;
    background-color: #1e2122;
  }

  .sidebar.left {
    overflow-y: auto;
    width: 19% !important; /* 19% */
    flex-shrink: 0;
    padding-left: 16px;
    padding-right: 16px;
    border-right: 1px solid #303436;
  }

  .sidebar.right {
    overflow-y: auto;
    flex: 1;
    min-width: 21%; /* 21% */
    overflow: auto;
    padding-left: 10px;
    padding-right: 10px;
    border-left: 1px solid #303436;
    position: relative;
  }

  .canvas-container {
    /*flex: 0 0 1152px;  Canvas takes up 60% of the screen width, 0 0 60% */
    width: 60%;
    min-height: calc(100vh - 4rem);
    flex-shrink: 0;
    overflow-y: auto;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #242728;
    font-size: 16px;
  }

  * {
    flex-shrink: 0; /* Critical for Flexbox items */
    box-sizing: border-box;
  }

  .canvas-layer {
    position: absolute;
    top: 185px; /* 20.25% */ 
    left: 376px; /* 19.65% */
  }

  .imageLayer { z-index: 1; }
  .foilLayer { z-index: 2; }
  .rectangleLayer { z-index: 3; }

  h1 {
    margin-left: 12px;
    color: #e8e6e3;
    font-size: 1.8em;
  }

  h2 {
    margin: 8px;
    color: #e8e6e3;
  }

  h3 {
    margin: 0 0 8px 0;
    color: #b2aca2;
    font-size: 1.1em;
  }

  input{
    padding: 8px 12px;
    border: 1px solid #303436;
    margin: 8px;
    cursor: pointer;
    font-size: 16px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
    background-color: #121212;
  }

  button{
    padding: 10px 20px;
    border: 1px solid #303436;
    margin: 8px;
    cursor: pointer;
    font-size: 16px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }

  button:hover {
    border-color: #999;
  }

  .alignment-button{
    width: 24px;
    text-align: middle;
    padding: 0px 6px;
    border: 1px solid #303436;
    margin: 1px;
    margin-right: 0px;
    margin-left: -1px; 
    cursor: pointer;
    font-size: 14px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }
  
  .scale{
    display: flex;
    align-items: center;
    padding: 1px 20px;
    border: 1px solid #303436;
    margin: 8px;
    cursor: pointer;
    font-size: 16px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
  }

  .number-input {
    width: 5em;
  }

  input[type="range"] {
    width: 120px; /* Set the desired width of the slider */
  }

  .buttonToggle{
    padding: 10px 20px;
    border: 1px solid #303436;
    margin: 8px;
    cursor: pointer;
    font-size: 16px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
  }

  .buttonToggle:hover {
    border-color: #999;
  }

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

  .layer-previews {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
  }

  .preview-box {
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: border-color 0.3s ease, background-color 0.2s ease;
  }

  .preview-canvas {
    width: 100%;
    height: auto;
    border: 2px solid #303436;
    margin-top: 10px;
  }

  .preview-container {
    position: relative;
    display: inline-block;
  }

  .layer-icon {
    position: absolute;
    top: 3px;
    width: 27px;
    height: 24px;
    background: #b2aca2;
    border-radius: 4px;
    padding: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .lock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(10, 10, 10, 0.6); /* Grey with 50% opacity */
    z-index: 10; /* Ensure it appears above the previews */
    transition: opacity 0.2s ease;
  }

  .full-foil-control {
    font-size: 16px;
    margin: 8px;
    color: #e8e6e3;
  }

  .warning-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .warning-box {
    background: #1e293b;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    max-width: 80%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    white-space: pre-line;
  }
  
  .close-button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: rgb(70, 75, 78);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.1s;
  }
  
  .close-button:hover {
    background: #303436;
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
    width: 120px;
    height: 40px;
    cursor: pointer;
  }

  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 40px;
    opacity: 0;
    cursor: pointer;
  }

  .file-display {
    color: white;
  }

  .tooltip-icon {
    width: 26px;
    height: 26px;
    border-radius: 4px;
    padding: 2px;
    margin-left: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: default;
  }

  .tooltip-wrapper {
    position: relative;
  }
  
  .tooltip {
    position: absolute;
    background: #333;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 100;
    width: max-content;
    max-width: 200px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

</style>