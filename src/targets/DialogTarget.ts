import Target from "./Target";

export default class DialogTarget extends Target {
  private openDialog: () => void;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    src: string,
    openDialog: () => void
  ) {
    super(x, y, width, height, src);
    this.openDialog = openDialog;
  }

  onHit() {
    this.openDialog();
  }
}
