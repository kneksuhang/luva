import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format harga ke format Rupiah standar Indonesia dengan pemisah titik
 * Contoh: 1850000 -> "Rp 1.850.000"
 */
export function formatRupiah(amount: number | string | null | undefined): string {
  const numericValue = typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0;
  
  const formattedNumber = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);

  return `Rp ${formattedNumber}`;
}

/**
 * Mengubah string input (misal "Rp 1.500.000" atau "1500000") menjadi angka murni
 */
export function parseRupiahInput(value: string): number {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

/**
 * Ekstraksi favicon otomatis dari domain URL
 */
export function getFaviconFromUrl(url: string): string {
  if (!url) return '';
  try {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;
    const parsed = new URL(formattedUrl);
    const domain = parsed.hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

/**
 * Format tanggal bergaya estetika bersih
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const parsed = parseISO(dateString);
    return format(parsed, 'd MMMM yyyy', { locale: localeId });
  } catch {
    return dateString;
  }
}
