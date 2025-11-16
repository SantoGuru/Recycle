type valueType = string | number | null | undefined;

export function convertToReal(value: valueType) {
  if (value === null || value === undefined) return;
  if (typeof value === "string") value = Number(value);

  const valueReal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return valueReal.toString();
}
