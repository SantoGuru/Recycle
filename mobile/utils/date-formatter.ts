import {
  format,
  formatDistanceToNow as dateFnsformatDistanceToNow,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDatetime(rawDate: string): string {
  const date = new Date(rawDate);

  return format(date, "dd/MM/yy", {
    locale: ptBR,
  });
}

export function formatDatetimeExtensive(rawDate: string): string {
  const date = new Date(rawDate);

  return format(date, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
}

export function formatDistanceToNow(rawDate: string): string {
  const date = new Date(rawDate);

  return dateFnsformatDistanceToNow(date, {
    locale: ptBR,
    addSuffix: true,
  });
}
