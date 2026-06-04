const createConverter = (fromUnit: string, toUnit: string) => {
  const conversionRates: Record<string, (value: number) => number> = {
    'miles-km': value => value * 1.60934,
    'km-miles': value => value / 1.60934
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

  if (selectedType === 'miles-km') {
    return {
      converter: createConverter('miles', 'km'),
      label: 'km'
    };
  }

  return {
    converter: createConverter('km', 'miles'),
    label: 'miles'
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
document.getElementById("convertBtn")!.addEventListener("click", () => {
  const input = (document.getElementById("inputValue") as HTMLInputElement).value;
  const type = (document.getElementById("conversionType") as HTMLSelectElement).value;
  const resultElement = document.getElementById("result")!;

  let values: number | number[];

  // Handle input
  if (input.includes(",")) {
    values = input
      .split(",")
      .map(v => Number(v.trim()))
      .filter(v => !isNaN(v));
  } else {
    values = Number(input);
  }

  // Validation
  if (
    (Array.isArray(values) && values.length === 0) ||
    (!Array.isArray(values) && isNaN(values))
  ) {
    resultElement.textContent = "Please enter valid number(s).";
    return;
  }

  let result;

  if (type === "milesToKm") {
    result = createConverter("miles", "km")(values);
  } else {
    result = createConverter("km", "miles")(values);
  }

  // Display result
  if (Array.isArray(result)) {
    resultElement.textContent = result.map(v => v.toFixed(2)).join(", ");
  } else {
    resultElement.textContent = result.toFixed(2);
  }
});