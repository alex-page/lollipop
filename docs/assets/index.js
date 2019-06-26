// --------------------------------------
// Create toggles for company
// --------------------------------------

// Gets a random colour value in hexadecimal
const randomHex = () => {
  const hexMax = 256 * 256 * 256;
  return '#' + Math.floor(Math.random() * hexMax).toString(16).toUpperCase().padStart(6, '0');
};

// Magical toggles that randomise tokens
const toggles = {
	baseFontSize: [16, 18],
	fontFamily: {
		body: [
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
			'Georgia, Cambria, "Times New Roman", Times, serif',
			'Shopify sans',
		],
		heading: [
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
			'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", sans-serif',
			'Shopify sans',
		],
		monospace: [
			'"SFMono-Regular", Consolas, Liberation Mono, Menlo, Courier, monospace',
			'monospace',
		]
	},
	typeScale: [1.25, 1.33, 1.5],
	spacingScale: [0.25, 0.5],
	radiiScale: [0.125, 0.25],
	color: {
		black: '#24292E',
		white: '#FFFFFF',
		blue: '#0366d6',
		primary: randomHex(),
		secondary: randomHex(),
	},
	unit: ['px', 'rem'],
	darkMode: Math.random() >= 0.5,
	prefix: '🍭',
};

// Gets a random number in between a minimum and maximum value
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Gets a random value from an array
const randomValue = (values) => values[randomNumber(0, values.length - 1)];

// Round a number to a number of decimal places
const round = (number, places) => +(Math.round(number + `e+${places}`) + `e-${places}`);

// Randomise the tokens based on there shape
const randomiseTokens = (tokens, randomTokens = {}) => {
	Object.entries(tokens).forEach(([key,value]) => {
		if(Array.isArray(value)){
			randomTokens[ key ] = randomValue(value);
		}
		else if(value === Object(value)){
			randomTokens[ key ] = randomiseTokens(value);
		}
		else {
			randomTokens[ key ] = value;
		}
	});

	return randomTokens;
};

const {
	fontFamily,
	baseFontSize,
	typeScale,
	spacingScale,
	radiiScale,
	darkMode,
	color,
	unit,
	prefix
} = randomiseTokens(toggles);


// --------------------------------------
// Create tokens
// --------------------------------------

// Generate font sizes
const generateFontSizes = (typeScale, baseFontSize, unit, maxFontSizes = 6) => {
	return Array.from(Array(maxFontSizes).keys()).map(i => {
		return unit === 'rem'
			? `${round(Math.pow(typeScale, i), 2)}rem`
			: `${round(baseFontSize * Math.pow(typeScale, i), 2)}px`;
	});
};

// Generate spacing for margin and padding
const generateSpace = (spacingScale, baseFontSize, unit, maxSpace = 9) => {
	return Array.from(Array(maxSpace).keys()).map(i => {
		return unit === 'rem'
			? `${round(spacingScale * i, 2)}rem` 
			: `${round(baseFontSize * spacingScale * i, 2)}px`;
	});
};

// Generate radii for border-radius
const generateRadii = (radiiScale, baseFontSize, unit, maxRadii = 4) => {
	return Array.from(Array(maxRadii).keys()).map(i => {
		return unit === 'rem'
			? `${radiiScale * i}rem`
			: `${baseFontSize * radiiScale * i}px`;
	});
};

// Generate color palette
const generatePalette = (darkMode, color) => ({
		background: darkMode ? color.black : color.white,
		foreground: darkMode ? color.white : color.black,
		'foreground-link': color.blue,
		...color
});

// Follows https://github.com/system-ui/theme-specification
const tokens = {
	fonts: {
		body: fontFamily.body,
		heading: fontFamily.heading,
		monospace: fontFamily.monospace,
	},
	fontSizes: generateFontSizes(typeScale, baseFontSize, unit),
	space: generateSpace(spacingScale, baseFontSize, unit),
	radii: [...generateRadii(radiiScale, baseFontSize, unit), '9999px', '100%'],
	colors: generatePalette( darkMode, color ),
};


// --------------------------------------
// Render tokens to css variables and options
// --------------------------------------

// convert camel to sentance case
const camelCaseToSentanceCase = ( text ) => 
	text.charAt(0).toUpperCase() + ( text.replace( /([A-Z])/g, " $1" ) ).toLowerCase().slice(1);

// convert string to css variable
const stringToCssVariable = ( text ) => `--${prefix}-${text}`.toLowerCase();

// Generate css variables
const generateCssVariables = (tokens, cssVariables = {}) => {
	Object.entries(tokens).forEach(([key,value]) => {
		if(Array.isArray(value)){
			value.forEach((item, i ) => {
				cssVariables[stringToCssVariable(`${key}-${i}`)] = item;
			});
		}
		else if(value === Object(value)){
			Object.entries(value).forEach(([childKey, childValue]) => {
				cssVariables[stringToCssVariable(`${key}-${childKey}`)] = childValue;
			});
		}
		else {
			cssVariables[ key ] = value;
		}
	});

	return {
		[stringToCssVariable('base-font-size')]: `${baseFontSize}px`,
		...cssVariables
	};
}

// --------------------------------------
// Apply the css variables to the DOM
// --------------------------------------
const applyCssVariablesDOM = (cssVariables, rootElement) => {
	rootElement.removeAttribute('style');
	Object.entries(cssVariables).forEach(([key, value]) => {
		rootElement.style.setProperty(key, value);
	});
};

const root = document.documentElement;
const cssVariables = generateCssVariables(tokens);
applyCssVariablesDOM(cssVariables,root);


console.log(tokens);
console.log(cssVariables);