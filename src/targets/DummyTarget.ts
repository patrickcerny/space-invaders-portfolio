import Target from "./Target";

/**
 * Dummy targets are simple placeholders that disappear when hit.
 * They render a small pixelated alien instead of loading an image.
 */
export default class DummyTarget extends Target {
  private static pixels = [
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 1, 0, 0],
  ];

  draw(ctx: CanvasRenderingContext2D) {
    const pixelW = this.width / DummyTarget.pixels[0].length;
    const pixelH = this.height / DummyTarget.pixels.length;
    ctx.fillStyle = "white";
    DummyTarget.pixels.forEach((row, y) =>
      row.forEach((val, x) => {
        if (val) {
          ctx.fillRect(
            this.x + x * pixelW,
            this.y + y * pixelH,
            pixelW,
            pixelH
          );
        }
      })
    );
  }

  onHit() {}
}
