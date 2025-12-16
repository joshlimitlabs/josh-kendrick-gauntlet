<script lang='ts'>
  import { onMount, tick } from "svelte";
  // import Customicon from './customicon.svelte';
  import { updateDeviceInfo } from './CustomDevices';
  import { type Circle, Circles, CustomLayout, Layouts, Tooltips } from "./objStore";
  import { jsPDF } from 'jspdf';
  import { fade } from 'svelte/transition';
  import info from '$lib/assets/info.png';
  import eye_0 from '$lib/assets/eye_0.png';
  import eye_1 from '$lib/assets/eye_1.png';
  import foiltutorial1 from '$lib/assets/foiltutorial1.png';
  import foiltutorial2 from '$lib/assets/foiltutorial2.png';
  import limitlabslogo from '$lib/assets/LL+Logo+Horizontal+White.png';
  // import { rgbaToHex } from '$lib/utils';
  import CustomDropdown from './CustomDropdown.svelte';
  import holo_Crystal from '$lib/assets/holographics/crystal.png';
  import holo_Glitter from '$lib/assets/holographics/glitter.png';
  import holo_HyperPlaid from '$lib/assets/holographics/hyperplaid.png';
  import holo_Milkyway from '$lib/assets/holographics/milkyway.png';
  import holo_Mosaic from '$lib/assets/holographics/mosaic.png';
  import holo_Ripple from '$lib/assets/holographics/ripple.png';
  import holo_Sparkle from '$lib/assets/holographics/sparkle.png';
  import holo_Star from '$lib/assets/holographics/star.png';
  import holo_Stardust from '$lib/assets/holographics/stardust.png';
  import HelpWindow from './HelpWindow.svelte';
  import rainbowFoil from '$lib/assets/foil/rainbow_metallic.png';
  import silverFoil from '$lib/assets/foil/silver_metallic.png';
  import goldFoil from '$lib/assets/foil/gold_metallic.png';
  import roseGoldFoil from '$lib/assets/foil/rose_gold_metallic.png';
  import redFoil from '$lib/assets/foil/red_metallic.png';
  import blueFoil from '$lib/assets/foil/blue_metallic.png';
  import fullWhite from '$lib/assets/foil/full_white.png';
  import fullHolo_Sparkle from '$lib/assets/holographics/full/sparkle.png';
  import fullHolo_Crystal from '$lib/assets/holographics/full/crystal.png';
  import fullHolo_Milkyway from '$lib/assets/holographics/full/milkyway.png';
  import fullHolo_Star from '$lib/assets/holographics/full/star.png';
  import fullHolo_Mosaic from '$lib/assets/holographics/full/mosaic.png';
  import fullHolo_Hyperplaid from '$lib/assets/holographics/full/hyperplaid.png';
  import fullHolo_Stardust from '$lib/assets/holographics/full/stardust.png';
  import fullHolo_Streamoflight from '$lib/assets/holographics/full/streamoflight.png';
  import fullHolo_Ripple from '$lib/assets/holographics/full/ripple.png';
  import fullHolo_Glitter from '$lib/assets/holographics/full/glitter.png';
  import fullHolo_CrackedIce from '$lib/assets/holographics/full/crackedice.png';
  import plexiglassImg from '$lib/assets/plexiglass.png';

  let rectangleCanvas = $state<HTMLCanvasElement>();
  let rectangleCtx: CanvasRenderingContext2D | null;

  let imageCanvas = $state<HTMLCanvasElement>();
  let imageCtx: CanvasRenderingContext2D | null;

  let foilCanvas = $state<HTMLCanvasElement>();
  let foilCtx: CanvasRenderingContext2D | null;
  let foilFile = $state<File | undefined>(undefined);
  let foilInput = $state<HTMLInputElement>();
  let foil = $state<HTMLImageElement | null>(null);

  let underCanvas = $state<HTMLCanvasElement>();
  let underCtx: CanvasRenderingContext2D | null;

  let holoCanvas = $state<HTMLCanvasElement>();
  let holoCtx: CanvasRenderingContext2D | null;

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
  let imgAspectRatio = 1; // will be updated when image loads
  let imgWidth = $state(0);
  let imgHeight = $state(0);
  let imgX = $state(0);
  let imgY = $state(0);
  let isDragging = false;
  let activeCorner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | null = null;
  const margin = 30;
  const cornerRadius = 36;

  let scaleRatio = $state(1); // 1 = 100% scale
  let windowAspectRatio = $state(1);
  const minScale = 0.1;
  const maxScale = 20;
  let initialWidth = $state(0);
  let initialHeight = $state(0);

  let offsetX = 0;
  let offsetY = 0;
  let isMoving = false;
  
  let rotation = $state(0); // in radians
  let rotationDegrees = $state(0); // in degrees
  const minRotation = -180;
  const maxRotation = 180;
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
  // const deviceBox1Contents = ['Glyph', 'Agetec', 'ASI LVL', 'BNB Fightstick', 'Brook', 'Etokki', 'GuileKeys', 'Haute42', 'Hit Box', 'Hori', 'Junkfood Custom Arcades',
  // 'Overdrive Arcade', 'PDP', 'PowerA', 'Qanba', 'SEGA', 'Slab', 'Universal Arcade Stick Panel' ];
  const deviceBox1Contents = ['Limit Labs', 'Arcade Shock', 'Arcade Sticks Indonesia', 'Buttercade', 'DuelPad', 'Haute42', 'Hit Box', 'Hori',
  'Junkfood Custom Arcades', 'Katsugear', 'Mavercade', 'MixBox', 'Nacon', 'Prong', 'Qanba', 'Razer', 'TR Fightsticks' ];

  let deviceMaskImg = $state<HTMLImageElement>(new Image());
  let deviceFullImg = $state<HTMLImageElement>(new Image());
  let devicePrintImg = $state<HTMLImageElement>(new Image());
  const lineColor = "#7f849c";
  let ButtonToggle = $state(false);
  let oldCircles = $state($Circles);
  let buttonHover = "";
  let glyphShiftX = 0;
  let glyphShiftY = 0;

  let exporting = false;
  let visibleLayers = $state([true, true, true]);

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
  let scaleRatioFoil = $state(1); // initial scale factor
  let rotationFoil = $state(0); // initial rotation angle in radians
  let rotationFoilDegrees = $state(0); // in degrees
  let foilAspectRatio = 1;
  let foilWidth = $state(0);
  let foilHeight = $state(0);
  let initialFoilWidth = 100;

  let foilR = $state(0);  // 0-255
  let foilG = $state(0);
  let foilB = $state(0);
  let foilAlpha = $state(0); // alpha (0-1)
  const UnderprintPrice = "$4.05";
  const HoloPrice = "$4.05";

  // const FoilColors = ['Silver Metallic', 'Gold Metallic', 'Copper Metallic', 'Rose Gold Metallic', 'Red Metallic', 'Green Metallic', 'Blue Metallic', 'Dark Blue Metallic',
  //                     'Violet Metallic', 'Matte Silver Metallic', 'Satin Gold', 'Satin Red'];
  // const FoilColorsLimited = ['No Foil Underprint Layer', 'Rainbow Metallic', 'Silver Metallic', 'Gold Metallic'];
  // const HolographicList = ['No Holographic Pattern', 'Stardust', 'Ripple', 'Mosaic', 'Sparkle', 'Crystal', 'Glitter', 'Hyper Plaid', 'Milkyway', 'Star'];
  const FoilColors = ['Silver Metallic', 'Gold Metallic', 'Rose Gold Metallic', 'Red Metallic', 'Blue Metallic'];
  const FoilColorsLimited = ['No Foil Underprint Layer', 'Rainbow Metallic (+' + UnderprintPrice + ')', 'Silver Metallic (+' + UnderprintPrice + ')', 'Gold Metallic (+' + UnderprintPrice + ')'];
  const HolographicList = ['No Holographic Pattern', 'Stardust (+' + HoloPrice + ')', 'Ripple (+' + HoloPrice + ')', 'Sparkle (+' + HoloPrice + ')',
                           'Glitter (+' + HoloPrice + ')', 'Stream of Light (+' + HoloPrice + ')', 'Cracked Ice (+' + HoloPrice + ')'];
  // let colorHex = $state("#646464FF");
  let colorHexUnder = $state("#646464FF");
  let selectedFoilColor: string = $state(FoilColors[0]);
  let selectedUnderprint: string = $state('');
  let selectedHoloPattern: string = $state(HolographicList[0]);
  let selectedHoloImg: string = $state(holo_Stardust);
  let fullFoilEnabled = $state(false);
  let fullHoloEnabled = $state(false);
  let noFoilOrHolo = $state(false);
  let FullHoloImg = new Image();

  let foilFileName = $state('No file chosen');
  // let foilLocation = $state("above");

  let activeTab =  $state<'layout' | 'image' | 'foil' | 'export' | null>(null);
  const tabWidth = 40; // width of closed tabs
  const expandedWidth = 410; // tab width when expanded
  const tabPosition = 84; // position of top tab
  let maxTabHeight = $state(0); // maximum height before scrolling

  let selectedButtonLayout: string = $state('');
  const ButtonLayouts = ['Full', 'FGC', 'Split FGC', 'Platform Fighter', 'Custom'];
  let LT1Toggle = $state(false);
  let RT1Toggle = $state(false);
  let changingColor = false;

  let isExporting = $state(false);

  const minPageWidth = 1024;
  let deviceCovered = $state(false);
  let tutorialWindow = $state(false);
  let foilTutorialWindow = $state(false);
  let disclaimerWindow = $state(false);
  let disclaimerState = $state(0);
  // let disclaimerMessage = $state(['Accept Terms', 'Generating Shopify Link...', 'Proceed to Purchase']);
  let helpWindowHover = $state(false);
  let bootState = $state(0);

  let underprintImg = new Image();
  let foilColorImg = new Image();
  let plexiMessage = $state(false);
  
  let underprintAlpha = $state(0);
  let holoAlpha = $state(1);
  let imgAlpha = $state(1);
  
	import LegalDisclaimer from "./LegalDisclaimer.svelte";
  let acceptTermsCheck = $state(false);

  let whitePixelDetected = $state(false);

  $effect(() => {

    const updateSize = async () => {
      windowWidth = Math.max(window.innerWidth, minPageWidth); // minimum window width = 1024px
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

      //maxTabHeight = windowHeight - 5*tabPosition + topBarHeight + 16;
      maxTabHeight = windowHeight - 502 + topBarHeight + 16;

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
    if(underCanvas)
    underCtx = underCanvas.getContext('2d', { willReadFrequently: false });
    if(holoCanvas)
    holoCtx = holoCanvas.getContext('2d', { willReadFrequently: false });

    canvasRedraw();
	});

  function canvasRedraw(){
    drawImage();
    drawUnderprint();
    drawFoil();
    drawHolo();
    drawRectangle();
    updateErrorWindow();
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
      {
        rectangleCtx.imageSmoothingEnabled = !isExporting;
        rectangleCtx.drawImage(generating ? devicePrintImg : deviceFullImg, 0, 0, rectangleCanvas.width, rectangleCanvas.height);
      } 
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
    rectangleCtx.strokeStyle = generating ? "black" : lineColor;
    rectangleCtx.lineCap = "round";

    if (!generating)
    {
      // draw bleed margin rectangle
      rectangleCtx.save();
      rectangleCtx.strokeStyle = 'red';
      drawRoundedRect(rectangleCtx, -6.35, -6.35, OuterRectangleWidth + 2*6.35, OuterRectangleHeight + 2*6.35, 10.25*1.3);
      rectangleCtx.stroke();
      rectangleCtx.restore();
    }

    // draw rectangle
    rectangleCtx.save();
    drawRoundedRect(rectangleCtx, 0, 0, OuterRectangleWidth, OuterRectangleHeight, 10.25);
    rectangleCtx.stroke();
    rectangleCtx.restore();

    // draw  buttons
    drawButtons(drawWidth, generating ? "black" : lineColor);
  }

  function drawButtons(drawWidth: number, drawColor: string)
  {
    if(!rectangleCanvas) return;
    if(!rectangleCtx) return;

    // draw the screen rectangle
    rectangleCtx.save();
    rectangleCtx.lineWidth = drawWidth*2;
    drawRoundedRect(rectangleCtx, 110.962, 3.557, 24.276, 13.386, 1.485);
    rectangleCtx.clip();
    rectangleCtx.clearRect(0, 0, rectangleCanvas.width, rectangleCanvas.height); // Clear everything inside the screen rectangle
    rectangleCtx.stroke();
    rectangleCtx.restore();

    // draw circles
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
    // top-left corner
    ctx.moveTo(x + radius, y);
    // top edge
    ctx.lineTo(x + width - radius, y);
    // top-right corner
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    // right edge
    ctx.lineTo(x + width, y + height - radius);
    // bottom-right corner
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    // bottom edge
    ctx.lineTo(x + radius, y + height);
    // bottom-left corner
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    // left edge
    ctx.lineTo(x, y + radius);
    // top-left corner
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
    else if (layer == "under")
      ctx = underCtx;
    else if (layer == "holo")
      ctx = holoCtx;

    if(ctx)
    {
      // clear area outside of the rounded rectangle
      ctx.save();
      ctx.translate(glyphShiftX, glyphShiftY);
      ctx.scale(drawScale, drawScale);
      ctx.globalCompositeOperation = 'destination-in';
      drawRoundedRect(ctx, -6.35, -6.35, OuterRectangleWidth + 2*6.35, OuterRectangleHeight + 2*6.35, 10.25*1.3);
      ctx.fill();
      ctx.restore();

      // clear the screen rectangle
      ctx.save();
      ctx.translate(glyphShiftX, glyphShiftY);
      ctx.scale(drawScale, drawScale);
      drawRoundedRect(ctx, 110.962, 3.557, 24.276, 13.386, 1.485);
      ctx.clip();
      ctx.clearRect(0, 0, canvasWidth, canvasHeight); // clear everything inside the screen rectangle
      ctx.restore();

      // clear circles
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
      
        // check every 4th value (alpha channel)
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
                fullCoverageDetected = false; // found non-opaque pixel
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
    else if(underCanvas && underCtx && layer == "under")
      applyMask(underCanvas);
    else if(holoCanvas && holoCtx && layer == "holo")
      applyMask(holoCanvas);
  }

  function applyMask(targetCanvas: HTMLCanvasElement) {
    const ctx = targetCanvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);

    let allWhitePixelsCovered = true;

    // apply the mask to the original image and check coverage
    for (let i = 0; i < imageData.data.length; i += 4) {
        // check mask pixel (using red channel since it's B&W)
        const maskValue = maskData.data[i];
        
        // count white pixels in mask (value >= 128)
        if (maskValue >= 128) {
            
            // check if this white mask pixel has a non-transparent image pixel
            const imageAlpha = imageData.data[i + 3];
            if (imageAlpha > 0) {
            } else {
                allWhitePixelsCovered = false;
            }
        }
        
        // if mask pixel is black (or dark), make target pixel transparent
        if (maskValue < 128) {
            imageData.data[i + 3] = 0; // set alpha to 0
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
    {
      imageCtx.scale(contentScale, contentScale);
      imageCtx.globalAlpha = imgAlpha;
    }
    else
      imageCtx.globalAlpha = 1;

    const scaledImgWidth = imgWidth;
    const scaledImgHeight = imgWidth / imgAspectRatio;
    imgHeight = scaledImgHeight;
    const scaledMargin = margin;
    const scaledCornerRadius = cornerRadius;
    const scaledRotationHandleLength = rotationHandleLength;
    const scaledImgX = imgX;
    const scaledImgY = imgY;

    // calculate center and dimensions
    const centerX = scaledImgX + scaledImgWidth/2;
    const centerY = scaledImgY + scaledImgHeight/2;
    const borderedWidth = scaledImgWidth + scaledMargin * 2;
    const borderedHeight = scaledImgHeight + scaledMargin * 2;
    
    imageCtx.save();
    imageCtx.translate(centerX, centerY);
    imageCtx.rotate(rotation);
    imageCtx.translate(-centerX, -centerY);

    // draw rotated image
    imageCtx.drawImage(img, scaledImgX, scaledImgY, scaledImgWidth, scaledImgHeight);

    imageCtx.restore();

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
        imageCtx.globalAlpha = 1;
        
        // draw rotated dotted border
        imageCtx.strokeStyle = '#AAAAAA';
        imageCtx.lineWidth = 4;
        imageCtx.setLineDash([12, 12]);
        imageCtx.strokeRect(
            scaledImgX - scaledMargin,
            scaledImgY - scaledMargin,
            borderedWidth,
            borderedHeight
        );
        imageCtx.setLineDash([]);
        
        // restore before drawing UI elements that shouldn't rotate
        imageCtx.restore();
        imageCtx.globalAlpha = 1;
        
        // calculate rotation handle position
        const rotationHandleX = centerX + Math.sin(rotation) * (borderedHeight/2 + scaledRotationHandleLength);
        const rotationHandleY = centerY - Math.cos(rotation) * (borderedHeight/2 + scaledRotationHandleLength);
        
        // draw unrotated rotation handle line
        imageCtx.beginPath();
        imageCtx.moveTo(
            centerX + Math.sin(rotation) * borderedHeight/2,
            centerY - Math.cos(rotation) * borderedHeight/2
        );
        imageCtx.lineTo(rotationHandleX, rotationHandleY);
        imageCtx.strokeStyle = '#AAAAAA';
        imageCtx.lineWidth = 1;
        imageCtx.stroke();
        
        // draw unrotated control points
        drawCorner(
            centerX - Math.cos(rotation) * borderedWidth/2 - Math.sin(rotation) * borderedHeight/2,
            centerY - Math.sin(rotation) * borderedWidth/2 + Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // top-left
        
        drawCorner(
            centerX + Math.cos(rotation) * borderedWidth/2 - Math.sin(rotation) * borderedHeight/2,
            centerY + Math.sin(rotation) * borderedWidth/2 + Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // top-right
        
        drawCorner(
            centerX - Math.cos(rotation) * borderedWidth/2 + Math.sin(rotation) * borderedHeight/2,
            centerY - Math.sin(rotation) * borderedWidth/2 - Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // bottom-left
        
        drawCorner(
            centerX + Math.cos(rotation) * borderedWidth/2 + Math.sin(rotation) * borderedHeight/2,
            centerY + Math.sin(rotation) * borderedWidth/2 - Math.cos(rotation) * borderedHeight/2,
            scaledCornerRadius, 'image'
        ); // bottom-right
        
        drawCorner(rotationHandleX, rotationHandleY, scaledCornerRadius, 'image'); // rotation handle
      }
    }

    // restore scaling transform
    imageCtx.restore();

    if (exporting){
      const imageData = imageCtx.getImageData(boxCoords[0], boxCoords[1], boxCoords[2] - boxCoords[0], boxCoords[3] - boxCoords[1]);
      imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      imageCtx.putImageData(imageData, boxCoords[0], boxCoords[1]);
    }
  }

  async function drawFoil() {
    if (!foilCanvas || !foilCtx) return;

    foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);
    if (!visibleLayers[2] || noFoilOrHolo) return;

    rotationFoil = (rotationFoil > Math.PI) ? rotationFoil - 2*Math.PI : rotationFoil;
    rotationFoil = (rotationFoil < -Math.PI) ? rotationFoil + 2*Math.PI : rotationFoil;
    rotationFoilDegrees = Math.round(100*(rotationFoil * 180) / Math.PI)/100;

    foilCtx.imageSmoothingEnabled = false;

    // calculate scaled dimensions
    const scaledFoilWidth = foilWidth;
    const scaledFoilHeight = foilWidth / foilAspectRatio;
    foilHeight = scaledFoilHeight;
    const scaledMargin = margin;
    const scaledCornerRadius = cornerRadius;
    const scaledRotationHandleLength = rotationHandleLength;
    const scaledFoilX = foilX;
    const scaledFoilY = foilY;

    // calculate center and dimensions
    const centerX = scaledFoilX + scaledFoilWidth/2;
    const centerY = scaledFoilY + scaledFoilHeight/2;
    const borderedWidth = scaledFoilWidth + scaledMargin * 2;
    const borderedHeight = scaledFoilHeight + scaledMargin * 2;
    
    foilCtx.save();
    
    if (foilUploaded)
    {
      if (!foil) return;

      if (!exporting)
        foilCtx.scale(contentScale, contentScale);
      
      foilCtx.save();
      foilCtx.translate(centerX, centerY);
      foilCtx.rotate(rotationFoil);
      foilCtx.translate(-centerX, -centerY);

      // draw rotated image
      foilCtx.drawImage(foil, scaledFoilX, scaledFoilY, scaledFoilWidth, scaledFoilHeight);

      foilCtx.restore();

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
          
          // draw rotated dotted border
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
          
          foilCtx.restore();
          
          const rotationHandleX = centerX + Math.sin(rotationFoil) * (borderedHeight/2 + scaledRotationHandleLength);
          const rotationHandleY = centerY - Math.cos(rotationFoil) * (borderedHeight/2 + scaledRotationHandleLength);
          
          foilCtx.beginPath();
          foilCtx.moveTo(
              centerX + Math.sin(rotationFoil) * borderedHeight/2,
              centerY - Math.cos(rotationFoil) * borderedHeight/2
          );
          foilCtx.lineTo(rotationHandleX, rotationHandleY);
          foilCtx.strokeStyle = '#FFFFFF';
          foilCtx.lineWidth = 1;
          foilCtx.stroke();
          
          drawCorner(
              centerX - Math.cos(rotationFoil) * borderedWidth/2 - Math.sin(rotationFoil) * borderedHeight/2,
              centerY - Math.sin(rotationFoil) * borderedWidth/2 + Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // top-left
          
          drawCorner(
              centerX + Math.cos(rotationFoil) * borderedWidth/2 - Math.sin(rotationFoil) * borderedHeight/2,
              centerY + Math.sin(rotationFoil) * borderedWidth/2 + Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // top-right
          
          drawCorner(
              centerX - Math.cos(rotationFoil) * borderedWidth/2 + Math.sin(rotationFoil) * borderedHeight/2,
              centerY - Math.sin(rotationFoil) * borderedWidth/2 - Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // bottom-left
          
          drawCorner(
              centerX + Math.cos(rotationFoil) * borderedWidth/2 + Math.sin(rotationFoil) * borderedHeight/2,
              centerY + Math.sin(rotationFoil) * borderedWidth/2 - Math.cos(rotationFoil) * borderedHeight/2,
              scaledCornerRadius, 'foil'
          ); // bottom-right
          
          drawCorner(rotationHandleX, rotationHandleY, scaledCornerRadius, 'foil'); // rotation handle
        }
      }
    
    }

    foilCtx.restore();

    if (exporting){
      const imageData = foilCtx.getImageData(boxCoords[0], boxCoords[1], boxCoords[2] - boxCoords[0], boxCoords[3] - boxCoords[1]);
      foilCtx.clearRect(0, 0, foilCanvas.width, foilCanvas.height);
      foilCtx.putImageData(imageData, boxCoords[0], boxCoords[1]);
    }
  }

  async function drawUnderprint() {
    if (!underCanvas || !underCtx || exporting) return;

    underCtx.clearRect(0, 0, underCanvas.width, underCanvas.height);
    if (!visibleLayers[2]) return;
    
    underCtx.save();

    if (selectedUnderprint != '')
    {
      underCtx.globalAlpha = underprintAlpha;
      underCtx.drawImage(underprintImg, 0, 0, underCanvas.width, underCanvas.height);
      underCtx.scale(contentScale, contentScale);
      underCtx.save();

      if (selectedDevice == "Glyph")
        clearGlyphArea("under");
      else if (selectedDevice != '')
        clearDeviceArea("under");

      underCtx.restore();
    }

    underCtx.restore();

  }

  async function drawHolo() {
    if (!holoCanvas || !holoCtx || exporting) return;
    
    holoCtx.clearRect(0, 0, holoCanvas.width, holoCanvas.height);
    if (!visibleLayers[2] || selectedHoloPattern == HolographicList[0] ) return;
    
    holoCtx.save();

    if (selectedHoloPattern != HolographicList[0])
    {
      holoCtx.globalAlpha = holoAlpha;
      holoCtx.drawImage(FullHoloImg, 0, 0, holoCanvas.width, holoCanvas.height);
      holoCtx.scale(contentScale, contentScale);
      holoCtx.save();

      if (selectedDevice == "Glyph")
        clearGlyphArea("holo");
      else if (selectedDevice != '')
        clearDeviceArea("holo");

      holoCtx.restore();
    }

    holoCtx.restore();

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
      
      // calculate rotation handle position
      const borderedHeight = imgHeight + margin * 2;
      const rotationHandleX = centerX + Math.sin(rotation) * (borderedHeight/2 + rotationHandleLength);
      const rotationHandleY = centerY - Math.cos(rotation) * (borderedHeight/2 + rotationHandleLength);
      
      // check rotation handle first
      const rotationHandleDist = Math.sqrt((mouseX - rotationHandleX) ** 2 + (mouseY - rotationHandleY) ** 2);
      if (rotationHandleDist <= cornerRadius) {
        isRotating = true;
        rotateStartAngle = Math.atan2(mouseY - centerY, mouseX - centerX) - rotation;
        if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
        return;
      }
      
      // calculate corner positions in screen space
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
      
      // check if clicked on a corner
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
        // check if clicked inside the rotated image and convert mouse coordinates to image's local space
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
    else if (activeWindow == 3 && visibleLayers[2]){
      if(!foilCanvas || !foilCtx || !foil) return;
      if(!foil.complete) return;
      if(fullFoilEnabled || fullHoloEnabled || noFoilOrHolo) return;

      const rect = foilCanvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const mouseX = (clientX - rect.left) / contentScale;
      const mouseY = (clientY - rect.top) / contentScale;

      const foilHeight = foilWidth / foilAspectRatio;
      const centerX = foilX + foilWidth/2;
      const centerY = foilY + foilHeight/2;
      
      // calculate rotationFoil handle position
      const borderedHeight = foilHeight + margin * 2;
      const rotationHandleX = centerX + Math.sin(rotationFoil) * (borderedHeight/2 + rotationHandleLength);
      const rotationHandleY = centerY - Math.cos(rotationFoil) * (borderedHeight/2 + rotationHandleLength);
      
      // check rotationFoil handle first
      const rotationHandleDist = Math.sqrt((mouseX - rotationHandleX) ** 2 + (mouseY - rotationHandleY) ** 2);
      if (rotationHandleDist <= cornerRadius) {
        isRotating = true;
        rotateStartAngle = Math.atan2(mouseY - centerY, mouseX - centerX) - rotationFoil;
        if (rectangleCanvas)
            rectangleCanvas.style.cursor = 'grabbing';
        return;
      }
      
      // calculate corner positions in screen space
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
      
      // check if clicked on a corner
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
        // check if clicked inside the foil (with rotationFoil) and convert mouse coordinates to foil's local space
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

  //const imgHeight = imgWidth / imgAspectRatio;
  
  if (isRotating) {
    const centerX = imgX + imgWidth/2;
    const centerY = imgY + imgHeight/2;
    rotation = Math.atan2(mouseY - centerY, mouseX - centerX) - rotateStartAngle;
  } 
  else if (isDragging && activeCorner) {
    // convert mouse coordinates to rotated space
    const centerX = imgX + imgWidth/2;
    const centerY = imgY + imgHeight/2;
    
    // translate mouse coordinates to origin
    const translatedX = mouseX - centerX;
    const translatedY = mouseY - centerY;
    
    // rotate back to image space
    const cos = Math.cos(-rotation);
    const sin = Math.sin(-rotation);
    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;
    
    // translate back to original position
    const unrotatedMouseX = rotatedX + centerX;
    const unrotatedMouseY = rotatedY + centerY;
    
    let newWidth = imgWidth;
    let newHeight = imgHeight;
    let newX = imgX;
    let newY = imgY;
    
    switch (activeCorner) {
      case 'bottomLeft': //topLeft
        newWidth = Math.max(20, (imgX + imgWidth) - unrotatedMouseX);
        newX = (imgX + imgWidth) - newWidth;
        newY = (imgY + imgHeight) - (newWidth / imgAspectRatio);
        break;
        
      case 'bottomRight': //topRight
        if (imgAspectRatio >= 1){
          newWidth = Math.max(20, unrotatedMouseX - imgX);
          newY = (imgY + imgHeight) - (newWidth / imgAspectRatio);
        } else {
          newWidth = Math.max(20, unrotatedMouseX - imgX);
        }
        
        break;
        
      case 'topLeft': //bottomLeft
        if (imgAspectRatio >= 1){
        newWidth = Math.max(20, (imgX + imgWidth) - unrotatedMouseX);
        newX = (imgX + imgWidth) - newWidth;
        } else {
          newWidth = Math.max(20, (imgX + imgWidth) - unrotatedMouseX);
          newX = (imgX + imgWidth) - newWidth;
          newY = (imgY + imgHeight) - (newWidth / imgAspectRatio);
        }

        break;
        
      case 'topRight': //bottomRight
        newWidth = Math.max(20, unrotatedMouseX - imgX);
        break;
      }
      
      imgX = newX;
      imgY = newY;
      imgWidth = newWidth;
      scaleRatio = Math.round(100 * imgWidth / initialWidth) / 100;

      console.log('-------------------------------------');
      console.log('unrotatedMouseX: ' + unrotatedMouseX);
      console.log('imgX: ' + imgX);
      console.log('imgWidth: ' + imgWidth);
      console.log('initialWidth: ' + initialWidth);
      console.log('scaleRatio: ' + scaleRatio);
      console.log('cos: ' + cos);
      console.log('sin: ' + sin);
      console.log('rotatedX: ' + rotatedX);
      console.log('rotatedY: ' + rotatedY);
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
      // convert mouse coordinates to rotated space
      const centerX = foilX + foilWidth/2;
      const centerY = foilY + foilHeight/2;
      
      // translate mouse coordinates to origin
      const translatedX = mouseX - centerX;
      const translatedY = mouseY - centerY;
      
      // rotate back to foil space
      const cos = Math.cos(-rotationFoil);
      const sin = Math.sin(-rotationFoil);
      const rotatedX = translatedX * cos - translatedY * sin;
      const rotatedY = translatedX * sin + translatedY * cos;
      
      // translate back to original position
      const unrotatedMouseX = rotatedX + centerX;
      const unrotatedMouseY = rotatedY + centerY;
      
      let newWidth = foilWidth;
      let newX = foilX;
      let newY = foilY;
      
      switch (activeCorner) {
        case 'bottomLeft':
          newWidth = Math.max(20, (foilX + foilWidth) - unrotatedMouseX);
          newX = (foilX + foilWidth) - newWidth;
          newY = (foilY + foilHeight) - (newWidth / foilAspectRatio);
          break;
          
        case 'bottomRight':
          newWidth = Math.max(20, unrotatedMouseX - foilX);
          newY = (foilY + foilHeight) - (newWidth / foilAspectRatio);
          break;
          
        case 'topLeft':
          newWidth = Math.max(20, (foilX + foilWidth) - unrotatedMouseX);
          newX = (foilX + foilWidth) - newWidth;
          break;
          
        case 'topRight':
          newWidth = Math.max(20, unrotatedMouseX - foilX);
          break;
        }
        
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

  async function handleDeviceChange(box: number) { //JDW
    deviceCovered = false;
    ButtonToggle = false;
    deviceBox3Contents = [];
    deviceBox3Default = '';

    if (deviceBox1Select == "Limit Labs")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Glyph'];
    }
    else if (deviceBox1Select == "Arcade Shock")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['All Button Modern', 'FST Noir', 'FST Vewlix', 'FST-EX'];
    }
    else if (deviceBox1Select == "Arcade Sticks Indonesia")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['LVL Controller ABC', 'LVL Controller WASD'];
    }
    // else if (deviceBox1Select == "BNB Fightstick")
    // {
    //   deviceBox2 = true;
    //   deviceBox3 = true;
    //   deviceBox2Default = 'Generation';
    //   deviceBox3Default = 'Model';
    //   deviceBox2Contents = ['Gen 1', 'Gen 2/3'];
    //   if (deviceBox2Select == 'Gen 1')
    //     deviceBox3Contents = ['All 24mm Button', 'Allbutton', 'Noir', 'Noir KOR', 'Sega 2P Extended', 'Sega 2P Extended KOR', 'Vewlix', 'WASD'];
    //   else if (deviceBox2Select == 'Gen 2/3')
    //     deviceBox3Contents = ['6GAWD Allbutton', '6GAWD Joystick 30mm', '6GAWD Joystick', 'Allbutton Plus Four', 'Allbutton', 'Mixup', 'Mixup KOR', 'Noir', 'Noir KOR',
    //     'Sega 2P Extended', 'Sega 2P Extended KOR', 'Shiokenstar', 'Vewlix', 'WASD'];
    // }
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
    // else if (deviceBox1Select == "Etokki")
    // {
    //   deviceBox2 = true;
    //   deviceBox3 = false;
    //   deviceBox2Default = 'Model';
    //   deviceBox2Contents = ['JPN', 'KOR'];
    // }
    else if (deviceBox1Select == "Hit Box")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Hit Box Panel', 'Smash Box', 'CrossUp', 'PS360+', 'Ultra'];
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
    //     deviceBox3Contents = [''];
    // }
    else if (deviceBox1Select == "Junkfood Custom Arcades")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Snackbox Micro', 'Snackbox XL Micro', 'SWORL'];
    }
    else if (deviceBox1Select == "Qanba")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Crystal, Q2 Pro Glow', 'Dragon', 'Obsidian', 'Obsidian Stickless', 'Obsidian 2 JPN', 'Obsidian 2 KOR', 'Obsidian 2 Noir', 'Obsidian 2 Stickless',
        'Pearl JPN', 'Pearl KOR', 'Q1 CUT Version 2, Carbon', 'Q4-RAF, Eightarc', 'Sapphire'];
    }
    else if (deviceBox1Select == "Prong")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Jabslab', 'Superslab'];
    }
    else if (deviceBox1Select == "Hori")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Fighting Stick Alpha', 'RAP 2-3-EX Series', 'RAP 3 Tekken Series', 'RAP N DOA5', 'RAP N', 'RAP N-DOA5 Shiokenstar', 'RAP N-DOA5 Stickless',
        'RAP V3-SA - VX-SA KAI', 'RAP V3-SA - VX-SA', 'RAP4 KAI - RAPV KAI', 'Real Arcade ProV JPN'];
    }
    else if (deviceBox1Select == "Haute42")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Haute Board B16', 'Haute Board Mini', 'HautePad C16', 'HautePad G12', 'HautePad G13', 'HautePad G16', 'HautePad R16', 'HautePad S12',
      'HautePad S13', 'HautePad S16', 'HautePad T12', 'HautePad T13', 'HautePad T16', 'HautePad U12', 'HautePad U16'];
    }
    else if (deviceBox1Select == "Katsugear")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Sando Traditional', 'Sando WASD'];
    }
    else if (deviceBox1Select == "MixBox")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['MixBox Arcade', 'MixBox Arcade REVERSE', 'MixBox 12 Arcade', 'MixBox 12 Arcade REVERSE'];
    }
    else if (deviceBox1Select == "Mavercade")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['KeebBrawler 02MX REV 2', 'KeebBrawler 02MXR REV 2', 'KeebBrawler 03MX REV 2', 'KeebBrawler 04MX REV 2', 'KeebBrawler 04LP REV 3',
      'KeebBrawler 05LP REV 3', 'KeebFighter+S4 REV 2'];
    }
    else if (deviceBox1Select == "Nacon")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Daija PS3-PS4', 'Daija PS5-XBox Series'];
    }
    else if (deviceBox1Select == "TR Fightsticks")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      deviceBox2Contents = ['Octopus Leverless', 'Octopus Noir', 'Octopus Sega 2P', 'Octopus Taito (Vewlix)', 'TMX All Button', 'TMX Sega 2P', 'TMX Taito'];
    }
    else if (deviceBox1Select == "Razer")
    {
      deviceBox2 = true;
      deviceBox3 = false;
      deviceBox2Default = 'Model';
      //deviceBox2Contents = ['Atrox', 'Panthera', 'Panthera Noir JPN', 'Panthera Noir KOR', 'Panthera Stickless'];
      deviceBox2Contents = ['Atrox', 'Panthera'];
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

    if (deviceBox2 == true && deviceBox3 == false && deviceBox2Contents.length == 1)
      deviceBox2Select = deviceBox2Contents[0];

    const result = updateDeviceInfo([deviceBox1Select, deviceBox2Select, deviceBox3Select], deviceMaskImg, deviceFullImg, devicePrintImg);
    deviceFullWidth = result.width;
    deviceFullHeight = result.height;
    selectedDevice = result.device;
    plexiMessage = result.plexi;

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
          handleUnderprintChange();
          resolve();
        };
          
      })
    }
    else
      handleUnderprintChange();
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
    // if ((!imageUploaded && !foilUploaded && !fullFoilEnabled && !fullHoloEnabled && !noFoilOrHolo) || (selectedDevice == '' || selectedDevice == 'Glyph')) return;
    if ((!imageUploaded && !foilUploaded && selectedUnderprint == FoilColorsLimited[0] && selectedHoloPattern == HolographicList[0]) || (selectedDevice == '' || selectedDevice == 'Glyph')) return;
    
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

    if (!rectangleCanvas || !imageCanvas || !foilCanvas) return;
    
    let oldSizes = [rectangleCanvas.width, rectangleCanvas.height, imageCanvas.width, imageCanvas.height, foilCanvas.width, foilCanvas.height];

    rectangleCanvas.width = 5400;
    rectangleCanvas.height = 3600;
    imageCanvas.width = 5400;
    imageCanvas.height = 3600;
    foilCanvas.width = 5400;
    foilCanvas.height = 3600;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [18, 12],
      compress: true
    });

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

    await tick();

    downloadCSV();

    pdf.save('glyph_art.pdf');
  }

  function downloadCSV() {
    let csvData = ``;
    csvData = `printable full foil layer: ` + (selectedUnderprint == FoilColorsLimited[0] ? `none` : selectedUnderprint) + `\r\n`;
    csvData += `non-printable spot foil layer: ` + (foilUploaded ? selectedFoilColor :  `none` ) + `\r\n`;
    csvData += `holographic pattern: ` + (selectedHoloPattern == HolographicList[0] ? `none` : selectedHoloPattern);

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'glyph_art_settings.csv');
    link.style.visibility = 'hidden';
    
    // trigger download
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleImageUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files?.[0]) return;
    
    imageFileName = target.files[0].name;
    imageFile = target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        imageUploaded = true;
        visibleLayers[1] = true;
        activeWindow = 2;
        scaleRatio = 1;
        rotation = 0;
        imgAspectRatio = img.naturalWidth / img.naturalHeight;
        initialWidth = img.naturalWidth;
        initialHeight = img.naturalHeight;
        imgWidth = initialWidth * scaleRatio;
        imgX = Math.round(boxCoords[0]);
        imgY = Math.round(boxCoords[1]);
        imageProcess();
        
        // force a reactive update
        $state.snapshot(img); // trigger svelte reactivity
        requestAnimationFrame(() => {
          canvasRedraw();
        });
      };
    };

    reader.readAsDataURL(imageFile);
  }

  async function imageProcess() {
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
      {
        data[i + 3] = 0; // alpha (0-255)
        whitePixelDetected = true;
      }
      
    }
    
    tempCtx.putImageData(imageData, 0, 0);

    await new Promise<void>((resolve) => {
      const dataURL = tempCanvas.toDataURL();
      img = new Image();
      img.src = dataURL;
      img.onload = () => {
        tick();
        resolve();
      };
    });
  }

  async function exportLayout() {
    isExporting = true;
    
    if (selectedDevice == "Glyph")
    {
      if(!rectangleCanvas || !rectangleCtx) return;

      let oldSizes = [rectangleCanvas.width, rectangleCanvas.height];

      rectangleCanvas.width = 5400;
      rectangleCanvas.height = 3600;
      
      ButtonToggle = false;
      let previousVisibleLayers = [visibleLayers[0], visibleLayers[1], visibleLayers[2]];

      visibleLayers[0] = true;
      exporting = true;
    
      canvasRedraw();

      const imageData = rectangleCtx.getImageData(0, 0, rectangleCanvas.width, rectangleCanvas.height);
      let tempCanvas = document.createElement('canvas');
      tempCanvas.width = 5400;
      tempCanvas.height = 3600;
      let tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imageData, 0, 0);
      
      rectangleCanvas.width = oldSizes[0];
      rectangleCanvas.height = oldSizes[1];

      visibleLayers = [previousVisibleLayers[0], previousVisibleLayers[1], previousVisibleLayers[2]];

      canvasRedraw();

      await tick();

      saveCanvasAsImage(tempCanvas);
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
    let fileName = selectedDevice;
    
    if (selectedDevice == "Glyph")
      fileName += "_" + (selectedButtonLayout == "" ? "full" : selectedButtonLayout) + "-layout";

    fileName = fileName.replaceAll(" ", "-");
    fileName = fileName.toLowerCase();
    fileName += "_18inX12in_600dpi";

    const dataUrl = inputCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  }

  function toggleTab(tab: 'layout' | 'image' | 'foil' | 'export') {
    if (bootState == 2 && false)
      bootState = 3;
    else
    {
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

    if (isNaN(newRotation)) newRotation = 0; // default to 0 if the input is invalid
    
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

	async function handleFoilUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    foilFileName = target.files?.[0]?.name || foilFileName;

    foilFile = (e.target as HTMLInputElement).files?.[0];
    if (!foilFile) return;
    
    fullFoilEnabled = false;
    fullHoloEnabled = false;
    noFoilOrHolo = false;
    
    foilUnprocessed = await loadFoil(foilFile);
    await processFoil();
    await handleFoilColorChange();
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
    // foilColorImg
    foilUnprocessedWidth = foilUnprocessed.width;
    foilUnprocessedHeight = foilUnprocessed.height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = foilUnprocessedWidth;
    tempCanvas.height = foilUnprocessedHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;

    tempCtx.clearRect(0, 0, foilUnprocessedWidth, foilUnprocessedHeight);
    tempCtx.drawImage(foilUnprocessed, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, foilUnprocessedWidth, foilUnprocessedHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // check if the pixel is solid black (#000000)
      if (r === 0 && g === 0 && b === 0) {
        // replace black with transparent color
        data[i] = foilR;
        data[i + 1] = foilG;
        data[i + 2] = foilB;
        data[i + 3] = foilAlpha * 255; // alpha (0-255)
      } else {
        // make the pixel fully transparent
        data[i + 3] = 0; // set alpha to 0
      }
    }

    // put the modified image data back onto the canvas
    tempCtx.putImageData(imageData, 0, 0);

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
              initialFoilWidth = foil.naturalWidth;
            }
            foilWidth = initialFoilWidth * scaleRatioFoil; // apply initial scale
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

      if (ChangeFlag && selectedButtonLayout !== ButtonLayouts[2]) // don't change it to custom if picking Split FGC
        selectedButtonLayout = ButtonLayouts[4]; // set it to custom if it turns off buttons
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

      if (ChangeFlag && selectedButtonLayout !== ButtonLayouts[2]) // don't change it to custom if picking Split FGC
        selectedButtonLayout = ButtonLayouts[4]; // set it to custom if it turns off buttons
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
      if ($Layouts[i].name === selectedButtonLayout) // Full
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
    hideTooltip();
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

    switch (selectedFoilColor)
    {
      case 'Silver Metallic':       foilRGBA = [140, 140, 140, 1];  break;
      case 'Gold Metallic':         foilRGBA = [225, 170, 50, 1];    break;
      // case 'Copper Metallic':       foilRGBA = [200, 150, 60, 1];   break;
      case 'Rose Gold Metallic':    foilRGBA = [235, 160, 120, 1];  break;
      case 'Red Metallic':          foilRGBA = [255, 30, 20, 1];      break;
      // case 'Green Metallic':        foilRGBA = [0, 160, 0, 1];      break;
      case 'Blue Metallic':         foilRGBA = [50, 70, 255, 1];      break;
      // case 'Dark Blue Metallic':    foilRGBA = [0, 0, 80, 1];       break;
      // case 'Violet Metallic':       foilRGBA = [80, 0, 80, 1];      break;
      // case 'Matte Silver Metallic': foilRGBA = [100, 100, 100, 1];  break;
      // case 'Satin Gold':            foilRGBA = [230, 200, 0, 1];    break;
      // case 'Satin Red':             foilRGBA = [180, 0, 0, 1];      break;
    }

    foilR = foilRGBA[0];
    foilG = foilRGBA[1];
    foilB = foilRGBA[2];
    foilAlpha = foilRGBA[3];

    // colorHex = rgbaToHex(foilR, foilG, foilB, foilAlpha);

    if (foilUploaded)
      await processFoil();
    
    canvasRedraw();
    changingColor = false;
  }

  async function handleUnderprintChange() {
    changingColor = true;
    imgAlpha = 1;

    if (selectedUnderprint.includes('No Foil Underprint Layer'))
    {
      underprintAlpha = 1;
      underprintImg.src = fullWhite;
      await new Promise<void>((resolve) => {
        underprintImg.onload = () => {
          resolve();
        };
      });
    }
    else if (selectedUnderprint.includes('Silver Metallic'))
    {
      underprintAlpha = selectedDevice == "Glyph" ? 0.85 : 0.7;
      imgAlpha = selectedDevice == "Glyph" ? 0.85 : 0.7;
      underprintImg.src = silverFoil;
      await new Promise<void>((resolve) => {
        underprintImg.onload = () => {
          resolve();
        };
      });
    }
    else if (selectedUnderprint.includes('Gold Metallic'))
    {
      underprintAlpha = selectedDevice == "Glyph" ? 0.85 : 0.7;
      imgAlpha = selectedDevice == "Glyph" ? 0.85 : 0.7;
      underprintImg.src = goldFoil;
      await new Promise<void>((resolve) => {
        underprintImg.onload = () => {
          resolve();
        };
      });
    }
    else if (selectedUnderprint.includes('Rainbow Metallic'))
    {
      underprintAlpha = selectedDevice == "Glyph" ? 0.7 : 0.35; 
      imgAlpha = selectedDevice == "Glyph" ? 0.85 : 0.7;
      if (selectedHoloPattern != HolographicList[0])
        underprintAlpha -= 0.05;
      underprintImg.src = rainbowFoil;
      await new Promise<void>((resolve) => {
        underprintImg.onload = () => {
          resolve();
        };
      });
    }
    
    canvasRedraw();
    changingColor = false;
  }

  async function handleHoloChange() {
    if (selectedUnderprint.includes('Rainbow Metallic'))
      handleUnderprintChange();

    if (selectedHoloPattern.includes('Stardust')) {
      selectedHoloImg = holo_Stardust;
      FullHoloImg.src = fullHolo_Stardust;
      holoAlpha = 0.9;
    } else if (selectedHoloPattern.includes('Ripple')) {
      selectedHoloImg = holo_Ripple;
      FullHoloImg.src = fullHolo_Ripple;
      holoAlpha = 0.7;
    } else if (selectedHoloPattern.includes('Mosaic')) {
      selectedHoloImg = holo_Mosaic;
      FullHoloImg.src = fullHolo_Mosaic;
      holoAlpha = 0;
    } else if (selectedHoloPattern.includes('Sparkle')) {
      selectedHoloImg = holo_Sparkle;
      FullHoloImg.src = fullHolo_Sparkle;
      holoAlpha = 0.8;
    } else if (selectedHoloPattern.includes('Crystal')) {
      selectedHoloImg = holo_Crystal;
      FullHoloImg.src = fullHolo_Crystal;
      holoAlpha = 0;
    } else if (selectedHoloPattern.includes('Glitter')) {
      selectedHoloImg = holo_Glitter;
      FullHoloImg.src = fullHolo_Glitter;
      holoAlpha = 0.8;
    } else if (selectedHoloPattern.includes('Hyper Plaid')) {
      selectedHoloImg = holo_HyperPlaid;
      FullHoloImg.src = fullHolo_Hyperplaid;
      holoAlpha = 0;
    } else if (selectedHoloPattern.includes('Milkyway')) {
      selectedHoloImg = holo_Milkyway;
      FullHoloImg.src = fullHolo_Milkyway;
      holoAlpha = 0;
    } else if (selectedHoloPattern.includes('Star')) {
      selectedHoloImg = holo_Star;
      FullHoloImg.src = fullHolo_Star;
      holoAlpha = 0;
    } else if (selectedHoloPattern.includes('Stream of Light')) {
      selectedHoloImg = holo_Stardust;
      FullHoloImg.src = fullHolo_Streamoflight;
      holoAlpha = 0.9;
    } else if (selectedHoloPattern.includes('Cracked Ice')) {
      selectedHoloImg = holo_Stardust;
      FullHoloImg.src = fullHolo_CrackedIce;
      holoAlpha = 0.9;
    }

    if (selectedDevice == "Glyph")
      holoAlpha = (holoAlpha + 1)*0.5;

    if (selectedHoloPattern != HolographicList[0])
    {
      await new Promise<void>((resolve) => {
        FullHoloImg.onload = () => {
            canvasRedraw();
            resolve();
        };
      });
    }
    
    canvasRedraw();
  }

  let hoveredHolo = $state<string | null>(null);
  let holoDropdownHover = $state(false);

  function handleHoloMouseOver(e: Event) {
    const target = e.target as HTMLSelectElement;
    if (target && target.selectedIndex >= 0) {
      hoveredHolo = HolographicList[target.selectedIndex];
    }
  }

  function fillCanvas(){
    if (!underCanvas || !underCtx) return;

    underCtx.clearRect(0, 0, underCanvas.width, underCanvas.height);
    
    const oldComposite = underCtx.globalCompositeOperation;
    
    // fill entire canvas with selected color
    underCtx.globalCompositeOperation = 'source-over';
    underCtx.fillStyle = colorHexUnder;
    underCtx.fillRect(0, 0, underCanvas.width, underCanvas.height);
    
    underCtx.globalCompositeOperation = oldComposite;
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
  import { addToCartViaRedirect } from '$lib/shopify';

  let generating = $state(false);
  let orderCreated = $state(false);
  let checkoutUrl = $state('');

  async function handlePurchase() {
    if (disclaimerState == 0)
    {
      disclaimerState = 1;

      handlePurchase();
    }
    else if (disclaimerState == 1)
    {
      generating = true;
      
      await shopifyAsyncHandler();
    }
    
  }

  function yieldToBrowser(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  async function shopifyAsyncHandler() {
    
    try {
      await yieldToBrowser();

      const pdf = await generatePdf();

      const dataUri = pdf.output('datauristring');
      const pdfBlob = dataUriToBlob(dataUri);
      
      // upload to cloud storage
      const pdfUrl = await uploadPdfToS3(pdfBlob, 'custom-art-print');
      console.log('Upload successful, URL:', pdfUrl);

      let printData = ``;
      printData = `printable full foil layer: ` + (selectedUnderprint == FoilColorsLimited[0] ? `none` : selectedUnderprint) + `\r\n`;
      printData += `non-printable spot foil layer: ` + (foilUploaded ? selectedFoilColor :  `none` ) + `\r\n`;
      printData += `holographic pattern: ` + (selectedHoloPattern == HolographicList[0] ? `none` : selectedHoloPattern);

      let variantID = 'error';
      if ( !foilUploaded && selectedHoloPattern == HolographicList[0] && selectedUnderprint == FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID1;
      else if ( !foilUploaded && selectedHoloPattern == HolographicList[0] && selectedUnderprint != FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID2;
      else if ( !foilUploaded && selectedHoloPattern != HolographicList[0] && selectedUnderprint == FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID3;
      else if ( !foilUploaded && selectedHoloPattern != HolographicList[0] && selectedUnderprint != FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID4;
      else if ( foilUploaded && selectedHoloPattern == HolographicList[0] && selectedUnderprint == FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID5;
      else if ( foilUploaded && selectedHoloPattern == HolographicList[0] && selectedUnderprint != FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID6;
      else if ( foilUploaded && selectedHoloPattern != HolographicList[0] && selectedUnderprint == FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID7;
      else if ( foilUploaded && selectedHoloPattern != HolographicList[0] && selectedUnderprint != FoilColorsLimited[0] )
        variantID = import.meta.env.VITE_SHOPIFY_VARIANT_ID8;

      const customAttributes = [
        { key: "pdf_url", value: pdfUrl },
        { key: "printable_full_foil_layer", value: (selectedUnderprint == FoilColorsLimited[0] ? `none` : selectedUnderprint) },
        { key: "non_printable_spot_foil_layer", value: (foilUploaded ? selectedFoilColor : `none`) },
        { key: "holographic_pattern", value: (selectedHoloPattern == HolographicList[0] ? `none` : selectedHoloPattern) }
      ];

      const result = addToCartViaRedirect(
        'gid://shopify/ProductVariant/' + variantID,
        customAttributes
      );

      checkoutUrl = result.checkoutUrl;
      
      orderCreated = true;
    }
    catch (error)
    {
      disclaimerState = 0;
      console.error('Error:', error);
      alert('Failed to process order. Please try again.');
    }
    finally
    {
      disclaimerState = 2;
      generating = false;
      canvasRedraw();
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
      unit: 'in',
      format: [18, 12],
      compress: true
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

    await tick();

    return pdf;
  }


// ---------------------------------------------------------------------------------------------------------------------------------------------------------


  let errorBarHover = $state(false);
  let errorTitle = $state("");
  let errorMessage = $state("");

  const errorTypes = [
    { type: 'none',     background: "#008100", boxshadow: "0 0 4px rgba(43, 255, 0, 0.7)",  border: "1px solid rgba(58, 209, 70, 0.5)",   color: "white" },
    { type: 'warning',  background: "#e7d800", boxshadow: "0 0 4px rgba(255, 187, 0, 0.7)", border: "1px solid rgba(255, 239, 100, 0.5)", color: "#222222" },
    { type: 'error',    background: "#810000", boxshadow: "0 0 4px rgba(255, 0, 0, 0.7)",   border: "1px solid rgba(255, 100, 100, 0.5)", color: "white" },
    { type: 'layout',   background: "#d5022f", boxshadow: "0 0 4px rgba(255, 0, 0, 0.7)",   border: "1px solid rgba(255, 100, 100, 0.5)", color: "white" },
    { type: 'image',    background: "#1f80ab", boxshadow: "0 0 4px rgba(31, 128, 171, 0.7)",border: "1px solid rgba(42, 174, 232, 0.5)",  color: "white" },
    { type: 'foil',     background: "#53317e", boxshadow: "0 0 4px rgba(83, 49, 126, 0.7)", border: "1px solid rgba(115, 68, 175, 0.5)",  color: "white" },
    { type: 'export',   background: "#0b7004", boxshadow: "0 0 2px rgba(43, 255, 0, 0.7)",  border: "1px solid rgba(16, 164, 6, 0.5)",    color: "white" },
  ];

  let errorType = $state<{
    type: string;
    background: string;
    boxshadow: string;
    border: string;
    color: string;
  }>({
    type: 'none',
    background: "#008100",
    boxshadow: "0 0 8px rgba(43, 255, 0, 0.7)",
    border: "1px solid rgba(58, 209, 70, 0.5)",
    color: "white"
  });

  function updateErrorWindow(){
    if (!disclaimerWindow)
    {
      orderCreated = false;
    }


    if (selectedDevice == "")
    {
      setErrorType('layout');
      errorTitle = "Start by selecting a device layout";
    }
    else if (!imageUploaded)
    {
      setErrorType('image');
      errorTitle = "Upload an image to the canvas";
    }
    // else if (!foilUploaded && !fullFoilEnabled && !fullHoloEnabled && !noFoilOrHolo)
    // {
    //   setErrorType('foil');
    //   errorTitle = "Select a foil or holographic layer";
    // }
    else if (!deviceCovered)
    {
      setErrorType('error');
      errorTitle = "Uploaded image must fully cover the device without transparent pixels";
    }
    else
    {
      setErrorType('export');
      errorTitle = "Art is ready for purchase!";
    }
  }

  function setErrorType(type: string) {
    const newType = errorTypes.find(t => t.type === type);
    if (newType) {
      errorType = newType;
    }
  }

  let tabContainer: HTMLDivElement;
  let tabContainerHeight = $state(0);

  let tooltip = $state("");
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let tooltipMessage = $state("");
  let tooltipVisible = $state(false);
  let tooltipTarget = $state<HTMLElement | null>(null);
  let tooltipPosition = $state("");

  function showTooltip(event: MouseEvent, message: string, position: string) {
    tooltipTarget = event.currentTarget as HTMLElement;
    tooltipToggle(message);
    tooltipPosition = position;
    
    // get position relative to viewport
    const rect = tooltipTarget.getBoundingClientRect();

    if (tooltipPosition == "TR")
    {
      tooltipX = rect.right + 6;
      tooltipY = rect.top;
    }
    else if (tooltipPosition == "BR")
    {
      tooltipX = rect.right;
      tooltipY = rect.bottom + 4;
    }
    
    tooltipVisible = true;
  }

  function hideTooltip() {
    tooltipVisible = false;
    tooltipTarget = null;
    holoDropdownHover = false;
  }

  // update tooltip position on scroll/resize
  $effect(() => {
    if (!tooltipVisible || !tooltipTarget) return;

    const updatePosition = () => {
      const rect = tooltipTarget!.getBoundingClientRect();
      if (tooltipPosition == "TR")
      {
        tooltipX = rect.right + 6;
        tooltipY = rect.top;
      }
      else if (tooltipPosition == "BR")
      {
        tooltipX = rect.right;
        tooltipY = rect.bottom + 4;
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  });

</script>

{#if tooltipVisible}
  <div class="global-tooltip"
    style="{tooltipPosition === "TR" ? `left: ${tooltipX}px; top: ${tooltipY}px;` : `right: calc(100vw - ${tooltipX}px); top: ${tooltipY}px;`}"
    transition:fade="{{ duration: 100 }}">
    {#if holoDropdownHover}
      <!-- svelte-ignore a11y_img_redundant_alt -->
      <img src={selectedHoloImg} alt="Holographic preview" style="border: 1px solid #111111;" />
    {:else}
      {tooltipMessage}
    {/if}
  </div>
{/if}


{#if bootState === 0}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => (bootState = helpWindowHover ? bootState : 1)}>
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style="width: fit-content;
    background: #98d9f5;
    user-select: none;">
      <h2 style="font-size: 20px; color: black; margin-top: 0px;">Welcome to the Limit Labs Fightstick Art Maker.</h2>
      <button onclick={() => (bootState = 1)} class="close-button"
      style="margin-top: 28px; background: #156082;">
        Get started
      </button>
    </div>
  </div>
{:else if bootState === 1}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => (bootState = helpWindowHover ? bootState : 2)}>
  </div>
{:else if bootState === 2 && false}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay" style:z-index=49
  onclick={() => (bootState = helpWindowHover ? bootState : 3)}>
  </div>
{:else if tutorialWindow}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => (tutorialWindow = helpWindowHover ? tutorialWindow : false)}>
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style="width: fit-content;
    max-height: 95%;
    overflow-x: auto;
    overflow-y: auto;">

      <HelpWindow />
      <button onclick={() => (tutorialWindow = false)} class="close-button"
      style:margin-top=28px>
        Done
      </button>
      
    </div>
  </div>
{:else if foilTutorialWindow}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => (foilTutorialWindow = helpWindowHover ? foilTutorialWindow : false)}>
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style="width: fit-content;
    white-space: nowrap;
    max-height: 95%;
    overflow-x: auto;
    overflow-y: auto;">
      <h1 style="margin-top: -8px; font-size: 1.8rem; font-weight: 600; color: #e8e6e3; margin-bottom: 1.0rem; text-align: left;">Spot Foil Mask Images</h1>
      <p style="font-size: 1rem; color: #b9bec5; margin-bottom: 8px; line-height: 1.5; text-align: left;">
        To create your own custom foil pattern, you must create and upload your own custom spot foil mask image.<br>
        The area that will be included as foil on the plate must be drawn as <i style="font-style: italic;">completely black pixels</i> on the mask image.<br>
        Any pixel that is not fully black (Hex code #000000) will load as being transparent within the art tool.<br>
        It is <i style="font-style: italic;">highly</i> recommended to have the dimensions of your spot foil mask file match the dimensions of your art plate's image file.
      </p>

      <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
        <div style="display: flex; flex-direction: row; align-items: center; gap: 1rem; max-width: 100%; margin-top: 24px;">
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={foiltutorial1} alt="Foil tutorial image before" style="border: 2px solid #3498db;" />
          <p style="font-size: 2rem;">➡️</p>
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={foiltutorial2} alt="Foil tutorial image after" style="border: 2px solid #3498db;" />
        </div>

        <button onclick={() => (foilTutorialWindow = false)} class="close-button" style="display: flex; margin-top: 28px; position: sticky; align-self: center;">
          Done
        </button>
      </div>
      
    </div>
  </div>
{:else if whitePixelDetected}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => (whitePixelDetected = helpWindowHover ? whitePixelDetected : false)}>
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style="width: fit-content;
    white-space: nowrap;
    max-height: 95%;
    overflow-x: auto;
    overflow-y: auto;">
      <h1 style="margin-top: -8px; font-size: 1.8rem; font-weight: 600; color: #e8e6e3; margin-bottom: 1.0rem; text-align: left;">White Pixels Detected</h1>
      <p style="font-size: 1rem; color: #b9bec5; margin-bottom: 8px; line-height: 1.5; text-align: left;">
        TBD explanation on white pixels being transparent
      </p>

      <div style="display: flex; flex-direction: column; align-items: center; position: relative;">
        <div style="display: flex; flex-direction: row; align-items: center; gap: 1rem; max-width: 100%; margin-top: 24px;">
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={foiltutorial1} alt="Foil tutorial image before" style="border: 2px solid #3498db;" />
          <p style="font-size: 2rem;">➡️</p>
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={foiltutorial2} alt="Foil tutorial image after" style="border: 2px solid #3498db;" />
        </div>

        <button onclick={() => (whitePixelDetected = false)} class="close-button" style="display: flex; margin-top: 28px; position: sticky; align-self: center;">
          Okay
        </button>
      </div>
      
    </div>
  </div>
{:else if disclaimerWindow}
  <!-- svelte-ignore a11y_click_events_have_key_events acceptTermsCheck ssss disclaimerWindow = (helpWindowHover || generating) ? disclaimerWindow : false-->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade="{{ duration: 100 }}" class="warning-overlay"
  onclick={() => { if (!helpWindowHover && (!generating || orderCreated)) {
            disclaimerState = 0;
            disclaimerWindow = false;
            acceptTermsCheck = false;
          }
        }}>
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style="max-width: 50%;
    white-space: normal;
    max-height: 70%;
    overflow-x: auto;
    overflow-y: auto;">

      {#if disclaimerState === 0}

      <LegalDisclaimer />

      <div style="margin-top: 24px;">

        <label style="color: #e8e6e3; cursor: pointer; font-weight: bold; user-select: none;">
          <input 
            type="checkbox" 
            bind:checked={acceptTermsCheck}
          />
          I Agree to the Limit Labs Custom Art Upload Agreement.
        </label>

        <br>

        <button onclick={handlePurchase} disabled={!acceptTermsCheck} class="close-button">
          Complete & Process Order
        </button>

      </div>

      {:else if disclaimerState === 1}

      <h1>Preparing your order...</h1>
      <h2 style="margin-top: 1.0rem;">This may take a few seconds</h2>

      {:else if orderCreated}

      <h1 style="font-size: 28px;
          padding-left: 36px;
          padding-right: 36px;
          padding-bottom: 24px;">Processing complete!</h1>

      <button onclick={() => {disclaimerState = 0;
            disclaimerWindow = false;
            acceptTermsCheck = false;
            window.open(checkoutUrl, '_blank');
          }}
          class="purchaseButton"
          style="font-size: 24px;
          padding-left: 36px;
          padding-right: 36px;
          padding-top: 16px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          user-select: none;">
          Add Item To Cart
      </button>

      {/if}
      
    </div>
  </div>
{/if}


<div class="tab-container"
bind:this={tabContainer}
bind:clientHeight={tabContainerHeight}
style:top={tabPosition}px>

<!-- Layout Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'layout'}
       style:width={activeTab === 'layout' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('layout')} style:background=#d5022f>Product + Layout</span>

    {#if activeTab === 'layout'}

    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition + 35}px>
    
      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">
        
          <h1 style:margin-bottom=12px>Layout Settings</h1>

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={info} class="tooltip-icon" alt="Image placement info" 
            style:margin-top="-10px"
            style:margin-left="-6px"
            style:display="flex"
            onmouseenter={(e) => showTooltip(e, "layoutsettings", "TR")}
            onmouseleave={hideTooltip}
          />

        </div>

        <div class="right-items">

          {#if selectedDevice !== ""}

            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img src={visibleLayers[0] ? eye_1 : eye_0} alt="Visible?" class="layer-icon" style="margin-right: 4px;"
            onclick={() => handleVisibleLayers(0)} />

          {/if}

        </div>

      </div>

      <!-- Layout dropdown -->
      <select bind:value={deviceBox1Select}
        style:margin=0px
        style:margin-bottom=8px
        style:margin-left=1px
        onchange={() => handleDeviceChange(1)}>
        <option value="" disabled selected>Select a brand</option>
        {#each deviceBox1Contents as device}
          <option value={device}>{device}</option>
        {/each}
      </select>
      <span style:color=#ff6666 style:font-size=20px>{ selectedDevice === "" ? "*" : "" }</span>

      <div style="display: flex;
      flex-direction: column;">

      {#if deviceBox2}
      <div>
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
        <span style:color=#ff6666 style:font-size=20px>{ selectedDevice === "" ? "*" : "" }</span>
      </div>
      {/if}

      {#if deviceBox3}
      <div>
        <select bind:value={deviceBox3Select}
          style:margin=0px
          style:margin-bottom=8px
          style:margin-left=1px
          disabled={deviceBox2Select == ''}
          onchange={() => handleDeviceChange(3)}>
          <option value="" disabled selected>{deviceBox3Default}</option>
          {#each deviceBox3Contents as content}
            <option value={content}>{content}</option>
          {/each}
        </select>
        <span style:color=#ff6666 style:font-size=20px>{ selectedDevice === "" ? "*" : "" }</span>
      </div>
      {/if}

      {#if selectedDevice === "Glyph"}

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

      <div>
        <button onclick={exportLayout} class="buttonToggle"
          disabled={isExporting || selectedDevice === ""}
          onmouseenter={(e) => showTooltip(e, "exportlayout", "TR")}
          onmouseleave={hideTooltip}
          style="margin-left: 2px;
          margin-top: 12px;
          padding: 8px;">
            Export Layout Template as PNG
        </button>
      </div>

      {#if plexiMessage}
      <div class="settings-section"
      style="margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      white-space: normal;
      font-size: 13px;">

        <img src={plexiglassImg} alt="Plexiglass needed?" style="width: 64px; margin-top: 8px;" />
        <span style="color: #ff6666; margin-left: 10px; margin-top: 6px; font-weight: bold;">Custom art plates for this device will require a 
        {#if deviceBox2Select === "Snackbox Micro" || deviceBox2Select === "SWORL"}
          <a href="https://junkfoodarcades.com/products/artwork-case/" target="_blank" style="text-decoration: underline;">compatible artwork case</a>
        {:else if deviceBox2Select === "Snackbox XL Micro"}
          <a href="https://junkfoodarcades.com/products/xl-artwork-case-for-micro/" target="_blank" style="text-decoration: underline;">compatible artwork case</a>
        {:else}
          <a href="https://focusattack.com/customize/fightstick/custom-plexiglass/" target="_blank" style="text-decoration: underline;">plexiglass panel</a>
        {/if}.</span>

      </div>
      {/if}

      </div>

    </div>
    </div>

    {/if}
  </div>

  <!-- Image Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'image'}
       style:width={activeTab === 'image' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('image')} style:background=#1f80ab>CMYK Image</span>

    {#if activeTab === 'image'}

    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition}px>
    
      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">
        
          <h1 style:margin-bottom=12px>Image Settings</h1>

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={info} class="tooltip-icon" alt="Image placement info" 
            style:margin-top="-10px"
            style:margin-left="-6px"
            style:display="flex"
            onmouseenter={(e) => showTooltip(e, "imagedescription", "TR")}
            onmouseleave={hideTooltip}
          />

        </div>

        <div class="right-items">

        {#if imageUploaded}

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <img src={visibleLayers[1] ? eye_1 : eye_0} alt="Visible?" class="layer-icon" style="margin-right: 6px;"
          onclick={() => handleVisibleLayers(1)} />

        {/if}

        </div>

      </div>

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
      <span style:color=#ff6666 style:font-size=20px>{ !imageUploaded ? "*" : "" }</span>
      <span style="color: #ff6666; margin-left: 12px; font-size: 18px; font-weight: 800;">+$18.00</span>

      {#if imageUploaded}

      {#if  imageUploaded && selectedDevice !== "" && ((initialWidth < deviceFullWidth) || (initialHeight < deviceFullHeight))}

        <div class="settings-section"
        style="margin-top: 10px;
        background: #810000;
        border: 1px solid rgba(255, 100, 100, 0.5);
        color: white;
        width: 98%;
        white-space: normal;
        padding-left: 12px;">

          <h2>Warning! Image size is less than device size. Stretched images may appear blurry.</h2>
          <h2>Image size: {initialWidth} x {initialHeight} pixels</h2>
          <h2>Layout size: {deviceFullWidth} x {deviceFullHeight} pixels</h2>

        </div>

      {/if}
      
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
          
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <img src={info} class="tooltip-icon" alt="Scale info" 
            onmouseenter={(e) => showTooltip(e, "imagescale", "TR")}
            onmouseleave={hideTooltip}
          />

        </label>
        
        <div style:display="flex">
          <!-- Reset scale button -->
          <button onclick={resetScale}
          class="sub-button"
          onmouseenter={(e) => showTooltip(e, "resetimagescale", "TR")}
          onmouseleave={hideTooltip}>
            Reset
          </button>

          {#if foilUploaded && !fullFoilEnabled}
            <button onclick={() => handleMatch("scaleitf")}
            class="sub-button"
            onmouseenter={(e) => showTooltip(e, "matchfoilscale", "TR")}
            onmouseleave={hideTooltip}>
              Match Foil
            </button>
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
        onmouseenter={(e) => showTooltip(e, "resetimagerotation", "TR")}
        onmouseleave={hideTooltip}
        class="sub-button">
          Reset
        </button>

        {#if foilUploaded && !fullFoilEnabled}
          <button onclick={() => handleMatch("rotationitf")}
          onmouseenter={(e) => showTooltip(e, "matchfoilrotation", "TR")}
          onmouseleave={hideTooltip}
          class="sub-button">
            Match Foil
          </button>
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
        onmouseenter={(e) => showTooltip(e, "resetimageposition", "TR")}
        onmouseleave={hideTooltip}
        class="sub-button">
          Reset
        </button>

        {#if foilUploaded && !fullFoilEnabled}
          <button onclick={() => handleMatch("positionitf")}
          onmouseenter={(e) => showTooltip(e, "matchfoilposition", "TR")}
          onmouseleave={hideTooltip}
          class="sub-button">
            Match Foil
          </button>
        {/if}
      </div>

      </div>

      <div class="settings-section"
      style="display: flex;
      flex-direction: row;">

        <h2 style="margin-right: 6px">Alignment:</h2>

        <div style=
        "display: flex;
        flex-direction: column;
        margin: 8px;">

          <div style=
          "display: flex;
          flex-direction: row;
          margin-left: 4px;">
            <button class="alignment-button" onclick={() => handleAlignment("image", "UL")}>↖</button>
            <button class="alignment-button" onclick={() => handleAlignment("image", "UM")}>↑</button>
            <button class="alignment-button" onclick={() => handleAlignment("image", "UR")}>↗</button>
          </div>
          
          <div style=
          "display: flex;
          flex-direction: row;
          margin-left: 4px;">
            <button class="alignment-button" onclick={() => handleAlignment("image", "L")}>←</button>
            <button class="alignment-button" onclick={() => handleAlignment("image", "M")}>○</button>
            <button class="alignment-button" onclick={() => handleAlignment("image", "R")}>→</button>
          </div>

          <div style=
          "display: flex;
          flex-direction: row;
          margin-left: 4px;">
            <button class="alignment-button" onclick={() => handleAlignment("image", "DL")}>↙</button>
            <button class="alignment-button" onclick={() => handleAlignment("image", "DM")}>↓</button>
            <button class="alignment-button" onclick={() => handleAlignment("image", "DR")}>↘</button>
          </div>

        </div>

        <button onclick={() => handleBestFit()}
          onmouseenter={(e) => showTooltip(e, "imagebestfit", "TR")}
          onmouseleave={hideTooltip}
          class="alignment-button"
          style="display: flex;
                width: 0;
                min-width: min-content;
                min-height: min-content;
                white-space: nowrap;
                align-self: flex-start;
                height: auto;
                margin: 8px;
                margin-left: 12px;
                font-weight: bold;">
            Best Fit
        </button>

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

        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img src={info} class="tooltip-icon" alt="Image smoothing info"
        onmouseenter={(e) => showTooltip(e, "imagesmoothing", "TR")}
        onmouseleave={hideTooltip}
        style:margin-top="14px"
        style:margin-left="0px"
        />
      </div>

      </div>

      {/if}

    </div> 
  </div>

  {/if}
</div>

  <!-- Foil Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="tab" 
       class:expanded={activeTab === 'foil'}
       style:width={activeTab === 'foil' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('foil')} style:background=#53317e>Foil + Holographic</span>

    {#if activeTab === 'foil'}

    <div class="tab-content">
    <div class="scrollable-content"
    style:max-height={maxTabHeight - tabPosition + 41}px>

      <div style:display="flex"
      style:justify-content="space-between">

        <div class="left-items">

          <h1 style:margin-bottom=8px>Foil Settings</h1>
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={info} class="tooltip-icon" alt="Image placement info"
          onmouseenter={(e) => showTooltip(e, "foildescription", "TR")}
          onmouseleave={hideTooltip}
          style:margin-top="-10px"
          style:margin-left="-6px"
          />

        </div>
        
        <div class="right-items">

        {#if foilUploaded || selectedUnderprint || selectedHoloPattern !== HolographicList[0]}

          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <img src={visibleLayers[2] ? eye_1 : eye_0} alt="Visible?" class="layer-icon" style="margin-right: 6px;"
          onclick={() => handleVisibleLayers(2)} />

        {/if}

        </div>

      </div>

      <div class="settings-section"
      style="padding-top: 2px;">

        <div style="display: flex;
        justify-content: space-between;">

          <div class="left-items">

            <h2 style="font-weight: bold;">Full Foil Underprint Layer
            <span style:color=#ff6666 style:font-size=20px style:margin-left=2px>{ !selectedUnderprint ? "*" : "" }</span>
            </h2>
            {#if selectedUnderprint && selectedUnderprint !== FoilColorsLimited[0]}
              <h2 style="color: #ff6666;">+{UnderprintPrice}</h2>
            {/if}

          </div>

          <div class="right-items">

            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img src={info} class="tooltip-icon" alt="Image placement info"
            onmouseenter={(e) => showTooltip(e, "underprintlayer", "TR")}
            onmouseleave={hideTooltip}
            style="margin-top: 6px; margin-right: 8px;" />

          </div>

        </div>

        <select style="margin-left: -4px;"
        bind:value={selectedUnderprint}
        onchange={handleUnderprintChange}>
        <option value="" disabled selected>Select an underprint</option>
          {#each FoilColorsLimited as color}
            <option value={color}>{color}</option>
          {/each}
        </select>

      </div>



      <div class="settings-section"
      style="padding-top: 2px;">

        <div style="display: flex;
        justify-content: space-between;">

          <div class="left-items">

            <h2 style="font-weight: bold;">Spot Foil Print Layer</h2>
            <h2 style="color: #ff6666;">+$8.10</h2>
            <!-- PRICE -->

          </div>

          <div class="right-items">

            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img src={info} class="tooltip-icon" alt="Image placement info"
            onmouseenter={(e) => showTooltip(e, "spotfoillayer", "TR")}
            onmouseleave={hideTooltip}
            style="margin-top: 6px; margin-right: 8px;" />

          </div>

        </div>

        <div class="file-input-wrapper">
          <button type="button" class="custom-button"
          style="white-space: nowrap;
                margin-top: 14px;
                margin-bottom: 8px;">
            Select spot foil file
          <input type="file"
          bind:this={foilInput}
          onchange={handleFoilUpload}
          class="file-input"
          accept="image/*"
          style="margin-top: 14px;
                margin-bottom: 8px;" />
          </button>
        </div>

        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <p style="color: #ff6666; font-size: 12px; margin-top: -2px; margin-left: 2px; text-decoration: underline; cursor: pointer; width: fit-content;"
        onclick={() => foilTutorialWindow = true}>What is a spot foil mask file?</p>

      </div>

      

        {#if foilUploaded}

        <div class="settings-section"
        style="padding-top: 2px;">

          <!-- Foil color dropdown -->
          <div style:display="flex"
          style:margin-bottom=-4px>
            <h2 style="padding-top: 7px;">Spot Foil Color: </h2>
            <select bind:value={selectedFoilColor}
            onchange={handleFoilColorChange}>
              {#each FoilColors as color}
                <option value={color}>{color}</option>
              {/each}
            </select>
          </div>

          <button onclick={removeFoil}
          style="margin-top: 8px;
                margin-bottom: 8px;
                width: fit-content;">
          Remove Spot Foil
          </button>

          </div>
        
      {/if}

      


      {#if false}

      <div style="display: flex;
      flex-direction: row;">
        
        <div class="settings-section"
        style="padding-top: 2px;
        width: { !noFoilOrHolo && !fullHoloEnabled && !fullFoilEnabled && !foilUploaded ? "95%" : "98%" };">

          <div class="full-foil-control"
          style:margin-top=6px>
            <label>
              <input 
                type="checkbox" 
                bind:checked={noFoilOrHolo}
                onchange={() => {
                  fullFoilEnabled = false;
                  fullHoloEnabled = false;
                  canvasRedraw();
                }}
              />
              No Foil or Holographic Layer
            </label>
          </div>

          <div class="full-foil-control"
          style:margin-top=6px>
            <label>
              <input 
                type="checkbox" 
                bind:checked={fullHoloEnabled}
                onchange={() => {
                  fullFoilEnabled = false;
                  noFoilOrHolo = false;
                  handleHoloChange();
                  FullHoloImg.onload = () => {
                    canvasRedraw();
                  };
                }}
              />
              Full Holographic Print
            </label>
          </div>

          <div class="full-foil-control"
          style:margin-top=6px>
            <label>
              <input 
                type="checkbox" 
                bind:checked={fullFoilEnabled}
                onchange={() => {
                  noFoilOrHolo = false;
                  fullHoloEnabled = false;
                  handleFoilColorChange();
                }}
              />
              Full Foil Print
            </label>
          </div>

      <div class="file-input-wrapper">
        <button type="button" class="custom-button"
        style="white-space: nowrap;
              margin-top: 14px;
              margin-bottom: 8px;">
          Select spot foil file
        <input type="file"
        bind:this={foilInput}
        onchange={handleFoilUpload}
        class="file-input"
        accept="image/*"
        style="margin-top: 14px;
              margin-bottom: 8px;" />
        </button>
      </div>

      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <p style="color: #ff6666; font-size: 12px; margin-top: -2px; margin-left: 2px; text-decoration: underline; cursor: pointer; width: fit-content;"
      onclick={() => foilTutorialWindow = true}>What is a spot foil mask file?</p>

      </div>

      <span style="color: #ff6666;
        font-size: 20px;
        margin-top: 2px;
        margin-left: 6px;">{ !noFoilOrHolo && !fullHoloEnabled && !fullFoilEnabled && !foilUploaded ? "*" : "" }</span>

      </div>

      {#if fullHoloEnabled}

        <div class="settings-section"
        style="margin-top: 8px;
        padding-top: 2px;">

          <!-- Holographic dropdown -->
          <div style:display="flex"
          style:margin-bottom=-4px>
            <h2 style="padding-top: 7px;">Holographic Pattern: </h2>
             <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <select 
              bind:value={selectedHoloPattern}
              onchange={handleHoloChange}
              onmouseover={() => holoDropdownHover = true}
              onmouseenter={(e) => showTooltip(e, "holodropdown", "TR")}
              onmouseleave={hideTooltip}>
              {#each HolographicList as holo}
                <option value={holo}>{holo}</option>
              {/each}
            </select>
            
          </div>

        </div>

        {#if hoveredHolo}
          <div class="global-tooltip" style="margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
            {hoveredHolo}
          </div>

          <div class="global-tooltip"
            style="{tooltipPosition === "TR" ? `left: ${tooltipX}px; top: ${tooltipY}px;` : `right: calc(100vw - ${tooltipX}px); top: ${tooltipY}px;`}"
            transition:fade="{{ duration: 100 }}">
            {tooltipMessage}
          </div>
        {/if}
        
      {/if}

      {/if}


      <!-- {#if (foilUploaded || fullFoilEnabled) && !fullHoloEnabled && !noFoilOrHolo} -->
      {#if foilUploaded}

        <!-- <div class="settings-section"
        style="margin-top: 8px;
        padding-top: 2px;">
        
          <div style:display="flex"
          style:margin-bottom=-4px>
            <h2 style="padding-top: 7px;">Foil Color: </h2>
            <select bind:value={selectedFoilColor}
            onchange={handleFoilColorChange}>
              {#if fullFoilEnabled}
                {#each FoilColorsLimited as color}
                  <option value={color}>{color}</option>
                {/each}
              {:else}
                {#each FoilColors as color}
                  <option value={color}>{color}</option>
                {/each}
              {/if}
            </select>
          </div>

        </div>
        
      {/if}

      {#if foilUploaded && !fullFoilEnabled && !fullHoloEnabled && !noFoilOrHolo} -->

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
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- <img src={info} class="tooltip-icon" alt="Scale info"
          onmouseenter={(e) => showTooltip(e, "foilscale", "TR")}
          onmouseleave={hideTooltip}
          /> -->
        </label>
        
        <div style:display="flex">
          <!-- Reset scale button -->
          <button onclick={resetScale}
          class="sub-button"
          onmouseenter={(e) => showTooltip(e, "resetfoilscale", "TR")}
          onmouseleave={hideTooltip}>
            Reset
          </button>

          {#if imageUploaded}
            <button onclick={() => handleMatch("scalefti")}
            class="sub-button"
            onmouseenter={(e) => showTooltip(e, "matchimagescale", "TR")}
            onmouseleave={hideTooltip}>
              Match Image
            </button>
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
          onmouseenter={(e) => showTooltip(e, "resetfoilrotation", "TR")}
          onmouseleave={hideTooltip}
          class="sub-button">
            Reset
          </button>

          {#if imageUploaded}
            <button onclick={() => handleMatch("rotationfti")}
            onmouseenter={(e) => showTooltip(e, "matchimagerotation", "TR")}
            onmouseleave={hideTooltip}
            class="sub-button">
              Match Image
            </button>
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
          onmouseenter={(e) => showTooltip(e, "resetfoilposition", "TR")}
          onmouseleave={hideTooltip}
          class="sub-button">
            Reset
          </button>

          {#if imageUploaded}
            <button onclick={() => handleMatch("positionfti")}
            onmouseenter={(e) => showTooltip(e, "matchimageposition", "TR")}
            onmouseleave={hideTooltip}
            class="sub-button">
              Match Image
            </button>
          {/if}
        </div>

      </div>
        
        <!-- <button onclick={removeFoil}
        onmouseenter={(e) => showTooltip(e, "removefoil", "TR")}
        onmouseleave={hideTooltip}
        style="margin-top: 8px;
              margin-bottom: 8px;">
        Remove Foil
        </button> -->

      {/if}



      <div class="settings-section"
      style="padding-top: 2px;">

        <div style="display: flex;
        justify-content: space-between;">

          <div class="left-items">

            <h2 style="font-weight: bold;">Holographic Overprint</h2>
            {#if selectedHoloPattern && selectedHoloPattern !== HolographicList[0]}
              <h2 style="color: #ff6666;">+{HoloPrice}</h2>
            {/if}

          </div>

          <div class="right-items">

            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img src={info} class="tooltip-icon" alt="Image placement info"
            onmouseenter={(e) => showTooltip(e, "holographiclayer", "TR")}
            onmouseleave={hideTooltip}
            style="margin-top: 6px; margin-right: 8px;" />

          </div>

        </div>

        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
        <select style="margin-left: -4px;"
          bind:value={selectedHoloPattern}
          onchange={handleHoloChange}>
          {#each HolographicList as holo}
            <option value={holo}>{holo}</option>
          {/each}
        </select>

      </div>

    </div>
    </div>

    {/if}
  </div>

  <!-- Export Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  {#if false}
  <div class="tab" 
       class:expanded={activeTab === 'export'}
       style:width={activeTab === 'export' ? expandedWidth + 'px' : tabWidth + 'px'}>
    <span class="tab-label" onclick={() => toggleTab('export')} style:background=#0e6506>Export</span>

    {#if activeTab === 'export'}

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
        onmouseenter={(e) => showTooltip(e, "exportlayout", "TR")}
        onmouseleave={hideTooltip}
        style:margin-left=0px>
          Export Layout to Image
      </button>

      <button class="buttonToggle" onclick={exportToPDF}
        disabled={!imageUploaded || selectedDevice === ""}>
        Export to PDF
      </button>

    </div>
    </div>

    {/if}

  </div>
  {/if}

  <!-- Help Tab -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- z-index: {bootState == 2 ? "103" : "1"};"> -->
  <div class="tab" 
    style="width: {tabWidth}px;
    z-index: 1;">
  <span class="tab-label" onclick={() => {if (bootState == 2 && false) bootState = 3; else tutorialWindow = true;}}
    style:transform=rotate(0deg)>
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src={info} class="tooltip-icon" alt="Image placement info"
    style="margin-top: 14px;
    margin-right: 2px;
    width: 28px;
    height: 28px;"
    />
  </span>

  {#if bootState === 2 && false}
    <div class="warning-box"
    onmouseenter={() => (helpWindowHover = true)}
    onmouseleave={() => (helpWindowHover = false)}
    style="width: 450px;
    display: inline-block;
    position: absolute;
    left: 48px;
    top: 424px;
    z-index: 102;
    background: #98d9f5;
    user-select: none;
    cursor: default;">
      <h2 style="font-size: 18px; color: black; margin-top: -12px;">Click on the layer tabs to expand them.</h2>
      <h2 style="font-size: 18px; color: black; margin-top: 0px;">If you need more information, click on the help icon for a more in-depth guide on each of the customization steps.</h2>
      <button onclick={() => (bootState = 3)} class="close-button"
      style="margin-top: 14px; margin-bottom: -12px; background: #156082;">
        Continue
      </button>
    </div>
  {/if}

  </div>
</div>

<div class="top-bar"
  bind:this={topBar}
  style:width={windowWidth}px
  style:height={topBarHeight}px>
  
  <!-- Left-aligned items -->
  <div class="left-items">
    <div style:width=132px
      style:min-width=132px
      style:padding=10px
      style:vertical-align=middle>
      <a href="https://limitlabs.com/" target="_blank">
        <!-- <Customicon name="LL Logomark Offwhite" style="h-full w-full" alt={'Limit Labs logo'} /> -->
        <img src={limitlabslogo} style="width: 132px;" alt={'Limit Labs logo'} />
      </a>
    </div>

  </div>

  <!-- Right-aligned item -->
  <div class="right-items">

    <div 
    style:position=relative
    style:display=inline-block>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="error-bar"
      style="background: {errorType.background}; 
            box-shadow: {errorType.boxshadow};
            border: {errorType.border};
            color: {errorType.color};
            position: relative;
            z-index: {bootState == 1 ? "103" : "1"};"
      onmouseenter={() => errorBarHover = true}
      onmouseleave={() => errorBarHover = false}>
        {errorTitle}

        {#if bootState === 1}
          <div class="warning-box"
          onmouseenter={() => (helpWindowHover = true)}
          onmouseleave={() => (helpWindowHover = false)}
          style="width: 450px;
          display: inline-block;
          position: absolute;
          right: 0px;
          top: 48px;
          z-index: 102;
          background: #98d9f5;
          user-select: none;">
            <h2 style="font-size: 18px; color: black; margin-top: -12px;">This is your project status bar.</h2>
            <h2 style="font-size: 18px; color: black; margin-top: 0px;">When identifying what your next step is in the custom art tool, look here to see what's next.</h2>
            <button onclick={() => (bootState = 2)} class="close-button"
            style="margin-top: 14px; margin-bottom: -12px; background: #156082;">
              Continue
            </button>
          </div>
        {/if}

      </div>
      {#if errorBarHover && (errorMessage !== "")}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="error-bar-window"
        style="background: {errorType.background};
            border: {errorType.border};
            color: {errorType.color};"
        onmouseenter={() => errorBarHover = true}
        onmouseleave={() => errorBarHover = false}>
          <p>{errorMessage}</p>
        </div>
      {/if}

    </div>

    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <div class="tooltip-container">
      <img src={info} class="tooltip-icon" alt="Image placement info"
      onmouseenter={(e) => showTooltip(e, "purchaseprint", "BR")}
      onmouseleave={hideTooltip}
      style:margin-top=0px
      style:margin-right=6px
      style:width=26px
      style:height=26px
      />
    </div>

    <button class="purchaseButton"
    onclick={() => { 
              disclaimerWindow = true;
              ButtonToggle = false;
              if (activeTab)
                toggleTab(activeTab);
            }}
    disabled={!imageUploaded || !selectedUnderprint || selectedDevice === "" }>
      Purchase Print
    </button>
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
  <canvas bind:this={underCanvas}
  class="canvas-layer underLayer"
  width={canvasWidth}
  height={canvasHeight}
  ></canvas>
  <canvas bind:this={foilCanvas}
  class="canvas-layer foilLayer"
  width={canvasWidth}
  height={canvasHeight}
  ></canvas>
  <canvas bind:this={holoCanvas}
  class="canvas-layer holoLayer"
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
    justify-content: left;
    align-items: center;
    margin: 0 auto;
    padding: 0;
    overflow: visible;
    height: calc(100vh - 62px);
    position: absolute;
  }

  canvas {
    border: 1px solid #ccc;
    -webkit-user-select: none;
    user-select: none;
  }

  .canvas-layer {
    position: absolute;
  }

  .underLayer { z-index: 1; 
  background-color: #0a0f18; }
  .imageLayer { z-index: 2; }
  .foilLayer { z-index: 3; }
  .holoLayer { z-index: 4; }
  .rectangleLayer { z-index: 5; }

  .top-bar {
    user-select: none;
    display: flex;
    min-width: min-content;
    white-space: nowrap;
    justify-content: space-between;
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
    user-select: none;
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
    margin: 0px 0px;
    position: absolute;
    top: 0;
    left: 0;
    width: 160px;
    height: 40px;
    opacity: 0;
    cursor: pointer;
  }

  input[type="file"] {
    cursor: pointer;
  }

  input[type="file"]::-webkit-file-upload-button {
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
    z-index: 50;
    user-select: none;
  }

  .tab {
    background: #2c3e50;
    color: white;
    min-height: 72px;
    height: min-content;
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
    user-select: none;
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
    padding-right: 6px;
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

  .scrollable-content {
    overflow-y: auto;
    overflow-x: hidden; 
    padding-right: 4px;
    min-height: 100px;
  }

  /* @media (max-height: 640px) {
    .tab.expanded .scrollable-content {
      min-height: 216px;
    }
  } */

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .scrollable-content::-webkit-scrollbar-track {
    background: #1e293b;
  }

  ::-webkit-scrollbar-track {
    background: #324563;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: #3498db;
    border-radius: 3px;
  }

  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip-icon {
    width: 24px;
    height: 24px;
    padding: 2px;
    margin-left: 4px;
    cursor: pointer;
  }

  .global-tooltip {
    position: fixed;
    background: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 9999;
    max-width: 250px;
    white-space: normal;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    pointer-events: none;
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
    width: 110px;
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
    white-space: nowrap;
    font-size: 12px;
    font-weight: bold;
    margin-right: 8px;
    margin-bottom: 2px;
    background: #3498db;
    color: white;
    cursor: pointer;
  }

  .alignment-button {
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

  .settings-section {
    display: flex;
    width: 98%;
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

  .purchaseButton {
    padding: 10px 16px;
    border: 1px solid #303436;
    margin: 8px;
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
    cursor: pointer;
    font-size: 16px;
    color: white;
    transition: background-color 0.3s ease;
    background: #4285f4;
  }

  .purchaseButton:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #222;
  }

  .purchaseButton:not(:disabled):hover {
    border-color: #ccc;
  }

  .buttonToggle:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #222;
  }

  .close-button:disabled {
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
    z-index: 101;
    user-select: none;
  }
  
  .warning-box {
    background: #1e293b;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    white-space: normal;
    user-select: text;
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
  
  .close-button:not(:disabled):hover {
    background: #303436;
  }

  .error-bar {
    font-size: 16px;
    padding: 8px 16px;
    border-radius: 6px;
    margin: 0 12px;
  }

  .error-bar-window {
    background: #810000;
    color: white;
    border: 1px solid rgba(255, 100, 100, 0.5);
    top: 100%;
    right: 0;
    margin: -1px 12px;
    position: absolute;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 100;
    width: max-content;
    white-space: normal;
    max-width: 356px;
  }

</style>