export function cdnImage(image: string) {
  const webpImage = image.replace(/\.(png|PNG|jpg|JPG)$/, ".webp");
  return `https://images.ti4.thecastle.dev${webpImage}?v=4`;
}
