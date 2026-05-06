/** Construye URL bajo `gatewayBaseUrl` (absoluta, relativa o ruta a partir del origen). */
export function buildGatewayUrl(gatewayBaseUrl: string, path: string): string {
  const base = gatewayBaseUrl.replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  if (!base) {
    return `/${p}`;
  }
  if (base.startsWith('http://') || base.startsWith('https://') || base.startsWith('//')) {
    return `${base}/${p}`;
  }
  if (base.startsWith('/')) {
    return `${base}/${p}`.replace(/\/{2,}/g, '/');
  }
  return `/${base}/${p}`.replace(/\/{2,}/g, '/');
}
