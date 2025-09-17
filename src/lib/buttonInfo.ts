export var editButtonLayout: {enabled: boolean} = {enabled: false};

export type ButtonLocation = {
	name: string;
	top: string;
	left: string;
	height: string;
	enabled: boolean;
};

const smallSize = "h-[7%]";
const mediumSize = "h-[11%]";
const largeSize = "h-[14%]";

export var buttonLocations: ButtonLocation[] = [
	{ name: 'LF1', top: '31.6', left: '28.4', height: mediumSize, enabled: true },
	{ name: 'LF2', top: '25.5', left: '21.2', height: mediumSize, enabled: true  },
	{ name: 'LF3', top: '27.0', left: '13.4', height: mediumSize, enabled: true  },
	{ name: 'LF4', top: '35.1', left: '6.2',  height: mediumSize, enabled: true  },
	{ name: 'LF5', top: '38.4', left: '20.0', height: mediumSize, enabled: true  },
	{ name: 'LF6', top: '28.9', left: '42.1', height: mediumSize, enabled: true  },
	{ name: 'LF7', top: '20.8', left: '35.6', height: mediumSize, enabled: true  },
	{ name: 'LF8', top: '18.3', left: '27.9', height: mediumSize, enabled: true  },

	{ name: 'LT1', top: '65.8', left: '30.3', height: mediumSize, enabled: true  },
	{ name: 'LT2', top: '73.3', left: '36.1', height: mediumSize, enabled: true  },
	{ name: 'LT3', top: '60.3', left: '36.7', height: mediumSize, enabled: true  },
	{ name: 'LT4', top: '52.8', left: '31.0', height: mediumSize, enabled: true  },
	{ name: 'LT5', top: '58.3', left: '24.6', height: mediumSize, enabled: true  },
	{ name: 'LT6', top: '62.9', left: '45.4', height: largeSize, enabled: true  },

	{ name: 'RF1', top: '31.6', left: '71.6', height: mediumSize, enabled: true  },
	{ name: 'RF2', top: '25.5', left: '78.8', height: mediumSize, enabled: true  },
	{ name: 'RF3', top: '27.0', left: '86.6', height: mediumSize, enabled: true  },
	{ name: 'RF4', top: '35.1', left: '93.8', height: mediumSize, enabled: true  },
	{ name: 'RF5', top: '17.6', left: '71.6', height: mediumSize, enabled: true  },
	{ name: 'RF6', top: '11.5', left: '78.8', height: mediumSize, enabled: true  },
	{ name: 'RF7', top: '13.1', left: '86.6', height: mediumSize, enabled: true  },
	{ name: 'RF8', top: '21.2', left: '93.8', height: mediumSize, enabled: true  },
	{ name: 'RF9', top: '39.4', left: '78.0', height: mediumSize, enabled: true  },
	{ name: 'RF10', top: '35.8', left: '48.7', height: mediumSize, enabled: true  },
	{ name: 'RF11', top: '29.8', left: '55.8', height: mediumSize, enabled: true  },
	{ name: 'RF12', top: '29.8', left: '63.7', height: mediumSize, enabled: true  },
	{ name: 'RF13', top: '22.0', left: '48.7', height: mediumSize, enabled: true  },
	{ name: 'RF14', top: '16.0', left: '55.8', height: mediumSize, enabled: true  },
	{ name: 'RF15', top: '16.0', left: '63.7', height: mediumSize, enabled: true  },
	{ name: 'RF16', top: '43.7', left: '55.1', height: mediumSize, enabled: true  },

	{ name: 'RT1', top: '65.8', left: '69.7', height: mediumSize, enabled: true  },
	{ name: 'RT2', top: '73.3', left: '63.9', height: mediumSize, enabled: true  },
	{ name: 'RT3', top: '60.3', left: '63.3', height: mediumSize, enabled: true  },
	{ name: 'RT4', top: '52.8', left: '69.0', height: mediumSize, enabled: true  },
	{ name: 'RT5', top: '58.3', left: '75.4', height: mediumSize, enabled: true  },

	{ name: 'MB1', top: '6', left: '4',  height: smallSize, enabled: true  },
	{ name: 'MB2', top: '6', left: '9',  height: smallSize, enabled: true  },
	{ name: 'MB3', top: '6', left: '14', height: smallSize, enabled: true  },
	{ name: 'MB4', top: '6', left: '19', height: smallSize, enabled: true  },
	{ name: 'MB5', top: '6', left: '24', height: smallSize, enabled: true  },
	{ name: 'MB6', top: '6', left: '29', height: smallSize, enabled: true  },
	{ name: 'MB7', top: '6', left: '34', height: smallSize, enabled: true  }
];
