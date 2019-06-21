const randomHex = () => {
  const hexMax = 256 * 256 * 256;
  return '#' + Math.floor(Math.random() * hexMax).toString(16).toUpperCase().padStart(6, '0');
}

const RandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const RandomArrayValue = (values) => values[RandomNumber(0, values.length - 1)];

const families = {
	'sans-serif': '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
	mono: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace',
	serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
	condensed: 'monospace',
};

const colors = {
	dark: '#24292e',
	light: '#fff',
}

const camelCaseToSentanceCase = ( text ) => 
	text.charAt(0).toUpperCase() + ( text.replace( /([A-Z])/g, " $1" ) ).toLowerCase().slice(1);

const camelCaseToCssVariable = ( text ) => `--🍭-${text.replace( /([A-Z])/g, "-$1" )}`.toLowerCase();

const template = (name, value) => `<div class="card pd-sm">
	<p><strong>${ name }:</strong> <span>${ value }</span></p>
</div>`;

const toggles = {
	fontFamily: Object.keys( families ),
	typeScale: [1.25, 1.33, 1.5],
	baseFontSize: ['16px', '18px'],
	spaceScale: [1, 2, 3],
	shape: ['curved', 'angled'],
	darkMode: [false, true],
	primaryColor: [randomHex()],
	secondaryColor: [randomHex()],
	// shadow: ['none', 'sm', 'lg'],
	// border: ['none', 'sm'],
};

const root = document.documentElement;
const togglesContainer = document.querySelector('.toggles');


Object.entries( toggles ).map(([toggleName, toggleValues]) => {
	const toggleValue = RandomArrayValue(toggleValues);

	if(toggleName === 'darkMode'){
		root.style.setProperty('--🍭-color-foreground', toggleValue ? colors.light : colors.dark);
		root.style.setProperty('--🍭-color-background', toggleValue ? colors.dark : colors.light);
		togglesContainer.innerHTML += template(camelCaseToSentanceCase(toggleName), toggleValue);
		return;
	}

	togglesContainer.innerHTML += template(camelCaseToSentanceCase(toggleName), toggleValue);

	let value;
	switch(toggleName) {
		case 'fontFamily':
			value = `var(--🍭-font-${toggleValue})`;
			break;
		case 'shape':
			value = `var(--🍭-shape-${toggleValue})`;
			break;
		default:
			value = toggleValue;
	}

	root.style.setProperty(camelCaseToCssVariable(toggleName), value);
});
