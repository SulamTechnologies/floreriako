const mxnFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return mxnFormatter.format(cents / 100);
}
