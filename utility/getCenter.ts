export function getCenterOnContainedImage(
  box: [number, number, number, number],
  origW: number,
  origH: number,
  screenW: number,
  screenH: number
): { top: number; left: number }  {
  const [xmin, ymin, xmax, ymax] = box;

  const centerX = (xmin + xmax) / 2;
  const centerY = (ymin + ymax) / 2;
  const imageRatio = origW / origH;
  const screenRatio = screenW / screenH;

  let displayedW, displayedH, offsetX, offsetY;

  if (imageRatio > screenRatio) {
    displayedW = screenW;
    displayedH = screenW / imageRatio;
    offsetX = 0;
    offsetY = (screenH - displayedH) / 2; // vertical padding
  } else {
    displayedH = screenH;
    displayedW = screenH * imageRatio;
    offsetY = 0;
    offsetX = (screenW - displayedW) / 2; // horizontal padding
  }

  const scaleX = displayedW / origW;
  const scaleY = displayedH / origH;

  const screenX = centerX * scaleX + offsetX;
  const screenY = centerY * scaleY + offsetY;

  return {
    top: screenY,
    left: screenX,
  };
}
