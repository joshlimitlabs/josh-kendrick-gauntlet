<script lang='ts'>
  import { onMount, tick } from "svelte";
  import Customicon from './customicon.svelte';
  import { updateDeviceInfo } from './CustomDevices';
  import { type Circle, Circles, CustomLayout, Layouts, Tooltips } from "./objStore";
  import { jsPDF } from 'jspdf';
  import { fade } from 'svelte/transition';
  import info from '$lib/assets/info.png';
  import eye_0 from '$lib/assets/eye_0.png';
  import eye_1 from '$lib/assets/eye_1.png';
  import { rgbaToHex } from '$lib/utils';
  import CustomDropdown from './CustomDropdown.svelte';
  import HelpWindow from './HelpWindow.svelte';
  import HolographicSrc from '$lib/assets/holographic.png';
  import close from '$lib/assets/close.png';

  let rectangleCanvas = $state<HTMLCanvasElement>();
  let rectangleCtx: CanvasRenderingContext2D | null;

  let imageCanvas = $state<HTMLCanvasElement>();
  let imageCtx: CanvasRenderingContext2D | null;

  let foilCanvas = $state<HTMLCanvasElement>();
  let foilCtx: CanvasRenderingContext2D | null;
  let foilFile = $state<File | undefined>(undefined);
  let foilInput = $state<HTMLInputElement>();
  let foil = $state<HTMLImageElement | null>(null);

  let maskData: ImageData;

  const topBarHeight = 62;
  let topBar = $state<HTMLElement>();
  let topBarWidth = $state(0);
  let canvasLeft = $state<number>();
  
  let windowWidth = $state(0);
  let windowHeight = $state(0);
  let canvasWidth = $state(0);
  let canvasHeight = $state(0);

  let imageFile = $state<File | null>(null);
  let imageFileName = $state('No file chosen');
  let imageUploaded = $state(false);
  let boxCoords = $state([0, 0, 5400, 3600]);
  let deviceFullWidth = $state(5400);
  let deviceFullHeight = $state(3600);

  let img: HTMLImageElement;
  let imgAspectRatio = 1; // Will be updated when image loads
  let imgWidth = $state(0);
  let imgHeight = $state(0);
  let imgX = $state(0);
  let imgY = $state(0);
  let isDragging = false;
  let activeCorner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | null = null;
  const margin = 16;
  const cornerRadius = 28;

  let scaleRatio = $state(1); // 1 = 100% scale
  let windowAspectRatio = $state(1);
  const minScale = 0.1;
  const maxScale = 20;
  let initialWidth = 100;

  let offsetX = 0;
  let offsetY = 0;
  let isMoving = false;
  
  let rotation = $state(0); // in radians
  let rotationDegrees = $state(0); // in degrees
  const minRotation = -180; // Minimum rotation angle
  const maxRotation = 180; // Maximum rotation angle
  let isRotating = false;
  let rotateStartAngle = 0;
  const rotationHandleLength = 80;
  let contentScale = $state(1);

  let selectedDevice: string = $state('');
  let deviceBox1Select: string = $state('');
  let deviceBox2Select: string = $state('');
  let deviceBox3Select: string = $state('');
  let deviceBox2 = $state(false);
  let deviceBox3 = $state(false);
  let deviceBox2Contents: string[] = $state([]);
  let deviceBox3Contents: string[] = $state([]);
  let deviceBox2Default: string = $state('');
  let deviceBox3Default: string = $state('');
  const deviceBox1Contents = ['Glyph', 'Agetec', 'ASI LVL', 'Brook', 'Etokki', 'GuileKeys', 'Hit Box', 'Junkfood Custom Arcades',
  'Overdrive Arcade', 'PDP', 'PowerA', 'Qanba', 'SEGA', 'Universal Arcade Stick Panel' ];
  // const deviceBox1ContentsOld = ['Glyph', 'Agetec', 'Arcade Shock', 'ASI LVL', 'BNB', 'Brook', 'Buttercade', 'DuelPad', 'Etokki', 'GuileKeys', 'Hit Box',
  // 'Qanba', 'Overdrive Arcade', 'PDP', 'PowerA', 'SEGA', 'Universal Arcade Stick Panel' ];

  let deviceMaskImg = $state<HTMLImageElement>(new Image());
  let deviceFullImg = $state<HTMLImageElement>(new Image());
  const lineColor = "#7f849c";
  let ButtonToggle = $state(false);
  let oldCircles = $state($Circles);
  let buttonHover = "";
  let glyphShiftX = 0;
  let glyphShiftY = 0;

  let exporting = false;
  let visibleLayers = $state([true, true, true]);

  let tooltip = $state("");
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let tooltipMessage = $state("");

  let SmoothingOptions = ['Enable Image Smoothing', 'Disable Image Smoothing'];
  let selectedSmoothingOption: string = $state(SmoothingOptions[0]);
  let imageSmoothing = $state(true);

  let activeWindow = $state(1);
  
  let foilX = $state(0);
  let foilY = $state(0);
  let foilOffsetX = 0;
  let foilOffsetY = 0;
  let foilUploaded = $state(false);
  let foilUnprocessed: HTMLImageElement | null = null;
  let foilUnprocessedWidth = 0;
  let foilUnprocessedHeight = 0;
  let scaleRatioFoil = $state(1); // Initial scale factor
  let rotationFoil = $state(0); // Initial rotation angle in radians
  let rotationFoilDegrees = $state(0); // in degrees
  let foilAspectRatio = 1; // Will be updated when image loads
  let foilWidth = $state(0);
  let foilHeight = $state(0);
  let initialFoilWidth = 100;

  let foilR = $state(100);  // R (0-255)
  let foilG = $state(100);    // G
  let foilB = $state(100);  // B
  let foilAlpha = $state(0.5); // Alpha (0-1)

  const FoilColors = ['Silver Metallic', 'Gold Metallic', 'Copper Metallic', 'Rose Gold Metallic', 'Red Metallic', 'Green Metallic', 'Blue Metallic', 'Dark Blue Metallic',
                      'Violet Metallic', 'Matte Silver Metallic', 'Satin Gold', 'Satin Red'];
  let colorHex = $state("#64646499");
  let selectedFoilColor: string = $state(FoilColors[0]);
  let fullFoilEnabled = $state(false);
  let fullHoloEnabled = $state(false);
  const FullHoloImg = new Image();

  let foilFileName = $state('No file chosen');
  let foilLocation = $state("above");

  let activeTab =  $state<'layout' | 'image' | 'foil' | 'export' | null>(null);
  const tabWidth = 40; // Width of closed tabs
  const expandedWidth = 410; // Width when expanded
  const tabPosition = 84; // Position of top tab
  let maxTabHeight = $state(0); // Maximum height before scrolling

  let selectedButtonLayout: string = $state('');
  const ButtonLayouts = ['Full', 'FGC', 'Split FGC', 'Platform Fighter', 'Custom'];
  let LT1Toggle = $state(false);
  let RT1Toggle = $state(false);
  let changingColor = false;

  let isExporting = $state(false);

  const minPageWidth = 1024;
  let deviceCovered = $state(false);
  let popoutWindow = $state(false);
  let helpWindowHover = $state(false);

  $effect(() => {

    const updateSize = async () => {
      windowWidth = Math.max(window.innerWidth, minPageWidth); // Minimum window width = 1024px
      windowHeight = window.innerHeight;
      let effectiveWidth = windowWidth - 2 - (activeTab ? expandedWidth : 0);
      let effectiveHeight = windowHeight - topBarHeight - 2;
      windowAspectRatio = effectiveWidth/effectiveHeight;
      const targetAspectRatio = 3/2;

      if (windowAspectRatio >= targetAspectRatio) {
        canvasHeight = Math.floor(effectiveHeight);
        canvasWidth = Math.round(canvasHeight * targetAspectRatio);
        canvasLeft = (effectiveWidth - canvasWidth)/2;
      } else {
        canvasWidth = Math.max(Math.floor(effectiveWidth), topBarWidth - 2 - (activeTab ? expandedWidth : 0));
        canvasHeight = Math.round(canvasWidth / targetAspectRatio);
        canvasLeft = 0;
      }

      const referenceHeight = 3600;
      contentScale = canvasHeight / referenceHeight;

      maxTabHeight = windowHeight - 5*tabPosition + topBarHeight + 16;

      if (topBar)
        topBarWidth = topBar.offsetWidth;

      if (selectedDevice != '')
        updateMaskData();

      await tick();
      canvasRedraw();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  });

  onMount(async () => {
    if(rectangleCanvas)
    rectangleCtx = rectangleCanvas.getContext('2d', { willReadFrequently: false });
    if(imageCanvas)
    imageCtx = imageCanvas.getContext('2d', { willReadFrequently: true });
    if(foilCanvas)
    foilCtx = foilCanvas.getContext('2d', { willReadFrequently: true });

    canvasRedraw();
	});

  function canvasRedraw(){
    drawImage();
    drawFoil();
    drawRectangle();
  }

  function drawRectangle(){
    if (!rectangleCanvas || !rectangleCtx) return;

    rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height);
    if (!visibleLayers[0]) return;

    if (selectedDevice != '')
    {
      if (selectedDevice == "Glyph")
        drawGlyph();
      else
        rectangleCtx.drawImage(deviceFullImg, 0, 0, rectangleCanvas.width, rectangleCanvas.height);
    }
  }

  function drawGlyph() {
    if(!rectangleCanvas) return;
    if(!rectangleCtx) return;

    const drawWidth = 0.5;
    const OuterRectangleWidth = 364.5;
    const OuterRectangleHeight = 196.5;
    const GlyphFullWidthPixels = 4308;
    const GlyphFullHeightPixels = 2324;
    const PrintFullWidthPixels = 5400;
    const PrintFullHeightPixels = 3600;
    let activeScale = (exporting) ? 1 : contentScale;

    glyphShiftX = (PrintFullWidthPixels - GlyphFullWidthPixels)/2;
    glyphShiftY = (PrintFullHeightPixels - GlyphFullHeightPixels)/2;

    rectangleCtx.save();
    rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height);
    
    rectangleCtx.translate(activeScale*glyphShiftX, activeScale*glyphShiftY);
    rectangleCtx.scale(activeScale*GlyphFullWidthPixels/OuterRectangleWidth, activeScale*GlyphFullWidthPixels/OuterRectangleWidth);

    rectangleCtx.lineWidth = drawWidth;
    rectangleCtx.strokeStyle = lineColor;
    rectangleCtx.lineCap = "round";

    // Draw bleed margin rectangle
    rectangleCtx.save();
    rectangleCtx.strokeStyle = 'red';
    drawRoundedRect(rectangleCtx, -6.35, -6.35, OuterRectangleWidth + 2*6.35, OuterRectangleHeight + 2*6.35, 10.25*1.3);
    rectangleCtx.stroke();
    rectangleCtx.restore();

    // Draw rectangle
    rectangleCtx.save();
    drawRoundedRect(rectangleCtx, 0, 0, OuterRectangleWidth, OuterRectangleHeight, 10.25);
    rectangleCtx.stroke();
    rectangleCtx.restore();

    // Draw  buttons
    drawButtons(drawWidth, lineColor);
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
    rectangleCtx.lineWidth = drawWidth;
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

		context.save();
		context.beginPath();
    
    if(ButtonToggle || circle.enabled) 
		  context.arc(circle.cx, circle.cy, circle.r, 0, 2 * Math.PI);
    
		context.clip();
    
    if (ButtonToggle && !circle.name.startsWith("MB"))
    {
      if (circle.name == buttonHover)
        context.fillStyle = circle.enabled ? "#e7e7e7" : "#171717";
      else
        context.fillStyle = circle.enabled ? "white" : "black";

      context.fill();
    }
    else
      context.clearRect(0, 0, canvas.width, canvas.height);
    
		context.restore();
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

  function clearGlyphArea(layer: string)
  {
    if (!visibleLayers[0]) return;

    const OuterRectangleWidth = 364.5;
    const OuterRectangleHeight = 196.5;
    const GlyphFullWidthPixels = 4308;
    const GlyphFullHeightPixels = 2324;
    const PrintFullWidthPixels = 5400;
    const PrintFullHeightPixels = 3600;
    glyphShiftX = (PrintFullWidthPixels - GlyphFullWidthPixels)/2;
    glyphShiftY = (PrintFullHeightPixels - GlyphFullHeightPixels)/2;
    let drawScale = GlyphFullWidthPixels/OuterRectangleWidth;
    let ctx: CanvasRenderingContext2D | null = null;

    if (layer == "image")
    {
      ctx = imageCtx;
      checkGlyphPixelCoverage();
    }
    else if (layer == "foil")
      ctx = foilCtx;

    if(ctx)
    {
      // Clear area outside of the rectangle
      ctx.save();
      ctx.translate(glyphShiftX, glyphShiftY);
      ctx.scale(drawScale, drawScale);
      ctx.globalCompositeOperation = 'destination-in';
      drawRoundedRect(ctx, -6.35, -6.35, OuterRectangleWidth + 2*6.35, OuterRectangleHeight + 2*6.35, 10.25*1.3);
      ctx.fill();
      ctx.restore();

      // Clear the screen rectangle
      ctx.save();
      ctx.translate(glyphShiftX, glyphShiftY);
      ctx.scale(drawScale, drawScale);
      drawRoundedRect(ctx, 110.962, 3.557, 24.276, 13.386, 1.485);
      ctx.clip();
      ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear everything inside the screen rectangle
      ctx.restore();

      // Clear circles
      ctx.save();
      ctx.translate(glyphShiftX, glyphShiftY);
      ctx.scale(drawScale, drawScale);
      
      for(let i = 0; i < $Circles.length; i++) {
          let cir = $Circles[i];

          ctx.beginPath();
          ctx.save();
          ctx.beginPath();

          if(cir.enabled) 
            ctx.arc(cir.cx, cir.cy, cir.r, 0, 2 * Math.PI);
          
          ctx.clip();
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.restore();
          ctx.closePath();
      }

      ctx.restore();
    }
  }

  function checkGlyphPixelCoverage() {
    const GlyphFullWidthPixels = 4308;
    const GlyphFullHeightPixels = 2324;
    const bleedMargin = 75;

    if (!exporting && imageCtx)
    {
        let tempImageData: ImageData;
        tempImageData = imageCtx.getImageData(Math.ceil(contentScale*(glyphShiftX - bleedMargin)),
        Math.ceil(contentScale*(glyphShiftY - bleedMargin)),
        Math.floor(contentScale*(GlyphFullWidthPixels + 2*bleedMargin)),
        Math.floor(contentScale*(GlyphFullHeightPixels + 2*bleedMargin - 6)));

        const data = tempImageData.data;
        let fullCoverageDetected = true;
      
        // Check every 4th value (alpha channel)
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
                fullCoverageDetected = false; // Found non-opaque pixel
                break;
            }
        }
        
        deviceCovered = fullCoverageDetected;
    }
  }


  async function clearDeviceArea(layer: string)
  {
    if (!visibleLayers[0]) return;

    if(imageCanvas && imageCtx && layer == "image")
      applyMask(imageCanvas);
    else if(foilCanvas && foilCtx && layer == "foil")
      applyMask(foilCanvas);
  }

  function applyMask(targetCanvas: HTMLCanvasElement) {
    const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);

    let allWhitePixelsCovered = true;

    // Apply the mask to the original image and check coverage
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Check mask pixel (using red channel since it's B&W)
        const maskValue = maskData.data[i];
        
        // Count white pixels in mask (value >= 128)
        if (maskValue >= 128) {
            
            // Check if this white mask pixel has a non-transparent image pixel
            const imageAlpha = imageData.data[i + 3];
            if (imageAlpha > 0) {
            } else {
                allWhitePixelsCovered = false;
            }
        }
        
        // If mask pixel is black (or dark), make target pixel transparent
        if (maskValue < 128) {
            imageData.data[i + 3] = 0; // Set alpha to 0
        }
    }

    if (targetCanvas == imageCanvas)
      deviceCovered = allWhitePixelsCovered;

    ctx.putImageData(imageData, 0, 0);
  }

  function drawImage() {
    if (!imageCanvas || !imageCtx || !img) return;
    if (!img.complete) return;

    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    if (!visibleLayers[1]) return;

    rotation = (rotation > Math.PI) ? rotation - 2*Math.PI : rotation;
    rotation = (rotation < -Math.PI) ? rotation + 2*Math.PI : rotation;
    rotationDegrees = Math.round(100*(rotation * 180) / Math.PI)/100;

    imageCtx.imageSmoothingEnabled = imageSmoothing;
    
    imageCtx.save();

    if (!exporting)
      imageCtx.scale(contentScale, contentScale);

    const scaledImgWidth = imgWidth;
    const scaledImgHeight = imgWidth / imgAspectRatio;
    imgHeight = scaledImgHeight;
    const scaledMargin = margin;
    const scaledCornerRadius = cornerRadius;
    const scaledRotationHandleLength = rotationHandleLength;
    const scaledImgX = imgX;
    const scaledImgY = imgY;

    // Calculate center and dimensions
    const centerX = scaledImgX + scaledImgWidth/2;
    const centerY = scaledImgY + scaledImgHeight/2;
    const borderedWidth = scaledImgWidth + scaledMargin * 2;
    const borderedHeight = scaledImgHeight + scaledMargin * 2;
    
    // Save context for rotation
    imageCtx.save();
    imageCtx.translate(centerX, centerY);
    imageCtx.rotate(rotation);
    imageCtx.translate(-centerX, -centerY);

    // Draw image (rotated)
    imageCtx.drawImage(img, scaledImgX, scaledImgY, scaledImgWidth, scaledImgHeight);

    imageCtx.restore();

    // Clear blank space areas
    if (!exporting)
    {
      if (selectedDevice == "Glyph")
        clearGlyphArea("image");
      else if (selectedDevice != '')
        clearDeviceArea("image");

      if (activeWindow == 2)
      {
        imageCtx.save();
        imageCtx.translate(centerX, centerY);
        imageCtx.rotate(rotation);
        imageCtx.translate(-centerX, -centerY);
        
        // Draw dotted border (rotated)
        imageCtx.strokeStyle = '#FFFFFF';
        imageCtx.lineWidth = 4;
        imageCtx.setLineDash([12, 12]);
        imageCtx.strokeRect(
            scaledImgX - scaledMargin,
            scaledImgY - scaledMargin,
            borderedWidth,
            borderedHeight
        );
        imageCtx.setLineDash([]);
        
        // Restore before drawing UI elements that shouldn't rotate
        imageCtx.restore();
        
        // Calculate rotation handle position in screen space
        const rotationHandleX = centerX + Math.sin(rotation) * (borderedHeight/2 + scaledRotationHandleLength);
        const rotationHandleY = centerY - Math.cos(rotation) * (borderedHeight/2 + scaledRotationHandleLength);
        
        // Draw rotation handle line (unrotated)
        imageCtx.beginPath();
        imageCtx.moveTo(
            centerX + Math.sin(rotation) * borderedHeight/2,
            centerY - Math.cos(rotation) * borderedHeight/2
        );
        imageCtx.lineTo(rotationHandleX, rotationHandleY);
        imageCtx.strokeStyle = '#FFFFFF';
        imageCtx.lineWidth = 1;
        imageCtx.stroke();
        
        // Draw all control points (unrotated)
        drawCorner(
            centerX - Math.cos(rotation) * borderedWidth/2 - Math.sin(rotation) * borderedHeight/2,
            centerY - Math.sin(rotation) * borderedWidth/2 + Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // Top-left
        
        drawCorner(
            centerX + Math.cos(rotation) * borderedWidth/2 - Math.sin(rotation) * borderedHeight/2,
            centerY + Math.sin(rotation) * borderedWidth/2 + Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // Top-right
        
        drawCorner(
            centerX - Math.cos(rotation) * borderedWidth/2 + Math.sin(rotation) * borderedHeight/2,
            centerY - Math.sin(rotation) * borderedWidth/2 - Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // Bottom-left
        
        drawCorner(
            centerX + Math.cos(rotation) * borderedWidth/2 + Math.sin(rotation) * borderedHeight/2,
            centerY + Math.sin(rotation) * borderedWidth/2 - Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // Bottom-right
        
        drawCorner(rotationHandleX, rotationHandleY, scaledCornerRadius, 'image'); // Rotation handle
      }
    }

    // Restore scaling transform
    imageCtx.restore();

    if (exporting){
      const imageData = imageCtx.getImageData(boxCoords[0], boxCoords[1], boxCoords[2] - boxCoords[0], boxCoords[3] - boxCoords[1]);
      imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      imageCtx.putImageData(imageData, boxCoords[0], boxCoords[1]);
    }
  }

  async function drawFoil() {
    if (!foilCanvas || !foilCtx) return;

    // Clear canvas
    foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);
    if (!visibleLayers[2]) return;

    rotationFoil = (rotationFoil > Math.PI) ? rotationFoil - 2*Math.PI : rotationFoil;
    rotationFoil = (rotationFoil < -Math.PI) ? rotationFoil + 2*Math.PI : rotationFoil;
    rotationFoilDegrees = Math.round(100*(rotationFoil * 180) / Math.PI)/100;

    foilCtx.imageSmoothingEnabled = false;

    // Calculate scaled dimensions
    const scaledFoilWidth = foilWidth;
    const scaledFoilHeight = foilWidth / foilAspectRatio;
    foilHeight = scaledFoilHeight;
    const scaledMargin = margin;
    const scaledCornerRadius = cornerRadius;
    const scaledRotationHandleLength = rotationHandleLength;
    const scaledFoilX = foilX;
    const scaledFoilY = foilY;

    // Calculate center and dimensions
    const centerX = scaledFoilX + scaledFoilWidth/2;
    const centerY = scaledFoilY + scaledFoilHeight/2;
    const borderedWidth = scaledFoilWidth + scaledMargin * 2;
    const borderedHeight = scaledFoilHeight + scaledMargin * 2;
    
    // Save context for scaling
    foilCtx.save();

    if (fullFoilEnabled)
    {
      fillCanvas();
      if (!exporting)
      {
        foilCtx.scale(contentScale, contentScale);
        foilCtx.save();

        if (selectedDevice == "Glyph")
          clearGlyphArea("foil");
        else if (selectedDevice != '')
          clearDeviceArea("foil");

        foilCtx.restore();
      }
    }
    else if (fullHoloEnabled)
    {
      foilCtx.drawImage(FullHoloImg, 0, 0, foilCanvas.width, foilCanvas.height);
      if (!exporting)
      {
        foilCtx.scale(contentScale, contentScale);
        foilCtx.save();

        if (selectedDevice == "Glyph")
          clearGlyphArea("foil");
        else if (selectedDevice != '')
          clearDeviceArea("foil");

        foilCtx.restore();
      }
    }
    else
    {
      if (!foil || !foilUploaded) return;

      if (!exporting)
        foilCtx.scale(contentScale, contentScale);
      
      // Save context for rotation
      foilCtx.save();
      foilCtx.translate(centerX, centerY);
      foilCtx.rotate(rotationFoil);
      foilCtx.translate(-centerX, -centerY);

      // Draw image (rotated)
      foilCtx.drawImage(foil, scaledFoilX, scaledFoilY, scaledFoilWidth, scaledFoilHeight);

      foilCtx.restore();

      // Clear blank space areas
      if (!exporting)
      {
        if (selectedDevice == "Glyph")
          clearGlyphArea("foil");
        else if (selectedDevice != '')
          clearDeviceArea("foil");

        if (activeWindow == 3)
        {
          foilCtx.save();
          foilCtx.translate(centerX, centerY);
          foilCtx.rotate(rotationFoil);
          foilCtx.translate(-centerX, -centerY);
          
          // Draw dotted border (rotated)
          foilCtx.strokeStyle = '#FFFFFF';
          foilCtx.lineWidth = 4;
          foilCtx.setLineDash([12, 12]);
          foilCtx.strokeRect(
              scaledFoilX - scaledMargin,
              scaledFoilY - scaledMargin,
              borderedWidth,
              borderedHeight
          );
          foilCtx.setLineDash([]);
          
          // Restore before drawing UI elements that shouldn't rotate
          foilCtx.restore();
          
          // Calculate rotation handle position in screen space
          const rotationHandleX = centerX + Math.sin(rotationFoil) * (borderedHeight/2 + scaledRotationHandleLength);
          const rotationHandleY = centerY - Math.cos(rotationFoil) * (borderedHeight/2 + scaledRotationHandleLength);
          
          // Draw rotation handle line (unrotated)
          foilCtx.beginPath();
          foilCtx.moveTo(
              centerX + Math.sin(rotationFoil) * borderedHeight/2,
              centerY - Math.cos(rotationFoil) * borderedHeight/2
          );
          foilCtx.lineTo(rotationHandleX, rotationHandleY);
          foilCtx.strokeStyle = '#FFFFFF';
          foilCtx.lineWidth = 1;
          foilCtx.stroke();
          
          // Draw all control points (unrotated)
          drawCorner(
              centerX - Math.cos(rotationFoil) * borderedWidth/2 - Math.sin(rotationFoil) * borderedHeight/2,
              centerY - Math.sin(rotationFoil) * borderedWidth/2 + Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // Top-left
          
          drawCorner(
              centerX + Math.cos(rotationFoil) * borderedWidth/2 - Math.sin(rotationFoil) * borderedHeight/2,
              centerY + Math.sin(rotationFoil) * borderedWidth/2 + Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // Top-right
          
          drawCorner(
              centerX - Math.cos(rotationFoil) * borderedWidth/2 + Math.sin(rotationFoil) * borderedHeight/2,
              centerY - Math.sin(rotationFoil) * borderedWidth/2 - Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // Bottom-left
          
          drawCorner(
              centerX + Math.cos(rotationFoil) * borderedWidth/2 + Math.sin(rotationFoil) * borderedHeight/2,
              centerY + Math.sin(rotationFoil) * borderedWidth/2 - Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // Bottom-right
          
          drawCorner(rotationHandleX, rotationHandleY, scaledCornerRadius, 'foil'); // Rotation handle
        }
      }
    
    }

    // Restore scaling transform
    foilCtx.restore();

    if (exporting){
      const imageData = foilCtx.getImageData(boxCoords[0], boxCoords[1], boxCoords[2] - boxCoords[0], boxCoords[3] - boxCoords[1]);
      foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);
      foilCtx.putImageData(imageData, boxCoords[0], boxCoords[1]);
    }
  }

  function drawCorner(x: number, y: number, radius: number, layer: string) {
    let ctx: CanvasRenderingContext2D | null;
    if (layer == 'image')
      ctx = imageCtx;
    else if (layer == 'foil')
      ctx = foilCtx;
    else return;
    
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }

  function handleScaleChange(e: Event) {
    const target = e.target as HTMLInputElement;

    if (activeWindow == 2)
    {
      scaleRatio = parseFloat(target.value);
      imgWidth = initialWidth * scaleRatio;
    }
    else if (activeWindow == 3)
    {
      scaleRatioFoil = parseFloat(target.value);
      foilWidth = initialFoilWidth * scaleRatioFoil;
    }

    canvasRedraw();
  }

  function handleMouseDown(e: MouseEvent | TouchEvent) {
    if (activeWindow == 2 && visibleLayers[1]){
      if(!imageCanvas || !imageCtx || !img.complete) return;

      const rect = imageCanvas.getBoundingClientRect();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const mouseX = (clientX - rect.left) / contentScale;
      const mouseY = (clientY - rect.top) / contentScale;

      const imgHeight = imgWidth / imgAspectRatio;
      const centerX = imgX + imgWidth/2;
      const centerY = imgY + imgHeight/2;
      
      // Calculate rotation handle position
      const borderedHeight = imgHeight + margin * 2;
      const rotationHandleX = centerX + Math.sin(rotation) * (borderedHeight/2 + rotationHandleLength);
      const rotationHandleY = centerY - Math.cos(rotation) * (borderedHeight/2 + rotationHandleLength);
      
      // Check rotation handle first
      const rotationHandleDist = Math.sqrt((mouseX - rotationHandleX) ** 2 + (mouseY - rotationHandleY) ** 2);
      if (rotationHandleDist <= cornerRadius) {
        isRotating = true;
        rotateStartAngle = Math.atan2(mouseY - centerY, mouseX - centerX) - rotation;
        if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
        return;
      }
      
      // Calculate corner positions in screen space
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const borderedWidth = imgWidth + margin * 2;
      
      const corners = [
        { 
          x: centerX - cos * borderedWidth/2 - sin * borderedHeight/2,
          y: centerY - sin * borderedWidth/2 + cos * borderedHeight/2,
          type: 'topLeft' 
        },
        { 
          x: centerX + cos * borderedWidth/2 - sin * borderedHeight/2,
          y: centerY + sin * borderedWidth/2 + cos * borderedHeight/2,
          type: 'topRight' 
        },
        { 
          x: centerX - cos * borderedWidth/2 + sin * borderedHeight/2,
          y: centerY - sin * borderedWidth/2 - cos * borderedHeight/2,
          type: 'bottomLeft' 
        },
        { 
          x: centerX + cos * borderedWidth/2 + sin * borderedHeight/2,
          y: centerY + sin * borderedWidth/2 - cos * borderedHeight/2,
          type: 'bottomRight' 
        }
      ];
      
      // Check if clicked on a corner
      for (const corner of corners) {
        const distance = Math.sqrt((mouseX - corner.x) ** 2 + (mouseY - corner.y) ** 2);
        if (distance <= cornerRadius) {
          isDragging = true;
          activeCorner = corner.type as any;
          if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
          break;
        }
      }

      if (!isDragging) {
        // Check if clicked inside the image (considering rotation)
        // Convert mouse coordinates to image's local space
        const localX = cos * (mouseX - centerX) + sin * (mouseY - centerY) + imgWidth/2;
        const localY = -sin * (mouseX - centerX) + cos * (mouseY - centerY) + imgHeight/2;
        
        if (localX >= 0 && localX <= imgWidth && localY >= 0 && localY <= imgHeight) {
          if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
          offsetX = mouseX - imgX;
          offsetY = mouseY - imgY;
          isMoving = true;
        }
      }
    }
    if (activeWindow == 3 && visibleLayers[2]){
      if(!foilCanvas || !foilCtx || !foil) return;
      if(!foil.complete) return;

      const rect = foilCanvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const mouseX = (clientX - rect.left) / contentScale;
      const mouseY = (clientY - rect.top) / contentScale;

      const foilHeight = foilWidth / foilAspectRatio;
      const centerX = foilX + foilWidth/2;
      const centerY = foilY + foilHeight/2;
      
      // Calculate rotationFoil handle position
      const borderedHeight = foilHeight + margin * 2;
      const rotationHandleX = centerX + Math.sin(rotationFoil) * (borderedHeight/2 + rotationHandleLength);
      const rotationHandleY = centerY - Math.cos(rotationFoil) * (borderedHeight/2 + rotationHandleLength);
      
      // Check rotationFoil handle first
      const rotationHandleDist = Math.sqrt((mouseX - rotationHandleX) ** 2 + (mouseY - rotationHandleY) ** 2);
      if (rotationHandleDist <= cornerRadius) {
        isRotating = true;
        rotateStartAngle = Math.atan2(mouseY - centerY, mouseX - centerX) - rotationFoil;
        if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
        return;
      }
      
      // Calculate corner positions in screen space
      const cos = Math.cos(rotationFoil);
      const sin = Math.sin(rotationFoil);
      const borderedWidth = foilWidth + margin * 2;
      
      const corners = [
        { 
          x: centerX - cos * borderedWidth/2 - sin * borderedHeight/2,
          y: centerY - sin * borderedWidth/2 + cos * borderedHeight/2,
          type: 'topLeft' 
        },
        { 
          x: centerX + cos * borderedWidth/2 - sin * borderedHeight/2,
          y: centerY + sin * borderedWidth/2 + cos * borderedHeight/2,
          type: 'topRight' 
        },
        { 
          x: centerX - cos * borderedWidth/2 + sin * borderedHeight/2,
          y: centerY - sin * borderedWidth/2 - cos * borderedHeight/2,
          type: 'bottomLeft' 
        },
        { 
          x: centerX + cos * borderedWidth/2 + sin * borderedHeight/2,
          y: centerY + sin * borderedWidth/2 - cos * borderedHeight/2,
          type: 'bottomRight' 
        }
      ];
      
      // Check if clicked on a corner
      for (const corner of corners) {
        const distance = Math.sqrt((mouseX - corner.x) ** 2 + (mouseY - corner.y) ** 2);
        if (distance <= cornerRadius) {
          isDragging = true;
          activeCorner = corner.type as any;
          if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
          break;
        }
      }

      if (!isDragging) {
        // Check if clicked inside the foil (considering rotationFoil)
        // Convert mouse coordinates to foil's local space
        const localX = cos * (mouseX - centerX) + sin * (mouseY - centerY) + foilWidth/2;
        const localY = -sin * (mouseX - centerX) + cos * (mouseY - centerY) + foilHeight/2;
        
        if (localX >= 0 && localX <= foilWidth && localY >= 0 && localY <= foilHeight) {
          if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
          foilOffsetX = mouseX - foilX;
          foilOffsetY = mouseY - foilY;
          isMoving = true;
        }
      }
    }
  }

function handleMouseMove(e: MouseEvent | TouchEvent) {
  if (ButtonToggle) return;
  if (activeWindow == 2 && visibleLayers[1]){
  if (!imageCanvas || !imageCtx) return;
  if (!img.complete) return;
  
  const rect = imageCanvas.getBoundingClientRect();
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  const mouseX = (clientX - rect.left) / contentScale;
  const mouseY = (clientY - rect.top) / contentScale;

  const imgHeight = imgWidth / imgAspectRatio;
  
  if (isRotating) {
    const centerX = imgX + imgWidth/2;
    const centerY = imgY + imgHeight/2;
    rotation = Math.atan2(mouseY - centerY, mouseX - centerX) - rotateStartAngle;
  } 
  else if (isDragging && activeCorner) {
    // Convert mouse coordinates to rotated space
    const centerX = imgX + imgWidth/2;
    const centerY = imgY + imgHeight/2;
    
    // Translate mouse coordinates to origin
    const translatedX = mouseX - centerX;
    const translatedY = mouseY - centerY;
    
    // Rotate back to image space
    const cos = Math.cos(-rotation);
    const sin = Math.sin(-rotation);
    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;
    
    // Translate back to original position
    const unrotatedMouseX = rotatedX + centerX;
    const unrotatedMouseY = rotatedY + centerY;
    
    let newWidth = imgWidth;
    let newX = imgX;
    let newY = imgY;
    
    switch (activeCorner) {
      case 'bottomLeft':
        // Bottom-right corner stays fixed
        newWidth = Math.max(20, (imgX + imgWidth) - unrotatedMouseX);
        newX = (imgX + imgWidth) - newWidth;
        newY = (imgY + imgHeight) - (newWidth / imgAspectRatio);
        break;
        
      case 'bottomRight':
        // Bottom-left corner stays fixed
        newWidth = Math.max(20, unrotatedMouseX - imgX);
        newY = (imgY + imgHeight) - (newWidth / imgAspectRatio);
        break;
        
      case 'topLeft':
        // Top-right corner stays fixed
        newWidth = Math.max(20, (imgX + imgWidth) - unrotatedMouseX);
        newX = (imgX + imgWidth) - newWidth;
        break;
        
      case 'topRight':
        // Top-left corner stays fixed
        newWidth = Math.max(20, unrotatedMouseX - imgX);
        break;
      }
      
      // Apply changes
      imgX = newX;
      imgY = newY;
      imgWidth = newWidth;
      scaleRatio = Math.round(100 * imgWidth / initialWidth) / 100;
    }
    else if (isMoving) {
      imgX = Math.round(mouseX - offsetX);
      imgY = Math.round(mouseY - offsetY);
    }
    else if (ButtonToggle)
    {
      buttonHover = "";

      $Circles.forEach((circle) => {
        if (isPointInCircle(mouseX, mouseY, circle) && rectangleCtx) {
          buttonHover = circle.name;
        }
      });
    }
  }
  else if (activeWindow == 3 && visibleLayers[2]){
    if (!foilCanvas || !foilCtx || !foil) return;
    if (!foil.complete) return;
    
    const rect = foilCanvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const mouseX = (clientX - rect.left) / contentScale;
    const mouseY = (clientY - rect.top) / contentScale;

    const foilHeight = foilWidth / foilAspectRatio;
    
    if (isRotating) {
      const centerX = foilX + foilWidth/2;
      const centerY = foilY + foilHeight/2;
      rotationFoil = Math.atan2(mouseY - centerY, mouseX - centerX) - rotateStartAngle;
    } 
    else if (isDragging && activeCorner) {
      // Convert mouse coordinates to rotated space
      const centerX = foilX + foilWidth/2;
      const centerY = foilY + foilHeight/2;
      
      // Translate mouse coordinates to origin
      const translatedX = mouseX - centerX;
      const translatedY = mouseY - centerY;
      
      // Rotate back to foil space
      const cos = Math.cos(-rotationFoil);
      const sin = Math.sin(-rotationFoil);
      const rotatedX = translatedX * cos - translatedY * sin;
      const rotatedY = translatedX * sin + translatedY * cos;
      
      // Translate back to original position
      const unrotatedMouseX = rotatedX + centerX;
      const unrotatedMouseY = rotatedY + centerY;
      
      let newWidth = foilWidth;
      let newX = foilX;
      let newY = foilY;
      
      switch (activeCorner) {
        case 'bottomLeft':
          // Bottom-right corner stays fixed
          newWidth = Math.max(20, (foilX + foilWidth) - unrotatedMouseX);
          newX = (foilX + foilWidth) - newWidth;
          newY = (foilY + foilHeight) - (newWidth / foilAspectRatio);
          break;
          
        case 'bottomRight':
          // Bottom-left corner stays fixed
          newWidth = Math.max(20, unrotatedMouseX - foilX);
          newY = (foilY + foilHeight) - (newWidth / foilAspectRatio);
          break;
          
        case 'topLeft':
          // Top-right corner stays fixed
          newWidth = Math.max(20, (foilX + foilWidth) - unrotatedMouseX);
          newX = (foilX + foilWidth) - newWidth;
          break;
          
        case 'topRight':
          // Top-left corner stays fixed
          newWidth = Math.max(20, unrotatedMouseX - foilX);
          break;
        }
        
        // Apply changes
        foilX = newX;
        foilY = newY;
        foilWidth = newWidth;
        scaleRatioFoil = Math.round(100 * foilWidth / initialFoilWidth) / 100;
      }
      else if (isMoving) {
        foilX = Math.round(mouseX - foilOffsetX);
        foilY = Math.round(mouseY - foilOffsetY);
      }
      else if (ButtonToggle)
      {
        buttonHover = "";

        $Circles.forEach((circle) => {
          if (isPointInCircle(mouseX, mouseY, circle) && rectangleCtx) {
            buttonHover = circle.name;
          }
        });
      }
    }
    canvasRedraw();
  }

  function isPointInCircle(x: number, y: number, circle: Circle): boolean {
    const OuterRectangleWidth = 364.5;
    const GlyphFullWidthPixels = 4308;
    const GlyphFullHeightPixels = 2324;
    const PrintFullWidthPixels = 5400;
    const PrintFullHeightPixels = 3600;

    let glyphScale = GlyphFullWidthPixels/OuterRectangleWidth;

    const scaledRadius = circle.r * glyphScale;
    const circleOffsetX =  (PrintFullWidthPixels - GlyphFullWidthPixels)/2 - scaledRadius;
    const circleOffsetY =  (PrintFullHeightPixels - GlyphFullHeightPixels)/2 - scaledRadius;

    const circleLeft = glyphScale*(circle.cx) + circleOffsetX;
    const circleRight = circleLeft + 2*scaledRadius;
    const circleTop = glyphScale*(circle.cy) + circleOffsetY;
    const circleBottom = circleTop + 2*scaledRadius;

    const dx = (circleLeft + circleRight) / 2;
    const dy = (circleTop + circleBottom) / 2;

    return ((x - dx) * (x - dx) + (y - dy) * (y - dy) <= scaledRadius * scaledRadius);
  }

  function handleMouseUp(){
    isDragging = false;
    isMoving = false;
    isRotating = false;
    if (rectangleCanvas)
      rectangleCanvas.style.cursor = 'default';
  }

  async function handleDeviceChange(box: number) {
    deviceCovered = false;
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
    else if (deviceBox1Select == "Junkfood Custom Arcades")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Snackbox Micro', 'Snackbox XL Micro'];
    }
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

    const result = updateDeviceInfo([deviceBox1Select, deviceBox2Select, deviceBox3Select], deviceMaskImg, deviceFullImg);
    deviceFullWidth = result.width;
    deviceFullHeight = result.height;
    selectedDevice = result.device;

    if (selectedDevice == '')
      boxCoords = [0,0,5400,3600];
    else
      boxCoords = [Math.floor((5400 - deviceFullWidth)/2),
                  Math.floor((3600 - deviceFullHeight)/2),
                  Math.ceil(deviceFullWidth + (5400 - deviceFullWidth)/2),
                  Math.ceil(deviceFullHeight + (3600 - deviceFullHeight)/2)];

    if (selectedDevice != '' && selectedDevice != "Glyph")
    {
      await new Promise<void>((resolve) => {

        deviceMaskImg.onload = () => {
            updateMaskData();
          deviceFullImg.onload = () => {
            canvasRedraw();
          };
          // canvasRedraw();
          resolve();
        };
          
      })
    }
    else
      canvasRedraw();
  }

  function handleButtonToggleClick(e: Event){
    if (!ButtonToggle)
    {
      activeWindow = 1;
      for(let i = 0; i < $Circles.length; i++)
          oldCircles[i].enabled = $Circles[i].enabled;
    }
    else
    {
      if (activeTab == 'image')
        activeWindow = 2;
      else if (activeTab == 'foil')
        activeWindow = 3;

      for(let i = 0; i < $Circles.length; i++)
      {
        if (oldCircles[i].enabled !== $Circles[i].enabled)
          selectedButtonLayout = ButtonLayouts[4]; //Custom
      }
    }

    if (selectedButtonLayout === ButtonLayouts[4])
      updateCustom();

    ButtonToggle = !ButtonToggle;
    canvasRedraw();
  }

  function updateMaskData() {
    if ((!imageUploaded && !foilUploaded && !fullFoilEnabled && !fullHoloEnabled) || (selectedDevice == '' || selectedDevice == 'Glyph')) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.save();
    tempCtx.scale(contentScale, contentScale);
    tempCtx.drawImage(deviceMaskImg, 0, 0);
    maskData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.restore();
  }

  function handleClick(e: MouseEvent) {
    if(!ButtonToggle) return;
    if(!rectangleCanvas) return;
    
    const rect = rectangleCanvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / contentScale;
    const mouseY = (e.clientY - rect.top) / contentScale;

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

    canvasRedraw();
  }

  async function exportToPDF() {
    // isExporting = true;
    // deviceDrawn = false;
    // exportButtonText = "Exporting...";

    if (!rectangleCanvas || !imageCanvas || !foilCanvas) return;
    
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
      unit: 'in', // Use inches instead of pixels
      format: [18, 12], // 18" x 12" directly
      compress: true  // Enable PDF compression
    });

    // Export function
    const addCanvasToPDF = async (canvas: HTMLCanvasElement, label: string) => {
      // Use JPEG for non-transparent layers (better compression)
      const format = 'PNG';
      
      const imgData = canvas.toDataURL(`image/${format}`);
      pdf.addImage(imgData, format, 0, 0, 18, 12, undefined, 'FAST');
      
      if (label) {
        pdf.setFontSize(12);
        pdf.text(label, 10, 20);
      }
    };
    
    ButtonToggle = false;
    let previousVisibleLayers = [visibleLayers[0], visibleLayers[1], visibleLayers[2]];

    // Add each canvas as a separate page
    exporting = true;
    visibleLayers[0] = true;
    visibleLayers[1] = false;
    visibleLayers[2] = false;
    canvasRedraw();
    await addCanvasToPDF(rectangleCanvas, '');
    
    pdf.addPage();

    visibleLayers[0] = false;
    visibleLayers[1] = true;
    visibleLayers[2] = false;
    canvasRedraw();
    await addCanvasToPDF(imageCanvas, '');
    pdf.addPage();

    visibleLayers[0] = false;
    visibleLayers[1] = false;
    visibleLayers[2] = true;
    canvasRedraw();
    await addCanvasToPDF(foilCanvas, '');

    exporting = false;

    rectangleCanvas.width = oldSizes[0];
    rectangleCanvas.height = oldSizes[1];
    imageCanvas.width = oldSizes[2];
    imageCanvas.height = oldSizes[3];
    foilCanvas.width = oldSizes[4];
    foilCanvas.height = oldSizes[5];

    visibleLayers = [previousVisibleLayers[0], previousVisibleLayers[1], previousVisibleLayers[2]];
    canvasRedraw();

    // Save the CSV
    downloadCSV();

    // Save the PDF
    pdf.save('glyph_art.pdf');
    
    // isExporting = false;
    // disclaimerWindow = false;
  }

  function downloadCSV() {
    let csvData = `no foil or holographic`;
    
    if (foilUploaded || fullFoilEnabled)
      csvData = (fullFoilEnabled ? `full foil` : `spot foil`) + `,`
      + selectedFoilColor
      + (foilLocation == "" ? `` : `,foil ` + foilLocation + ` printed image`);
    else if (fullHoloEnabled)
      csvData = `full holographic print`;

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

  function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
    imageFileName = target.files?.[0]?.name || imageFileName;
    
		if (target.files && target.files[0]) {
		imageFile = target.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			img = new Image();
			img.src = e.target?.result as string;

			// Once the image is loaded, draw it on the canvas
			img.onload = () => {
        imageUploaded = true;
        visibleLayers[1] = true;
        activeWindow = 2;
        scaleRatio = 1;
        rotation = 0;
        imgAspectRatio = img.naturalWidth / img.naturalHeight;
        initialWidth = img.naturalWidth; // Store original width
        imgWidth = initialWidth * scaleRatio; // Apply initial scale
        imgX = Math.round(boxCoords[0]);
        imgY = Math.round(boxCoords[1]);
				canvasRedraw();
			};
		};

		reader.readAsDataURL(imageFile);
		}
	}

  async function exportLayout() {
    isExporting = true;
    
    if (selectedDevice == "Glyph")
    {
      if(!rectangleCanvas) return;
      
      let oldSizes = [rectangleCanvas.width, rectangleCanvas.height];

      rectangleCanvas.width = 5400;
      rectangleCanvas.height = 3600;
      
      ButtonToggle = false;
      let previousVisibleLayers = [visibleLayers[0], visibleLayers[1], visibleLayers[2]];

      visibleLayers[0] = true;
      exporting = true;
    
      canvasRedraw();
      saveCanvasAsImage(rectangleCanvas);

      rectangleCanvas.width = oldSizes[0];
      rectangleCanvas.height = oldSizes[1];

      visibleLayers = [previousVisibleLayers[0], previousVisibleLayers[1], previousVisibleLayers[2]];
      canvasRedraw();
      exporting = false;
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

  function saveCanvasAsImage(inputCanvas: HTMLCanvasElement) {
    const dataUrl = inputCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-image.png";
    link.click(); // Trigger the download
  }

  function toggleTab(tab: 'layout' | 'image' | 'foil' | 'export') {
    activeTab = activeTab == tab ? null : tab;

    ButtonToggle = false;
    if (activeTab == 'image')
      activeWindow = 2;
    else if (activeTab == 'foil')
      activeWindow = 3;
    else
      activeWindow = 1;

    canvasRedraw();
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

  function handleRotationChange(e: Event) {
    const target = e.target as HTMLInputElement;

    let newRotation = parseFloat(parseFloat(target.value).toFixed(2));

    if (isNaN(newRotation)) newRotation = 0; // Default to 0 if the input is invalid
    
    newRotation = Math.min(maxRotation, Math.max(minRotation, newRotation));
    
    if (activeTab == 'image')
      rotation = (newRotation * Math.PI) / 180;
    else if (activeTab == 'foil')
      rotationFoil = (newRotation * Math.PI) / 180;

    canvasRedraw();
  }

  function resetScale() {
    if (activeTab == 'image')
    {
      scaleRatio = 1;
      imgWidth = initialWidth * scaleRatio;
    }
    else if (activeTab == 'foil')
    {
      scaleRatioFoil = 1;
      foilWidth = initialFoilWidth * scaleRatioFoil;
    }

    canvasRedraw();
  }

  function resetRotation() {
    if (activeTab == 'image')
      rotation = 0;
    else if (activeTab == 'foil')
      rotationFoil = 0;
    
    canvasRedraw();
  }

  function resetPosition() {
    if (activeTab == 'image')
    {
      imgX = 0;
      imgY = 0;
    }
    else if (activeTab == 'foil')
    {
      foilX = 0;
      foilY = 0;
    }
    
    canvasRedraw();
  }

  function handleAlignment(layer: string, direction: string){
    resetRotation();
    let posX = 0;
    let posY = 0;
    let posWidth = 0;
    let posHeight = 0;

    if (layer == "image")
    {
      posWidth = imgWidth;
      posHeight = imgHeight;
    }
    else if (layer == "foil")
    {
      posWidth = foilWidth;
      posHeight = foilHeight;
    }

    if (direction == "UL")
    {
      posX = Math.floor(boxCoords[0]);
      posY = Math.floor(boxCoords[1]);
    }
    else if (direction == "UM") 
    {
      posX = Math.round((boxCoords[2] + boxCoords[0] - posWidth)/2);
      posY = Math.floor(boxCoords[1]);
    }
    else if (direction == "UR")
    {
      posX = Math.ceil(boxCoords[2] - posWidth);
      posY = Math.floor(boxCoords[1]);
    }
    else if (direction == "L")
    {
      posX = Math.floor(boxCoords[0]);
      posY = Math.round((boxCoords[3] + boxCoords[1] - posHeight)/2);
    }
    else if (direction == "M")
    {
      posX = Math.round((boxCoords[2] + boxCoords[0] - posWidth)/2);
      posY = Math.round((boxCoords[3] + boxCoords[1] - posHeight)/2);
    }
    else if (direction == "R")
    {
      posX = Math.ceil(boxCoords[2] - posWidth);
      posY = Math.round((boxCoords[3] + boxCoords[1] - posHeight)/2);
    }
    else if (direction == "DL")
    {
      posX = Math.floor(boxCoords[0]);
      posY = Math.ceil(boxCoords[3] - posHeight);
    }
    else if (direction == "DM")
    {
      posX = Math.round((boxCoords[2] + boxCoords[0] - posWidth)/2);
      posY = Math.ceil(boxCoords[3] - posHeight);
    }
    else if (direction == "DR")
    {
      posX = Math.ceil(boxCoords[2] - posWidth);
      posY = Math.ceil(boxCoords[3] - posHeight);
    }

    if (layer == "image")
    {
      imgX = posX;
      imgY = posY;
    }
    else if (layer == "foil")
    {
      foilX = posX;
      foilY = posY;
    }

    canvasRedraw();
  }

  function handleBestFit(){
    if (!img) return;

    if (deviceFullWidth/deviceFullHeight <= img.width/img.height)
      scaleRatio = Math.ceil(100*deviceFullHeight/(img.height))/100;
    else
      scaleRatio = Math.ceil(100*deviceFullWidth/(img.width))/100;

    imgWidth = initialWidth * scaleRatio;
    canvasRedraw();
    handleAlignment("image", "M");
    canvasRedraw();
  }

  function handleRotationClick(direction: string){
    if (direction == "left")
      rotation += rotation >= -90 ? -90 : 270;
    else if (direction == "right")
      rotation += rotation <= 90 ? 90 : -270;

    canvasRedraw();
  }

  function handleSmoothingChange() {
    if (selectedSmoothingOption === SmoothingOptions[0])
      imageSmoothing = true;
    else if (selectedSmoothingOption === SmoothingOptions[1])
      imageSmoothing = false;

    canvasRedraw();
  }

  // Handle file upload for foil
	async function handleFoilUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    foilFileName = target.files?.[0]?.name || foilFileName;

    foilFile = (e.target as HTMLInputElement).files?.[0];
    if (!foilFile) return;
    
    foilUnprocessed = await loadFoil(foilFile);
    await processFoil();
    visibleLayers[2] = true;
  }

  function loadFoil(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const foilLoad = new Image();
      foilLoad.src = URL.createObjectURL(file);
      foilLoad.onload = () => resolve(foilLoad);
    });
  }

  async function processFoil() {
    if (!foilUnprocessed) return;
    
    foilUnprocessedWidth = foilUnprocessed.width;
    foilUnprocessedHeight = foilUnprocessed.height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = foilUnprocessedWidth;
    tempCanvas.height = foilUnprocessedHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;

    // Draw the image onto the canvas
    tempCtx.clearRect(0, 0, foilUnprocessedWidth, foilUnprocessedHeight);
    tempCtx.drawImage(foilUnprocessed, 0, 0);

    // Get the image data
    const imageData = tempCtx.getImageData(0, 0, foilUnprocessedWidth, foilUnprocessedHeight);
    const data = imageData.data;

    // Iterate through the pixel data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; // Red channel
      const g = data[i + 1]; // Green channel
      const b = data[i + 2]; // Blue channel

      // Check if the pixel is solid black (#000000)
      if (r === 0 && g === 0 && b === 0) {
        // Replace black with transparent color
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
    tempCtx.putImageData(imageData, 0, 0);

    // Once the image is loaded, draw it on the canvas
    await new Promise<void>((resolve) => {
      const dataURL = tempCanvas.toDataURL();
      foil = new Image();
      foil.src = dataURL;
      foil.onload = () => {
          if (!changingColor)
          {
            foilUploaded = true;
            activeWindow = 3;
            scaleRatioFoil = 1;
            rotationFoil = 0;
            if (foil){
              foilAspectRatio = foil.naturalWidth / foil.naturalHeight;
              initialFoilWidth = foil.naturalWidth; // Store original width
            }
            foilWidth = initialFoilWidth * scaleRatioFoil; // Apply initial scale
            foilX = Math.round(boxCoords[0]);
            foilY = Math.round(boxCoords[1]);
          }
          canvasRedraw();
          resolve();
      };
    });
    
	}

  function handleMatch(match: string)
  {
    if (match == "scaleitf")
    {
      scaleRatio = scaleRatioFoil;
      imgWidth = initialWidth * scaleRatio;
    }
    else if (match == "rotationitf")
      rotation = rotationFoil;
    else if (match == "positionitf")
    {
      imgX = foilX;
      imgY = foilY;
    }
    else if (match == "scalefti")
    {
      scaleRatioFoil = scaleRatio;
      foilWidth = initialFoilWidth * scaleRatioFoil;
    }
    else if (match == "rotationfti")
      rotationFoil = rotation;
    else if (match == "positionfti")
    {
      foilX = imgX;
      foilY = imgY;
    }

    canvasRedraw();
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

      if (resizeLT1)
        LT1size();

      if (resizeRT1)
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

    canvasRedraw();
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

    canvasRedraw();
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
    canvasRedraw();
  }

  function updateCustom() {
    for(let i = 0; i < $Circles.length; i++) {
      $CustomLayout[i].r = $Circles[i].r;
      $CustomLayout[i].enabled = $Circles[i].enabled;
      $CustomLayout[i].former = $Circles[i].former;
    }
  }

  function removeFoil(){
    foil = null;
    foilUploaded = false;
    foilFileName = 'No file chosen';
    foilFile = undefined;
    if (foilInput) foilInput.value = '';
    resetPosition();
    resetRotation();
    resetScale();
    canvasRedraw();
  }

  async function handleFoilColorChange() {
    changingColor = true;
    let foilRGBA = [0, 0, 0, 0];

    switch (selectedFoilColor) {
      case 'Silver Metallic':       foilRGBA = [100, 100, 100, 0.6];  foilLocation = (foilLocation == "" ? "above" : foilLocation); break;
      case 'Gold Metallic':         foilRGBA = [230, 200, 0, 0.4];    foilLocation = (foilLocation == "" ? "above" : foilLocation); break;
      case 'Copper Metallic':       foilRGBA = [200, 150, 60, 0.5];   foilLocation = "";  break;
      case 'Rose Gold Metallic':    foilRGBA = [220, 170, 170, 0.5];  foilLocation = "";  break;
      case 'Red Metallic':          foilRGBA = [180, 0, 0, 0.4];      foilLocation = "";  break;
      case 'Green Metallic':        foilRGBA = [0, 160, 0, 0.4];      foilLocation = "";  break;
      case 'Blue Metallic':         foilRGBA = [0, 0, 160, 0.4];      foilLocation = "";  break;
      case 'Dark Blue Metallic':    foilRGBA = [0, 0, 80, 0.6];       foilLocation = "";  break;
      case 'Violet Metallic':       foilRGBA = [80, 0, 80, 0.5];      foilLocation = "";  break;
      case 'Matte Silver Metallic': foilRGBA = [100, 100, 100, 0.6];  foilLocation = "";  break;
      case 'Satin Gold':            foilRGBA = [230, 200, 0, 0.4];    foilLocation = "";  break;
      case 'Satin Red':             foilRGBA = [180, 0, 0, 0.4];      foilLocation = "";  break;
      }

    foilR = foilRGBA[0];
    foilG = foilRGBA[1];
    foilB = foilRGBA[2];
    foilAlpha = foilRGBA[3];

    colorHex = rgbaToHex(foilR, foilG, foilB, foilAlpha);

    if (foilUploaded)
      await processFoil();
    
    canvasRedraw();
    changingColor = false;
  }

  function fillCanvas(){
    if (!foilCanvas || !foilCtx) return;

    foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);
    
    const oldComposite = foilCtx.globalCompositeOperation;
    
    // Fill entire canvas with selected color
    foilCtx.globalCompositeOperation = 'source-over';
    foilCtx.fillStyle = colorHex;
    foilCtx.fillRect(0, 0, foilCanvas.width, foilCanvas.height);
    
    foilCtx.globalCompositeOperation = oldComposite;
  }

  function handleVisibleLayers(layer: number)
  {
    if (ButtonToggle && layer == 0)
      ButtonToggle = false;

    visibleLayers[layer] = !visibleLayers[layer];
    canvasRedraw();
  }
  
  //--------------------------------------------------- SHOPIFY FUNCTIONALITY SECTION -------------------------------------------------------------------------------

  import { uploadPdfToS3 } from '$lib/s3';
  import { createShopifyOrder } from '$lib/shopify';

  let generating = $state(false);
  let orderCreated = $state(false);
  let checkoutUrl = $state('');

  async function handlePurchase() {
    generating = true;
    
    try {
      const pdf = await generatePdf();

      const dataUri = pdf.output('datauristring');
      const pdfBlob = dataUriToBlob(dataUri);
      
      // 2. Upload to cloud storage
      const pdfUrl = await uploadPdfToS3(pdfBlob, 'custom-art-print');
      console.log('Upload successful, URL:', pdfUrl);

      let printData = `no foil or holographic`;
    
      if (foilUploaded || fullFoilEnabled)
        printData = (fullFoilEnabled ? `full foil` : `spot foil`) + `,`
        + selectedFoilColor
        + (foilLocation == "" ? `` : `,foil ` + foilLocation + ` printed image`);
      else if (fullHoloEnabled)
        printData = `full holographic print`;
      
      // 3. Create Shopify order with additional metadata
      const result = await createShopifyOrder(
        pdfUrl,
        'gid://shopify/ProductVariant/' + import.meta.env.VITE_SHOPIFY_VARIANT_ID,
        'josh@limitlabs.com',
        {
          // Additional metadata for flow email
          print_instructions: printData,
        }
      );
      
      checkoutUrl = result.checkoutUrl;
      orderCreated = true;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      generating = false;
    }
  }

  function dataUriToBlob(dataUri: string): Blob {
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  }

  async function generatePdf(): Promise<jsPDF> {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in', // Use inches instead of pixels
      format: [18, 12], // 18" x 12" directly
      compress: true  // Enable PDF compression
    });

    if (!rectangleCanvas || !imageCanvas || !foilCanvas) return pdf;
    
    let oldSizes = [rectangleCanvas.width, rectangleCanvas.height, imageCanvas.width, imageCanvas.height, foilCanvas.width, foilCanvas.height];

    rectangleCanvas.width = 5400;
    rectangleCanvas.height = 3600;
    imageCanvas.width = 5400;
    imageCanvas.height = 3600;
    foilCanvas.width = 5400;
    foilCanvas.height = 3600;

    const addCanvasToPDF = async (canvas: HTMLCanvasElement, label: string) => {
      const format = 'PNG';
      
      const imgData = canvas.toDataURL(`image/${format}`);
      pdf.addImage(imgData, format, 0, 0, 18, 12, undefined, 'FAST');
      
      if (label) {
        pdf.setFontSize(12);
        pdf.text(label, 10, 20);
      }
    };
    
    ButtonToggle = false;
    let previousVisibleLayers = [visibleLayers[0], visibleLayers[1], visibleLayers[2]];

    exporting = true;
    visibleLayers[0] = true;
    visibleLayers[1] = false;
    visibleLayers[2] = false;
    canvasRedraw();
    await addCanvasToPDF(rectangleCanvas, '');
    
    pdf.addPage();

    visibleLayers[0] = false;
    visibleLayers[1] = true;
    visibleLayers[2] = false;
    canvasRedraw();
    await addCanvasToPDF(imageCanvas, '');
    pdf.addPage();

    visibleLayers[0] = false;
    visibleLayers[1] = false;
    visibleLayers[2] = true;
    canvasRedraw();
    await addCanvasToPDF(foilCanvas, '');

    exporting = false;

    rectangleCanvas.width = oldSizes[0];
    rectangleCanvas.height = oldSizes[1];
    imageCanvas.width = oldSizes[2];
    imageCanvas.height = oldSizes[3];
    foilCanvas.width = oldSizes[4];
    foilCanvas.height = oldSizes[5];

    visibleLayers = [previousVisibleLayers[0], previousVisibleLayers[1], previousVisibleLayers[2]];
    canvasRedraw();

    return pdf;
  }


