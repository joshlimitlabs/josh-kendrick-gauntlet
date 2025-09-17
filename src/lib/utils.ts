export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
    // Clamp values to 0-255 for RGB and 0-1 for alpha
    const clampedR = Math.max(0, Math.min(255, Math.round(r)));
    const clampedG = Math.max(0, Math.min(255, Math.round(g)));
    const clampedB = Math.max(0, Math.min(255, Math.round(b)));
    const clampedA = Math.max(0, Math.min(1, a));

    // Convert RGB to hex
    const rgbHex = [
        clampedR.toString(16).padStart(2, '0'),
        clampedG.toString(16).padStart(2, '0'),
        clampedB.toString(16).padStart(2, '0')
    ].join('');

    // Convert alpha to hex (0-255 scale)
    const alphaHex = Math.round(clampedA * 255)
        .toString(16)
        .padStart(2, '0');

    return `#${rgbHex}${alphaHex}`;
}
