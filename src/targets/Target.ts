export default abstract class Target {
  x: number;
  y: number;
  width: number;
  height: number;
  img: HTMLImageElement | HTMLCanvasElement | null = null;
  loaded = false;

  constructor(x: number, y: number, width: number, height: number, src?: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const size = 16;
        const px = document.createElement("canvas");
        px.width = size;
        px.height = size;
        const pctx = px.getContext("2d");
        if (pctx) {
          pctx.imageSmoothingEnabled = false;
          pctx.drawImage(img, 0, 0, size, size);
          this.img = px;
        }
        this.loaded = true;
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        this.img = null;
        this.loaded = true;
      };
      img.src = src;
    } else {
      this.loaded = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.img && this.loaded) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.beginPath();
      ctx.ellipse(
        Math.round(this.x + this.width / 2),
        Math.round(this.y + this.height / 2),
        Math.round(this.width / 2),
        Math.round(this.height / 2),
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(
        this.img,
        Math.round(this.x),
        Math.round(this.y),
        Math.round(this.width),
        Math.round(this.height)
      );
      ctx.restore();
    } else {
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.ellipse(
        Math.round(this.x + this.width / 2),
        Math.round(this.y + this.height / 2),
        Math.round(this.width / 2),
        Math.round(this.height / 2),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  abstract onHit(): void;
}
