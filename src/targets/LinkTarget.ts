import Target from "./Target";

export default class LinkTarget extends Target {
  private url: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    src: string,
    url: string
  ) {
    super(x, y, width, height, src);
    this.url = url;
  }

  onHit() {
    window.open(this.url, "_blank");
  }
}
