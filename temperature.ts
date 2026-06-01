const createConverter = (fromUnit: string, toUnit: string) => {
  const conversionRates: Record<string, (value: number) => number> = {
    'celsius-fahrenheit': value => value * 9 / 5 + 32,
    'fahrenheit-celsius': value => (value - 32) * 5 / 9
  };

  const conversionKey = `${fromUnit}-${toUnit}`;
  const convertValue = conversionRates[conversionKey];

  return (input: number | number[]): number | number[] => {
    if (Array.isArray(input)) {
      return input.map(value => convertValue(value));
    }

    return convertValue(input);
  };
};

const getSelectedConverter = () => {
  const selectedType = (document.getElementById('conversionType') as HTMLSelectElement).value;

  if (selectedType === 'celsius-fahrenheit') {
    return {
      converter: createConverter('celsius', 'fahrenheit'),
      label: '\u00B0F'
    };
  }

  return {
    converter: createConverter('fahrenheit', 'celsius'),
    label: '\u00B0C'
  };
};

document.getElementById('convertSingle')!.addEventListener('click', () => {
  const singleValue = Number((document.getElementById('singleValue') as HTMLInputElement).value);
  const resultElement = document.getElementById('result')!;

  if (Number.isNaN(singleValue)) {
    resultElement.textContent = 'Please enter a number.';
    return;
  }

  const selectedConverter = getSelectedConverter();
  const convertedValue = selectedConverter.converter(singleValue) as number;
  resultElement.textContent = `${singleValue} converts to ${convertedValue.toFixed(2)} ${selectedConverter.label}`;
});

document.getElementById('convertList')!.addEventListener('click', () => {
  const valueList = (document.getElementById('valueList') as HTMLInputElement).value
    .split(',')
    .map(value => Number(value.trim()))
    .filter(value => !Number.isNaN(value));
  const resultElement = document.getElementById('result')!;

  if (valueList.length === 0) {
    resultElement.textContent = 'Please enter a comma-separated list of numbers.';
    return;
  }

  const selectedConverter = getSelectedConverter();
  const convertedValues = selectedConverter.converter(valueList) as number[];
  resultElement.textContent = `${convertedValues.map(value => value.toFixed(2)).join(', ')} ${selectedConverter.label}`;
});
