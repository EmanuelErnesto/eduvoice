export const getAssetPath = (assetPath: string): string => {
  const base = import.meta.env.BASE_URL;
  const cleanPath = assetPath.startsWith("/")
    ? assetPath.substring(1)
    : assetPath;
  return `${base}${cleanPath}`;
};
