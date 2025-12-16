import { writable } from "svelte/store";

const smallSize = 6 / 2;
const smallSize2 = 8 / 2;
const mediumSize = 23 / 2;
const largeSize = 27.5 / 2;
const rectHeight = 196.5;

export var Tooltips: {
    name: string,
    cx: number,
    cy: number,
    message: string }[] = [
    { name: "layoutsettings", cx: 0, cy: 0, message: "Please make sure your artwork extends all the way to the red bleed line. Button holes with artwork will be cut out and included in your item." },
    { name: "imagedescription", cx: 0, cy: 0, message: "Artwork will be printed in CMYK format, not RGB. The printer does not apply ink to fully white pixels, allowing the white print sheet or the foil underprint layer to show through. Valid image file types include .jpg / .jpeg, .png, .gif, .webp, .svg, .bmp, and .tif / .tiff." },
    { name: "imagescale", cx: 0, cy: 0, message: "Increasing the image scale will cause image blurring. Increase the size of your image prior to uploading to preserve image resolution." },
    { name: "imagesmoothing", cx: 0, cy: 0, message: "Enabling image smoothing will blur the image if the scale is increased. Disabling smoothing will make the image look more pixelated by comparison." },
    { name: "foildescription", cx: 0, cy: 0, message: "For an additional charge, your art plate can include up to two customizable foil layers as well as a holographic pattern overlayed onto the print." },
    { name: "resetimagescale", cx: 0, cy: 0, message: "Reset the image scale to 1.0" },
    { name: "matchfoilscale", cx: 0, cy: 0, message: "Match the scale of the spot foil" },
    { name: "resetimagerotation", cx: 0, cy: 0, message: "Reset the image rotation to 0°" },
    { name: "matchfoilrotation", cx: 0, cy: 0, message: "Match the rotation of the spot foil" },
    { name: "resetimageposition", cx: 0, cy: 0, message: "Reset the image position to 0" },
    { name: "matchfoilposition", cx: 0, cy: 0, message: "Match the position of the spot foil" },
    { name: "resetfoilscale", cx: 0, cy: 0, message: "Reset the spot foil scale to 1.0" },
    { name: "matchimagescale", cx: 0, cy: 0, message: "Match the scale of the image" },
    { name: "resetfoilrotation", cx: 0, cy: 0, message: "Reset the spot foil rotation to 0°" },
    { name: "matchimagerotation", cx: 0, cy: 0, message: "Match the rotation of the image" },
    { name: "resetfoilposition", cx: 0, cy: 0, message: "Reset the spot foil position to 0" },
    { name: "matchimageposition", cx: 0, cy: 0, message: "Match the position of the image" },
    { name: "imagebestfit", cx: 0, cy: 0, message: "Automatically resize and center your image to have it best fit within the required margins of your selected device" }, //
    { name: "purchaseprint", cx: 0, cy: 0, message: "When you are done customizing your art, click here to generate your own Shopify link for purchase." }, //
    { name: "exportlayout", cx: 0, cy: 0, message: "Export your device layout as a full-sized PNG image for external reference purposes" }, //
    { name: "underprintlayer", cx: 0, cy: 0, message: "Select a full metallic underprint layer for your artwork. Choose between a Silver or Gold backdrop, or select a Rainbow metallic shine to give your art a fully holographic appearance." }, //
    { name: "spotfoillayer", cx: 0, cy: 0, message: "Upload a black-and-white spot foil mask file to include a custom metallic design on your art. This will be printed OVER your artwork and will cover any areas of the printed image beneath it!" }, //
    { name: "holographiclayer", cx: 0, cy: 0, message: "Choose from available holographic patterns that will show iridescent shining shapes on your art. The graphic preview will show a to-scale approximation of the selected pattern." },
];

export interface Circle {
    name: string,
    cx: number,
    cy: number,
    r: number,
    enabled: boolean,
    former: boolean,
}

