import Target from "./Target";

/**
 * Dummy targets are simple placeholders that disappear when hit.
 * They use a spaceship image to blend in with the space theme.
 */
export default class DummyTarget extends Target {
  onHit() {}
}
