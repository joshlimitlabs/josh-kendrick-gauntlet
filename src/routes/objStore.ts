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
    { name: "imagedescription", cx: 210, cy: 5, message: "Valid image file types include .jpg/.jpeg, .png, .gif, .webp, .svg, .bmp, and .tif/.tiff." },
    { name: "imagescale", cx: 320, cy: 42, message: "Increasing the image scale will cause image blurring. Increase the size of your image prior to uploading to preserve image resolution." },
    { name: "imagesmoothing", cx: 322, cy: 18, message: "Enabling image smoothing will blur the image if the scale is increased. Disabling smoothing will make the image look more pixelated by comparison." },
    { name: "foildescription", cx: 180, cy: 5, message: "Uploaded foil masks must be fully black pixels on areas that will have foil. All other pixel colors will not have foil included." },
    { name: "foillocation", cx: 336, cy: 16, message: "TBD explanation between above and below foil" },
    { name: "removefoil", cx: 112, cy: -50, message: "Remove foil text (TBD)" },
    { name: "exportbuttons", cx: 4, cy: 34, message: "Export buttons text (TBD)" },
    // { name: "exportlayout", cx: 8, cy: 44, message: "Export layout text (TBD)" },
    // { name: "exporttopdf", cx: 0, cy: 0, message: "Export to PDF text (TBD)" },
    { name: "buttontoggle", cx: 1164, cy: 42, message: "Button toggle text (TBD)" },
    { name: "leftthumb", cx: 580, cy: 42, message: "Left thumb button text (TBD)" },
    { name: "rightthumb", cx: 867, cy: 52, message: "Right thumb button text (TBD)" },
    { name: "resetimagescale", cx: 60, cy: -2, message: "Reset image scale text (TBD)" },
    { name: "matchfoilscale", cx: 146, cy: -2, message: "Match foil scale text (TBD)" },
    { name: "resetimagerotation", cx: 60, cy: -2, message: "Reset image rotation text (TBD)" },
    { name: "matchfoilrotation", cx: 146, cy: -2, message: "Match foil rotation text (TBD)" },
    { name: "resetimageposition", cx: 60, cy: -2, message: "Reset image position text (TBD)" },
    { name: "matchfoilposition", cx: 146, cy: -2, message: "Match foil position text (TBD)" },
    { name: "resetfoilscale", cx: 60, cy: -2, message: "Reset foil scale text (TBD)" },
    { name: "matchimagescale", cx: 164, cy: -2, message: "Match image scale text (TBD)" },
    { name: "resetfoilrotation", cx: 60, cy: -2, message: "Reset foil rotation text (TBD)" },
    { name: "matchimagerotation", cx: 164, cy: -2, message: "Match image rotation text (TBD)" },
    { name: "resetfoilposition", cx: 60, cy: -2, message: "Reset foil position text (TBD)" },
    { name: "matchimageposition", cx: 164, cy: -2, message: "Match image position text (TBD)" },
    { name: "imagebestfit", cx: 246, cy: -32, message: "Image best fit text (TBD)" },
];

export interface Circle {
    name: string,
    cx: number,
    cy: number,
    r: number,
    enabled: boolean,
    former: boolean,
}

const yScale = 1.93;
const yShift = -2;

const xScale = 3.58;
const xShift = -2;

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