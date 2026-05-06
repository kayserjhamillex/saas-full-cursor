/**
 * Convierte un File a su representación base64 (sin el prefijo data URL).
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const parts = result.split(',');
      resolve(parts.length > 1 ? parts[1] : '');
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
