export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const parseCurrency = (currencyString) => {
  return parseFloat(currencyString.replace(/[^\d.-]/g, ''));
};
