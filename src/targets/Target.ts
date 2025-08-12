export default abstract class Target {
  x: number;
  y: number;
  width: number;
  height: number;
  img: HTMLImageElement | null = null;
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
        this.loaded = true;
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        this.loaded = true;
      };
      img.src = src;
      this.img = img;
    } else {
      this.loaded = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.img && this.loaded) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.restore();
    } else {
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  abstract onHit(): void;
}
