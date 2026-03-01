export const parseCSVNumbers = (text) => {
  const rows = text
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean);

  const numbers = rows.filter((r) => r.toLowerCase() !== 'mobile').map((r) => r.replace(/\D/g, ''));

  const valid = [];
  const invalid = [];

  numbers.forEach((num) => {
    if (/^[0-9]{10}$/.test(num)) {
      valid.push(num);
    } else {
      invalid.push(num);
    }
  });

  return {
    total: numbers.length,
    valid: [...new Set(valid)],
    invalid
  };
};

export const downloadInvalidCSV = (invalidNumbers) => {
  const content = `mobile\n${invalidNumbers.join('\n')}`;
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'invalid_numbers.csv';
  a.click();

  window.URL.revokeObjectURL(url);
};