</script>

<div class="tab-container"
style:top={tabPosition}px>

{#if popoutWindow}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => (popoutWindow = helpWindowHover ? popoutWindow : false)}>
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style:width=1000px>
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
      style:background=#e8e6e3
      onclick={() => popoutWindow = false} />
      <HelpWindow />
      <button onclick={() => (popoutWindow = false)} class="close-button"
      style:margin-top=28px>
        Done
      </button>
    </div>
  </div>
{/if}

<!-- Layout Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'layout'}
       style:width={activeTab === 'layout' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('layout')} style:background=#d5022f>Layout</span>

    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition}px>
    
      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">
        
          <h1 style:margin-bottom=12px>Layout Settings</h1>

        </div>

        <div class="right-items">

          {#if selectedDevice !== ""}

            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img src={visibleLayers[0] ? eye_1 : eye_0} alt="Visible?" class="layer-icon"
            onclick={() => handleVisibleLayers(0)} />

          {/if}

        </div>

      </div>

      <!-- Layout dropdown -->
      <select bind:value={deviceBox1Select}
        style:margin=0px
        style:margin-top=8px
        style:margin-bottom=8px
        style:margin-left=1px
        onchange={() => handleDeviceChange(1)}>
        <option value="" disabled selected>Select a device</option>
        {#each deviceBox1Contents as device}
          <option value={device}>{device}</option>
        {/each}
      </select>

      {#if selectedDevice === "Glyph"}

      <br>

      <CustomDropdown
        functionLT={LT1size}
        functionRT={RT1size}
        functionBT={handleButtonToggleClick}
        tooltipToggle={tooltipToggle}
        handleLayoutChange={handleLayoutChange}
        bind:selectedButtonLayout
        bind:LT1Toggle
        bind:RT1Toggle
        bind:ButtonToggle
      />

      {/if}

      {#if deviceBox2}
      <br>
        <select bind:value={deviceBox2Select}
          style:margin=0px
          style:margin-bottom=8px
          style:margin-left=1px
          onchange={() => handleDeviceChange(2)}>
          <option value="" disabled selected>{deviceBox2Default}</option>
          {#each deviceBox2Contents as content}
            <option value={content}>{content}</option>
          {/each}
        </select>
      {/if}

      {#if deviceBox3}
      <br>
        <select bind:value={deviceBox3Select}
          style:margin=0px
          style:margin-bottom=8px
          style:margin-left=1px
          onchange={() => handleDeviceChange(3)}>
          <option value="" disabled selected>{deviceBox3Default}</option>
          {#each deviceBox3Contents as content}
            <option value={content}>{content}</option>
          {/each}
        </select>
      {/if}

    </div>
    </div>
  </div>

  <!-- Image Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'image'}
       style:width={activeTab === 'image' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('image')}>Image</span>

    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition}px>
    
      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">
        
          <h1 style:margin-bottom=12px>Image Settings</h1>

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
          style:margin-top="-8px"
          style:margin-left="-8px"
          style:display="flex"
          />

        </div>

        <div class="right-items">

        {#if imageUploaded}

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <img src={visibleLayers[1] ? eye_1 : eye_0} alt="Visible?" class="layer-icon"
          onclick={() => handleVisibleLayers(1)} />

        {/if}

        </div>

      </div>

      <div class="file-input-wrapper">
        <button type="button" class="custom-button"
        style="white-space: nowrap;
              margin-bottom: 8px;">
          Select image file
        </button>
        <input type="file" onchange={handleImageUpload}
        class="file-input"
        accept="image/*" />
      </div>

      {#if imageUploaded}

      <!-- {#if lockedLayers[1] || !visibleLayers[1]}
        <div transition:fade="{{ duration: 100 }}" class="lock-overlay"></div>
      {/if} -->
      
      <div class="settings-section"
      style="margin-top: 10px;">
      
        <!-- Scale controls -->
        <label class="scale">
          <div style="padding-right: 6px;">Scale: </div>
          <input
            type="range"
            bind:value={scaleRatio}
            min={minScale}
            max={maxScale}
            step="0.01"
            oninput={handleScaleChange}
          />
          <input class="number-input"
            type="number"
            bind:value={scaleRatio}
            min={minScale}
            max={maxScale}
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
        
        <div style:display="flex">
          <!-- Reset scale button -->
          <button onclick={resetScale}
          class="sub-button"
          onmouseenter={() => tooltipToggle("resetimagescale")}
          onmouseleave={() => tooltipToggle("")}>
            Reset
          </button>
          {#if tooltip === "resetimagescale"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}

          {#if foilUploaded && !fullFoilEnabled}
            <button onclick={() => handleMatch("scaleitf")}
            class="sub-button"
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
        </div>

      </div>

      <div class="settings-section">

      <!-- Rotation controls -->
      <label class="scale">
        <div style="padding-right: 6px;">Rotation: </div>
        <input
          type="range"
          bind:value={rotationDegrees}
          min={minRotation}
          max={maxRotation}
          step="0.01"
          oninput={handleRotationChange}
        />
        <input class="number-input"
          type="number" 
          bind:value={rotationDegrees}
          min={minRotation}
          max={maxRotation}
          step="0.1"
          oninput={handleRotationChange}
        />
      </label>

      <!-- <button class="alignment-button" style:margin-left="8px" onclick={() => handleRotationClick("left")}>↶</button>
      <button class="alignment-button" onclick={() => handleRotationClick("right")}>↷</button><br> -->

      <div style:display="flex">
        <!-- Reset rotation button -->
        <button onclick={resetRotation}
        onmouseenter={() => tooltipToggle("resetimagerotation")}
        onmouseleave={() => tooltipToggle("")}
        class="sub-button">
          Reset
        </button>
        {#if tooltip === "resetimagerotation"}
          <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
            {tooltipMessage}
          </div>
        {/if}

        {#if foilUploaded && !fullFoilEnabled}
          <button onclick={() => handleMatch("rotationitf")}
          onmouseenter={() => tooltipToggle("matchfoilrotation")}
          onmouseleave={() => tooltipToggle("")}
          class="sub-button">
            Match Foil
          </button>
          {#if tooltip === "matchfoilrotation"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}
        {/if}
      </div>

      </div>

      <div class="settings-section">

      <!-- Position Controls -->
      <label class="scale"
      style="margin-bottom: 2px;">
        <div style="padding-right: 6px;">Position: </div>
        <input class="number-input"
            type="number"
            bind:value={imgX}
            step="1"
            oninput={() => canvasRedraw()}
          />

        <input class="number-input"
          type="number"
          bind:value={imgY}
          step="1"
          oninput={() => canvasRedraw()}
        />
      </label>
      
      <div style:display="flex">
        <!-- Reset Position button -->
        <button onclick={resetPosition}
        onmouseenter={() => tooltipToggle("resetimageposition")}
        onmouseleave={() => tooltipToggle("")}
        class="sub-button">
          Reset
        </button>
        {#if tooltip === "resetimageposition"}
          <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
            {tooltipMessage}
          </div>
        {/if}

        {#if foilUploaded && !fullFoilEnabled}
          <button onclick={() => handleMatch("positionitf")}
          onmouseenter={() => tooltipToggle("matchfoilposition")}
          onmouseleave={() => tooltipToggle("")}
          class="sub-button">
            Match Foil
          </button>
          {#if tooltip === "matchfoilposition"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}
        {/if}
      </div>

      </div>

      <div class="settings-section">

      <!-- {#if selectedDevice !== ''} -->
        <h2 style="margin-bottom: 6px">Alignment:

          {#if tooltip === "imagebestfit"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}
          <button class="alignment-button" style:margin-left="4px" onclick={() => handleAlignment("image", "UL")}>↖</button>
          <button class="alignment-button" onclick={() => handleAlignment("image", "UM")}>↑</button>
          <button class="alignment-button" onclick={() => handleAlignment("image", "UR")}>↗</button>
          <button onclick={() => handleBestFit()}
            onmouseenter={() => tooltipToggle("imagebestfit")}
            onmouseleave={() => tooltipToggle("")}
            class="alignment-button"
            style="display: inline-flex;
                  width: 0;
                  min-width: min-content;
                  min-height: min-content;
                  white-space: nowrap;
                  margin-left: 12px;
                  font-weight: bold;">
              Best Fit
            </button><br>
          <button class="alignment-button" style:margin-left="84px" onclick={() => handleAlignment("image", "L")}>←</button>
          <button class="alignment-button" onclick={() => handleAlignment("image", "M")}>○</button>
          <button class="alignment-button" onclick={() => handleAlignment("image", "R")}>→</button><br>
          <button class="alignment-button" style:margin-left="84px" onclick={() => handleAlignment("image", "DL")}>↙</button>
          <button class="alignment-button" onclick={() => handleAlignment("image", "DM")}>↓</button>
          <button class="alignment-button" onclick={() => handleAlignment("image", "DR")}>↘</button>
        </h2>

      </div>
        
      <div class="settings-section">

      <!-- Image smoothing dropdown -->
      <div style="display: flex; margin-top: 8px; margin-left: -8px;">
          <select bind:value={selectedSmoothingOption}
          onchange={handleSmoothingChange}>
            {#each SmoothingOptions as option}
              <option value={option}>{option}</option>
            {/each}
          </select>


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
        style:margin-top="14px"
        style:margin-left="0px"
        />
      </div>

      </div>

      {/if}

    </div> 
  </div>
</div>

  <!-- Foil Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'foil'}
       style:width={activeTab === 'foil' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('foil')} style:background=#232e41>Foil</span>
    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition}px
    style:min-height=94px>

      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">

          <h1 style:margin-bottom=8px>Foil Settings</h1>
          {#if tooltip === "foildescription"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={info} class="tooltip-icon" alt="Image placement info"
          onmouseenter={() => tooltipToggle("foildescription")}
          onmouseleave={() => tooltipToggle("")}
          style:margin-top="-8px"
          style:margin-left="-8px"
          />

        </div>
        
        <div class="right-items">

        {#if foilUploaded || fullFoilEnabled || fullHoloEnabled}

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <img src={visibleLayers[2] ? eye_1 : eye_0} alt="Visible?" class="layer-icon"
          onclick={() => handleVisibleLayers(2)} />

        {/if}

        </div>

      </div>

      <div class="full-foil-control"
      style:margin-top=6px
      style:color={fullFoilEnabled ? "#b5bbc0" : "white"}>
        <label>
          <input 
            type="checkbox" 
            bind:checked={fullHoloEnabled}
            onchange={() => { 
              FullHoloImg.src = HolographicSrc;
              FullHoloImg.onload = () => {
                canvasRedraw();
              };
            }}
            disabled={fullFoilEnabled}
          />
          Full Holographic Print
        </label>
      </div>

      

      <div class="full-foil-control"
      style:margin-top=6px
      style:color={fullHoloEnabled ? "#b5bbc0" : "white"}>
        <label>
          <input 
            type="checkbox" 
            bind:checked={fullFoilEnabled}
            onchange={() => canvasRedraw()}
            disabled={fullHoloEnabled}
          />
          Full Foil Print
        </label>
      </div>

      {#if !fullFoilEnabled && !fullHoloEnabled}

        <div class="file-input-wrapper">
          <button type="button" class="custom-button"
          style="white-space: nowrap;
                margin-top: 16px;
                margin-bottom: 8px;">
            Select foil file
          </button>
          <input type="file" bind:this={foilInput} onchange={handleFoilUpload}
          class="file-input"
          accept="image/*" />
        </div>

      {/if}

      {#if foilUploaded || fullFoilEnabled}

      <div class="settings-section"
      style="margin-top: 16px;
      padding-top: 2px;">

        <!-- Foil color dropdown -->
        <div style:display="flex"
        style:margin-bottom=-16px>
          <h2 style="padding-top: 7px;">Foil Color: </h2>
          <select bind:value={selectedFoilColor}
          onchange={handleFoilColorChange}>
            {#each FoilColors as color}
              <option value={color}>{color}</option>
            {/each}
          </select>
        </div>
            
        
        
        <div style:display="flex"
        style:margin-top="12px">
          {#if selectedFoilColor === "Silver Metallic" || selectedFoilColor === "Gold Metallic"}
            <h2 style="padding-top: 7px;">Foil Location: </h2>
            <select bind:value={foilLocation}>
              <option value={"above"}>Foil Above Image</option>
              <option value={"below"}>Foil Below Image</option>
            </select>
          

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
          style:margin-top="14px"
          style:margin-left="0px"
          />
          {/if}
        </div>

        </div>
        
      {/if}

      {#if foilUploaded && !fullFoilEnabled}

      <div class="settings-section">

        <!-- Scale controls -->
        <label class="scale">
          <div style="padding-right: 6px;">Scale: </div>
          <input
            type="range"
            bind:value={scaleRatioFoil}
            min={minScale}
            max={maxScale}
            step="0.01"
            oninput={handleScaleChange}
          />
          <input class="number-input"
            type="number"
            bind:value={scaleRatioFoil}
            min={minScale}
            max={maxScale}
            step="0.01"
            oninput={handleScaleChange}
          />
          <!-- {#if tooltip === "foilscale"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if} -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- <img src={info} class="tooltip-icon" alt="Scale info"
          onmouseenter={() => tooltipToggle("foilscale")}
          onmouseleave={() => tooltipToggle("")}
          /> -->
        </label>
        
        <div style:display="flex">
          <!-- Reset scale button -->
          <button onclick={resetScale}
          class="sub-button"
          onmouseenter={() => tooltipToggle("resetfoilscale")}
          onmouseleave={() => tooltipToggle("")}>
            Reset
          </button>
          {#if tooltip === "resetfoilscale"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}

          {#if imageUploaded}
            <button onclick={() => handleMatch("scalefti")}
            class="sub-button"
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
        </div>

      </div>

      <div class="settings-section">

        <!-- Rotation controls -->
        <label class="scale">
          <div style="padding-right: 6px;">Rotation: </div>
          <input
            type="range"
            bind:value={rotationFoilDegrees}
            min={minRotation}
            max={maxRotation}
            step="0.01"
            oninput={handleRotationChange}
          />
          <input class="number-input"
            type="number" 
            bind:value={rotationFoilDegrees}
            min={minRotation}
            max={maxRotation}
            step="0.1"
            oninput={handleRotationChange}
          />
        </label>

        <!-- <button class="alignment-button" style:margin-left="8px" onclick={() => handleRotationClick("left")}>↶</button>
        <button class="alignment-button" onclick={() => handleRotationClick("right")}>↷</button><br> -->

        <div style:display="flex">
          <!-- Reset rotation button -->
          <button onclick={resetRotation}
          onmouseenter={() => tooltipToggle("resetfoilrotation")}
          onmouseleave={() => tooltipToggle("")}
          class="sub-button">
            Reset
          </button>
          {#if tooltip === "resetfoilrotation"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}

          {#if imageUploaded}
            <button onclick={() => handleMatch("rotationfti")}
            onmouseenter={() => tooltipToggle("matchimagerotation")}
            onmouseleave={() => tooltipToggle("")}
            class="sub-button">
              Match Image
            </button>
            {#if tooltip === "matchimagerotation"}
              <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
                {tooltipMessage}
              </div>
            {/if}
          {/if}
        </div>

      </div>

      <div class="settings-section">

        <!-- Position Controls -->
        <label class="scale"
        style="margin-bottom: 2px;">
          <div style="padding-right: 6px;">Position: </div>
          <input class="number-input"
              type="number"
              bind:value={foilX}
              step="1"
              oninput={() => canvasRedraw()}
            />

          <input class="number-input"
            type="number"
            bind:value={foilY}
            step="1"
            oninput={() => canvasRedraw()}
          />
        </label>
        
        <div style:display="flex">
          <!-- Reset Position button -->
          <button onclick={resetPosition}
          onmouseenter={() => tooltipToggle("resetfoilposition")}
          onmouseleave={() => tooltipToggle("")}
          class="sub-button">
            Reset
          </button>
          {#if tooltip === "resetfoilposition"}
            <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
              {tooltipMessage}
            </div>
          {/if}

          {#if imageUploaded}
            <button onclick={() => handleMatch("positionfti")}
            onmouseenter={() => tooltipToggle("matchimageposition")}
            onmouseleave={() => tooltipToggle("")}
            class="sub-button">
              Match Image
            </button>
            {#if tooltip === "matchimageposition"}
              <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
                {tooltipMessage}
              </div>
            {/if}
          {/if}
        </div>

      </div>
        
        <button onclick={removeFoil}
        onmouseenter={() => tooltipToggle("removefoil")}
        onmouseleave={() => tooltipToggle("")}
        style="margin-top: 8px;
              margin-bottom: 8px;">
        Remove Foil
        </button>
        {#if tooltip === "removefoil"}
          <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
            {tooltipMessage}
          </div>
        {/if}

      {/if}

    </div>
    </div>
  </div>

  <!-- Export Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'export'}
       style:width={activeTab === 'export' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('export')} style:background=#0e6506>Export</span>

    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition}px>
    
      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">
        
          <h1 style:margin-bottom=12px>Export Options</h1>

        </div>

      </div>

      <button onclick={exportLayout} class="buttonToggle"
        disabled={isExporting || selectedDevice === ""}
        onmouseenter={() => tooltipToggle("exportlayout")}
        onmouseleave={() => tooltipToggle("")}
        style:margin-left=0px>
          Export Layout to Image
      </button>
      {#if tooltip === "exportlayout"}
        <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
          {tooltipMessage}
        </div>
      {/if}

      <button class="buttonToggle" onclick={exportToPDF}
        disabled={!imageUploaded || selectedDevice === ""}>
        Export to PDF
      </button>

    </div>
    </div>

  </div>

  <!-- Help Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
    style:width={tabWidth}px>
  <span class="tab-label" onclick={() => popoutWindow = true}
    style:transform=rotate(0deg)>
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src={info} class="tooltip-icon" alt="Image placement info"
    style:margin-top=14px
    style:margin-right=2px
    style:width=28px
    style:height=28px
    />
  </span>

  </div>
</div>

<div class="top-bar"
  bind:this={topBar}
  style:width={windowWidth}px
  style:height={topBarHeight}px>
  
  <!-- Left-aligned items -->
  <div class="left-items">
    <div style:width=56px
      style:min-width=56px
      style:padding=8px
      style:vertical-align=middle>
      <Customicon name="LL Logomark Offwhite" style="h-full w-full" alt={'Limit Labs logo'} />
    </div>

  </div>

  <!-- Right-aligned item -->
  <div class="right-items">

    {#if tooltip === "exportbuttons"}
      <div class="tooltip" transition:fade="{{ duration: 100 }}" style="transform: translateX({tooltipX}px) translateY({tooltipY}px)">
        {tooltipMessage}
      </div>
    {/if}

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src={info} class="tooltip-icon" alt="Image placement info"
    onmouseenter={() => tooltipToggle("exportbuttons")}
    onmouseleave={() => tooltipToggle("")}
    style:margin-top=0px
    style:margin-right=6px
    style:width=26px
    style:height=26px
    />

    {#if !orderCreated}

    <button class="buttonToggle" onclick={handlePurchase} disabled={generating || !imageUploaded || !deviceCovered || selectedDevice === ""}>
      {generating ? 'Generating PDF and Creating Order...' : 'Purchase Print'}
    </button>

    {:else}

      <a href={checkoutUrl} target="_blank" class="buttonToggle">
        Complete Your Purchase on Shopify
      </a>

    {/if}
    
  </div>
</div>

<div class="canvas-container"
style="width={canvasWidth}px; height={canvasHeight}px; place-items: center;
  margin-left: {activeTab ? (expandedWidth + (canvasLeft ? canvasLeft : 0)) + 'px' : canvasLeft + 'px'}; transition: margin-left 0.3s ease;">
  <canvas bind:this={imageCanvas}
  class="canvas-layer imageLayer"
  width={canvasWidth}
  height={canvasHeight}
  ></canvas>
  <canvas bind:this={foilCanvas}
  class="canvas-layer foilLayer"
  width={canvasWidth}
  height={canvasHeight}
  ></canvas>
  <canvas bind:this={rectangleCanvas}
  class="canvas-layer rectangleLayer"
  style="touch-action: {((activeWindow == 2 && visibleLayers[1]) || (activeWindow == 3 && visibleLayers[2])) ? 'none' : 'auto'};"
  width={canvasWidth}
  height={canvasHeight}
  onmousedown={handleMouseDown}
  ontouchstart={handleMouseDown}
  onmousemove={handleMouseMove}
  ontouchmove={handleMouseMove}
  onmouseup={handleMouseUp}
  ontouchend={handleMouseUp}
  onmouseleave={handleMouseUp}
  ontouchcancel={handleMouseUp}
  onclick={handleClick}
  ></canvas>
</div>

<style>

  .canvas-container {
    display: flex;
    justify-content: left;  /* Horizontal alignment */
    align-items: center;     /* Vertical centering */
    margin: 0 auto;         /* Horizontal centering for the container itself */
    padding: 0;
    overflow: visible;
    height: calc(100vh - 62px); /* Make container fill available vertical space */
    position: absolute;
  }

  canvas {
    border: 1px solid #ccc; /* Optional: visual boundary */
    -webkit-user-select: none; /* Prevents text selection */
    user-select: none;
  }

  .canvas-layer {
    position: absolute;
  }

  .imageLayer { z-index: 1; }
  .foilLayer { z-index: 2; }
  .rectangleLayer { z-index: 3; }

  .top-bar {
    display: flex;
    min-width: min-content;
    white-space: nowrap;
    justify-content: space-between; /* Pushes left and right items to edges */
    align-items: center;
    gap: 3rem;
    border-bottom-width: 1px;
    --tw-border-opacity: 1;
    border-color: rgb(15 23 42 / var(--tw-border-opacity, 1));
    --tw-bg-opacity: 1;
    background-color: rgb(30 41 59 / var(--tw-bg-opacity, 1));
    padding: 1rem;
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  .left-items {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .right-items {
    display: flex;
    align-items: center;
  }

  .buttonToggle {
    padding: 10px 16px;
    border: 1px solid #303436;
    margin: 8px;
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
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

  .file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 120px;
    height: 40px;
    opacity: 0;
    cursor: pointer;
  }

  h1 {
    color: #e8e6e3;
    font-size: 1.6em;
  }

  h2 {
    margin-top: 8px;
    color: #e8e6e3;
  }

  .tab-container {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 100;
  }

  .tab {
    background: #2c3e50;
    color: white;
    height: 72px;
    overflow: hidden;
    cursor: pointer;
    transition: width 0.3s ease;
    display: flex;
    border-radius: 0 8px 8px 0;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  }

  .tab.expanded {
    height: auto;
  }

  .tab-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    padding: 8px 4px;
    transform: rotate(180deg);
    min-width: 40px;
    text-align: center;
    background: #34495e;
    font-weight: bold;
  }

  .tab-content {
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
    padding: 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 8px;
    cursor: default;
  }

  .tab-content button {
    padding: 8px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .tooltip-icon {
    width: 24px;
    height: 24px;
    padding: 2px;
    margin-left: 4px;
    cursor: pointer;
  }

  /* .tooltip-wrapper {
    position: relative;
  } */
  
  .tooltip {
    position: absolute;
    background: #333;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 100;
    width: max-content;
    white-space: normal;
    max-width: 200px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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

  .number-input {
    height: 36px;
    width: 5.5em;
  }

  input[type="range"] {
    width: 110px; /* Set the desired width of the slider */
    margin: 0;
    padding: 0;
  }

  .scale{
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
    margin-bottom: -4px;
  }

  .sub-button {
    display: inline-flex;
    width: 0;
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap; /* Prevents text wrapping */
    font-size: 12px;
    font-weight: bold;
    margin-right: 8px;
    margin-bottom: 2px;
    background: #3498db;
    color: white;
    cursor: pointer;
  }

  .alignment-button{
    width: 26px;
    text-align: middle;
    padding: 0px 0px;
    border: 1px solid #303436;
    margin: 0px;
    margin-right: 0px;
    margin-left: -6px;
    margin-bottom: -6px;
    cursor: pointer;
    font-size: 14px;
    color: #e8e6e3;
    transition: background-color 0.3s ease;
    cursor: pointer;
  }

  .scrollable-content {
    overflow-y: auto;
    overflow-x: hidden; 
    padding-right: 8px; /* Prevent content from touching scrollbar */
  }

  /* Custom scrollbar styling */
  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }

  .scrollable-content::-webkit-scrollbar-track {
    background: #2c3e50;
  }

  .scrollable-content::-webkit-scrollbar-thumb {
    background: #3498db;
    border-radius: 3px;
  }

  .settings-section{
    display: flex;
    width: 100%;
    flex-direction: column;
    border-radius: 8px;
    border-color: #475569;
    background-color: #1e293b;
    padding-left: 16px;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }

  .layer-icon {
    display: flex;
    align-items: center;
    width: 32px;
    height: 28px;
    padding: 4px;
    margin-top: -8px;
    cursor: pointer;
    border: 1px solid #ababab;
    border-radius: 4px;
  }

  .buttonToggle:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #222;
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

</style>