const usdIntl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatMoney = (num) => {
  return num ? usdIntl.format(num) : 0;
};
