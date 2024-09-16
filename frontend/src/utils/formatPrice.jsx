export const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
// export const formatPrice = (price) => {
//   let [integerPart, decimalPart] = price.toString().split('.');
//   integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//   if (decimalPart) {
//     decimalPart = decimalPart.slice(0, 3);
//     return `${integerPart},${decimalPart}`;
//   }

//   return integerPart;
// };
