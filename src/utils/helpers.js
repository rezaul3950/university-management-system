export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatCurrency(amount, currency = "BDT") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}