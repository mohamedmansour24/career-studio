export function resolveAssetUrl(
  asset: { external_url: string | null; storage_path: string | null } | null
) {
  if (!asset) return null;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  if (asset.storage_path) {
    // storage_path already includes bucket
    return `${base}/storage/v1/object/public/${asset.storage_path}`;
  }

  if (asset.external_url) return asset.external_url;

  return null;
}
