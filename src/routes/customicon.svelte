<script lang="ts">
	export let name: string;
	export let style: string = '';
	export let rotation: number = 0;
	export let alt: string | undefined;
	if (alt === undefined) alt = name;

	const source: string = '/icons/LL Logomark Offwhite.svg';
</script>

<img
	src={source}
	class={style}
	style="transform: rotate({rotation}deg);"
	{alt}
	on:error={() => (style = 'opacity-0')}
/>

<style>
	/* filter: brightness(0) saturate(100%) invert(84%) sepia(17%) saturate(102%) hue-rotate(177deg) brightness(110%) contrast(89%); */
	.xbox.icon {
		filter: brightness(0) saturate(100%) invert(84%) sepia(17%) saturate(102%) hue-rotate(177deg)
			brightness(110%) contrast(89%);
	}

	.xbox.DpadUp,
	.xbox.DpadDown,
	.xbox.DpadLeft,
	.xbox.DpadRight {
		filter: brightness(90%);
	}

	.xbox.A {
		filter: brightness(0) saturate(100%) invert(73%) sepia(42%) saturate(682%) hue-rotate(102deg)
			brightness(90%) contrast(88%);
		/* filter: brightness(0) saturate(100%) invert(100%) sepia(69%) saturate(1149%) hue-rotate(63deg) brightness(97%) contrast(93%); */
		/* filter: brightness(0) saturate(100%) invert(89%) sepia(31%) saturate(293%) hue-rotate(77deg) brightness(100%) contrast(94%); */
	}

	.xbox.X {
		filter: brightness(0) saturate(100%) invert(80%) sepia(9%) saturate(1248%) hue-rotate(175deg)
			brightness(109%) contrast(98%);
		/* filter: brightness(0) saturate(100%) invert(85%) sepia(96%) saturate(4918%) hue-rotate(165deg) brightness(104%) contrast(98%); */
	}

	.xbox.Y {
		filter: brightness(0) saturate(100%) invert(79%) sepia(81%) saturate(395%) hue-rotate(349deg)
			brightness(102%) contrast(98%);
		/* filter: brightness(0) saturate(100%) invert(87%) sepia(35%) saturate(525%) hue-rotate(352deg) brightness(106%) contrast(99%); */
	}

	.xbox.B {
		filter: brightness(0) saturate(100%) invert(45%) sepia(88%) saturate(473%) hue-rotate(312deg)
			brightness(115%) contrast(95%);
	}

	.xbox.RT,
	.xbox.LT {
		padding: 0.2rem;
	}

	/* [class~='RS'] { */
	/*     background: red;  */
	/* } */
</style>
