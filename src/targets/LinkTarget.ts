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
    const link = document.createElement("a");
    link.href = this.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }
}
