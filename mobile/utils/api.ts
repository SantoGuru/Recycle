export async function apiFetch<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);

  let data: any = null;

  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    let message = "Erro na requisição";

    if (Array.isArray(data) && data[0]?.message) {
      message = data[0].message;
    } else if (data?.message) {
      message = data.message;
    }

    throw new Error(message);
  }

  return data as T;
}