export var Circles = writable<Circle[]>([
    { name: "LF1", cx: 103.346, cy: 61.855, r: mediumSize, enabled: true, former: true  },
    { name: "LF2", cx: 76.828, cy: 49.86, r: mediumSize, enabled: true, former: true  },
    { name: "LF3", cx: 48.473, cy: 52.835, r: mediumSize, enabled: true, former: true  },
    { name: "LF4", cx: 22.25, cy: 68.871, r: mediumSize, enabled: true, former: true  },
    { name: "LF5", cx: 72.65127886, cy: 75.26900432, r: mediumSize, enabled: true, former: true  },
    { name: "LF6", cx: 153.3278642, cy: 56.6032365, r: mediumSize, enabled: true, former: true  },
    { name: "LF7", cx: 129.5875847, cy: 40.46614963, r: mediumSize, enabled: true, former: true  },
    { name: "LF8", cx: 101.3991685, cy: 35.4957713, r: mediumSize, enabled: true, former: true  },
    
    { name: "LT1", cx: 110.361, cy: 129.481, r: mediumSize, enabled: true, former: true  },
    { name: "LT2", cx: 131.4541651, cy: 144.2505932, r: mediumSize, enabled: true, former: true  },
    { name: "LT3", cx: 133.6984255, cy: 118.5985798, r: mediumSize, enabled: true, former: true  },
    { name: "LT4", cx: 112.6052604, cy: 103.8289865, r: mediumSize, enabled: true, former: true  },
    { name: "LT5", cx: 89.26783486, cy: 114.7114068, r: mediumSize, enabled: true, former: true  },
    { name: "LT6", cx: 165.3278642, cy: 123.7569995, r: largeSize, enabled: true, former: true  },
    
    { name: "RF1", cx: 261.154, cy: 61.855, r: mediumSize, enabled: true, former: true  },
    { name: "RF2", cx: 287.672, cy: 49.86, r: mediumSize, enabled: true, former: true  },
    { name: "RF3", cx: 316.027, cy: 52.835, r: mediumSize, enabled: true, former: true  },
    { name: "RF4", cx: 342.25, cy: 68.871, r: mediumSize, enabled: true, former: true  },
    { name: "RF5", cx: 261.154, cy: 34.246, r: mediumSize, enabled: true, former: true  },
    { name: "RF6", cx: 287.672, cy: 22.25, r: mediumSize, enabled: true, former: true  },
    { name: "RF7", cx: 316.027, cy: 25.225, r: mediumSize, enabled: true, former: true  },
    { name: "RF8", cx: 342.25, cy: 41.261, r: mediumSize, enabled: true, former: true  },
    { name: "RF9", cx: 284.7951734, cy: 77.31971538, r: mediumSize, enabled: true, former: true  },
    { name: "RF10", cx: 177.3278642, cy: 70.2532365, r: mediumSize, enabled: true, former: true  },
    { name: "RF11", cx: 203.6078642, cy: 58.2657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF12", cx: 232.4928642, cy: 58.2657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF13", cx: 177.3278642, cy: 42.9532365, r: mediumSize, enabled: true, former: true  },
    { name: "RF14", cx: 203.6078642, cy: 30.9657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF15", cx: 232.4928642, cy: 30.9657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF16", cx: 200.9496701, cy: 85.7475188, r: mediumSize, enabled: true, former: true  },
    
    { name: "RT1", cx: 254.139, cy: 129.481, r: mediumSize, enabled: true, former: true  },
    { name: "RT2", cx: 233.0458349, cy: 144.2505932, r: mediumSize, enabled: true, former: true  },
    { name: "RT3", cx: 230.8015745, cy: 118.5985798, r: mediumSize, enabled: true, former: true  },
    { name: "RT4", cx: 251.8947396, cy: 103.8289865, r: mediumSize, enabled: true, former: true  },
    { name: "RT5", cx: 275.2321651, cy: 114.7114068, r: mediumSize, enabled: true, former: true  },
    
    { name: "MB1", cx: 23.95, cy: rectHeight - 186.25, r: smallSize2, enabled: true, former: true  },
    { name: "MB2", cx: 36.45, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB3", cx: 48.95, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB4", cx: 61.45, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB5", cx: 73.95, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB6", cx: 86.45, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB7", cx: 98.95, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },

    { name: "MBB1", cx: 10.25, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB2", cx: 182.25, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB3", cx: 354.25, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB4", cx: 10.25, cy: rectHeight - 10.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB5", cx: 182.25, cy: rectHeight - 10.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB6", cx: 354.25, cy: rectHeight - 10.25, r: smallSize, enabled: true, former: true  },
]);

export var CustomLayout = writable<Circle[]>([
    { name: "LF1", cx: 103.346, cy: 61.855, r: mediumSize, enabled: true, former: true  },
    { name: "LF2", cx: 76.828, cy: 49.86, r: mediumSize, enabled: true, former: true  },
    { name: "LF3", cx: 48.473, cy: 52.835, r: mediumSize, enabled: true, former: true  },
    { name: "LF4", cx: 22.25, cy: 68.871, r: mediumSize, enabled: true, former: true  },
    { name: "LF5", cx: 72.65127886, cy: 75.26900432, r: mediumSize, enabled: true, former: true  },
    { name: "LF6", cx: 153.3278642, cy: 56.6032365, r: mediumSize, enabled: true, former: true  },
    { name: "LF7", cx: 129.5875847, cy: 40.46614963, r: mediumSize, enabled: true, former: true  },
    { name: "LF8", cx: 101.3991685, cy: 35.4957713, r: mediumSize, enabled: true, former: true  },
    
    { name: "LT1", cx: 110.361, cy: 129.481, r: mediumSize, enabled: true, former: true  },
    { name: "LT2", cx: 131.4541651, cy: 144.2505932, r: mediumSize, enabled: true, former: true  },
    { name: "LT3", cx: 133.6984255, cy: 118.5985798, r: mediumSize, enabled: true, former: true  },
    { name: "LT4", cx: 112.6052604, cy: 103.8289865, r: mediumSize, enabled: true, former: true  },
    { name: "LT5", cx: 89.26783486, cy: 114.7114068, r: mediumSize, enabled: true, former: true  },
    { name: "LT6", cx: 165.3278642, cy: 123.7569995, r: largeSize, enabled: true, former: true  },
    
    { name: "RF1", cx: 261.154, cy: 61.855, r: mediumSize, enabled: true, former: true  },
    { name: "RF2", cx: 287.672, cy: 49.86, r: mediumSize, enabled: true, former: true  },
    { name: "RF3", cx: 316.027, cy: 52.835, r: mediumSize, enabled: true, former: true  },
    { name: "RF4", cx: 342.25, cy: 68.871, r: mediumSize, enabled: true, former: true  },
    { name: "RF5", cx: 261.154, cy: 34.246, r: mediumSize, enabled: true, former: true  },
    { name: "RF6", cx: 287.672, cy: 22.25, r: mediumSize, enabled: true, former: true  },
    { name: "RF7", cx: 316.027, cy: 25.225, r: mediumSize, enabled: true, former: true  },
    { name: "RF8", cx: 342.25, cy: 41.261, r: mediumSize, enabled: true, former: true  },
    { name: "RF9", cx: 284.7951734, cy: 77.31971538, r: mediumSize, enabled: true, former: true  },
    { name: "RF10", cx: 177.3278642, cy: 70.2532365, r: mediumSize, enabled: true, former: true  },
    { name: "RF11", cx: 203.6078642, cy: 58.2657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF12", cx: 232.4928642, cy: 58.2657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF13", cx: 177.3278642, cy: 42.9532365, r: mediumSize, enabled: true, former: true  },
    { name: "RF14", cx: 203.6078642, cy: 30.9657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF15", cx: 232.4928642, cy: 30.9657775, r: mediumSize, enabled: true, former: true  },
    { name: "RF16", cx: 200.9496701, cy: 85.7475188, r: mediumSize, enabled: true, former: true  },
    
    { name: "RT1", cx: 254.139, cy: 129.481, r: mediumSize, enabled: true, former: true  },
    { name: "RT2", cx: 233.0458349, cy: 144.2505932, r: mediumSize, enabled: true, former: true  },
    { name: "RT3", cx: 230.8015745, cy: 118.5985798, r: mediumSize, enabled: true, former: true  },
    { name: "RT4", cx: 251.8947396, cy: 103.8289865, r: mediumSize, enabled: true, former: true  },
    { name: "RT5", cx: 275.2321651, cy: 114.7114068, r: mediumSize, enabled: true, former: true  },
    
    { name: "MB1", cx: 23.95, cy: rectHeight - 186.25, r: smallSize2, enabled: true, former: true  },
    { name: "MB2", cx: 36.45, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB3", cx: 48.95, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB4", cx: 61.45, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB5", cx: 73.95, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB6", cx: 86.45, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MB7", cx: 98.95, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },

    { name: "MBB1", cx: 10.25, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB2", cx: 182.25, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB3", cx: 354.25, cy: rectHeight - 186.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB4", cx: 10.25, cy: rectHeight - 10.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB5", cx: 182.25, cy: rectHeight - 10.25, r: smallSize, enabled: true, former: true  },
    { name: "MBB6", cx: 354.25, cy: rectHeight - 10.25, r: smallSize, enabled: true, former: true  },
]);

export interface Layout {
    name: string,
    buttons: boolean[],
}

export const Layouts = writable<Layout[]>([
    { name: "Full", buttons: [
        true, true, true, true, true, true, true, true,     // LF
        true, true, true, true, true, true,                 // LT
        true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, // RF
        true, true, true, true, true,                       // RT
        true, true, true, true, true, true, true,           // MB
        true, true, true, true, true, true ] },             // MBB
    { name: "FGC", buttons: [
        false, false, false, false, false, true, true, true,    // LF
        false, false, false, false, false, true,                // LT
        true, false, false, false, true, false, false, false, false, true, true, true, true, true, true, true, // RF
        false, false, false, false, false,                      // RT
        true, true, true, true, true, true, true,           // MB
        true, true, true, true, true, true ] },             // MBB
    { name: "Split FGC", buttons: [
        true, true, true, true, true, false, false, false,  // LF
        true, false, false, false, false, false,            // LT
        true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, // RF
        true, false, false, false, false,                   // RT
        true, true, true, true, true, true, true,           // MB
        true, true, true, true, true, true ] },             // MBB
    { name: "Platform Fighter", buttons: [
        true, true, true, true, true, false, false, false,  // LF
        true, true, true, true, true, false,                // LT
        true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, // RF
        true, true, true, true, true,                       // RT
        true, true, true, true, true, true, true,           // MB
        true, true, true, true, true, true ] },             // MBB
    { name: "Custom", buttons: [
        true, true, true, true, true, true, true, true,     // LF
        true, true, true, true, true, true,                 // LT
        true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, // RF
        true, true, true, true, true,                       // RT
        true, true, true, true, true, true, true,           // MB
        true, true, true, true, true, true ] },             // MBB
]);

export const Preview = writable<string>('');

export const OuterRectangle = writable<{width: number, height: number}>({
    width: 353.82,
    height: 159.94,
});

export const ButtonHoleSize = writable<number>(22);

export const SwitchHoleWidth = writable<number>(14);
export const SwitchHoleHeight = writable<number>(14);

export const SwitchPlateThickness = writable<number>(1.5);

export const ScrewHoleSize = writable<number>(3);

export const ButtonCoverThickness = writable<number>(7);

export const SideWallThickness = writable<number>(3);