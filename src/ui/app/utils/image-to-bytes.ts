export class ImageToBytes {

  load(srcUrl: string): Promise<Uint8Array> {
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = srcUrl;

    return new Promise<Uint8Array>((resolve, reject) => {
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        canvasContext.drawImage(image, 0, 0);
        const imageData = canvasContext.getImageData(0, 0, image.width, image.height);
        this.encode(canvas, canvasContext, imageData).then(imageBytes => resolve(imageBytes), err => reject(err));
      };
    });
  }

  private encode(canvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D, imageData: ImageData): Promise<Uint8Array> {
    canvasContext.putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
            reader.onerror = () => reject(new Error('Could not read from blob'));
            reader.readAsArrayBuffer(blob);
        });
    });
  }
}
