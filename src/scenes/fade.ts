import Phaser from "phaser";

const FADE_RGB = [4, 2, 12] as const;
const FADE_OUT_MS = 450;

const leaving = new WeakSet<Phaser.Scene>();

export function fadeIn(scene: Phaser.Scene, ms = 400): void {
  scene.cameras.main.fadeIn(ms, ...FADE_RGB);
}

export function fadeTo(scene: Phaser.Scene, next: string, data?: object): void {
  if (leaving.has(scene)) return;
  leaving.add(scene);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => leaving.delete(scene));
  const camera = scene.cameras.main;
  camera.fadeOut(FADE_OUT_MS, ...FADE_RGB);
  camera.once("camerafadeoutcomplete", () => scene.scene.start(next, data));
}

export function isLeaving(scene: Phaser.Scene): boolean {
  return leaving.has(scene);
}
