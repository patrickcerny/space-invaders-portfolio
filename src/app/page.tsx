"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import DialogTarget from "@/targets/DialogTarget";
import LinkTarget from "@/targets/LinkTarget";
import DummyTarget from "@/targets/DummyTarget";
import Target from "@/targets/Target";
import { TARGET_CONFIG } from "@/targets/targetConfig";
import BaseInfoDialog from "@/components/dialogs/BaseInfoDialog";
import ProjectsDialog from "@/components/dialogs/ProjectsDialog";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef({ left: false, right: false });
  const [dialog, setDialog] = useState<"base" | "projects" | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const targets = useRef<Target[]>([]);
  const shootRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    type SmoothingCtx = CanvasRenderingContext2D & {
      mozImageSmoothingEnabled?: boolean;
      webkitImageSmoothingEnabled?: boolean;
      msImageSmoothingEnabled?: boolean;
    };
    const ctx = canvas.getContext("2d") as SmoothingCtx | null;
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    let width = 0;
    let height = 0;
    let scale = 1;
    let pixelSize = 2;
    let targetDir = 1;
    let targetTick = 0;
    let player: {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
    };
    let bullets: {
      x: number;
      y: number;
      rx: number;
      ry: number;
      speed: number;
    }[] = [];
    let stars: { x: number; y: number }[] = [];

    const shipPixels = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ];

    const bulletPixels = [
      [0, 1, 0],
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
      [1, 0, 1],
      [1, 0, 1],
      [0, 1, 0],
    ];

    const init = () => {
      const container = canvas.parentElement as HTMLElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      width = canvas.width;
      height = canvas.height;
      scale = width / 200;
      pixelSize = 2 * scale;

      const controls = container.querySelector(
        `.${styles.controls}`
      ) as HTMLElement | null;
      const bottomSpace = controls ? controls.clientHeight + 16 * scale : 0;

      player = {
        x: width / 2 - (shipPixels[0].length * pixelSize) / 2,
        y: height - bottomSpace - shipPixels.length * pixelSize,
        width: shipPixels[0].length * pixelSize,
        height: shipPixels.length * pixelSize,
        speed: 2 * scale,
      };

      bullets = [];
      stars = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));

      const targetWidth = 20 * scale;
      const targetHeight = 14 * scale;
      const cols = 5;
      const marginX = width * 0.05;
      const marginY = height * 0.05;
      const xSpacing =
        cols > 1 ? (width - marginX * 2 - targetWidth) / (cols - 1) : 0;
      const ySpacing = targetHeight * 1.5;

      targets.current = TARGET_CONFIG.map((data, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = marginX + col * xSpacing;
        const y = marginY + row * ySpacing;
        const w = targetWidth;
        const h = targetHeight;
        switch (data.type) {
          case "dialog":
            return new DialogTarget(
              x,
              y,
              w,
              h,
              data.src,
              () => setDialog(data.dialog)
            );
          case "link":
            return new LinkTarget(x, y, w, h, data.src, data.url);
          case "dummy":
            return new DummyTarget(x, y, w, h);
        }
      });
    };

    init();
    window.addEventListener("resize", init);

    let lastShot = 0;
    function shoot() {
      const now = performance.now();
      if (now - lastShot < 1000) return;
      lastShot = now;
      setShowInstructions(false);
      const bw = bulletPixels[0].length * pixelSize;
      const bh = bulletPixels.length * pixelSize;
      bullets.push({
        x: player.x + player.width / 2,
        y: player.y - bh / 2,
        rx: bw / 2,
        ry: bh / 2,
        speed: 5 * scale,
      });
    }

    shootRef.current = shoot;

    function keyDown(e: KeyboardEvent) {
      setShowInstructions(false);
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
      if (e.key === " " || e.code === "Space") shoot();
    }

    function keyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
    }

    function update() {
      if (keys.current.left) player.x -= player.speed;
      if (keys.current.right) player.x += player.speed;
      player.x = Math.max(0, Math.min(width - player.width, player.x));

      // move targets horizontally in chunky steps
      if (targets.current.length) {
        targetTick++;
        if (targetTick >= 10) {
          targetTick = 0;
          const step = Math.round(pixelSize) * targetDir;
          targets.current.forEach((t) => (t.x += step));
          const left = Math.min(...targets.current.map((t) => t.x));
          const right = Math.max(...targets.current.map((t) => t.x + t.width));
          if (left < 0 || right > width) {
            targets.current.forEach((t) => (t.x -= step));
            targetDir *= -1;
          }
        }
      }

      bullets.forEach((b) => (b.y -= b.speed));
      for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y + bullets[i].ry < 0) bullets.splice(i, 1);
      }

      bulletsLoop: for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        for (let j = 0; j < targets.current.length; j++) {
          const t = targets.current[j];
          if (
            b.x - b.rx < t.x + t.width &&
            b.x + b.rx > t.x &&
            b.y - b.ry < t.y + t.height &&
            b.y + b.ry > t.y
          ) {
            t.onHit();
            targets.current.splice(j, 1);
            bullets.splice(i, 1);
            break bulletsLoop;
          }
        }
      }
    }

    function draw() {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      stars.forEach((s) => {
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 2);
      });

      ctx.fillStyle = "white";
      shipPixels.forEach((row, ry) =>
        row.forEach((pixel, rx) => {
          if (pixel) {
            ctx.fillRect(
              player.x + rx * pixelSize,
              player.y + ry * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        })
      );

      bullets.forEach((b) => {
        bulletPixels.forEach((row, ry) =>
          row.forEach((pixel, rx) => {
            if (pixel) {
              ctx.fillRect(
                b.x - b.rx + rx * pixelSize,
                b.y - b.ry + ry * pixelSize,
                pixelSize,
                pixelSize
              );
            }
          })
        );
      });

      targets.current.forEach((t) => t.draw(ctx));
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("resize", init);
    };
  }, []);

  const startLeft = () => {
    setShowInstructions(false);
    keys.current.left = true;
  };
  const stopLeft = () => (keys.current.left = false);
  const startRight = () => {
    setShowInstructions(false);
    keys.current.right = true;
  };
  const stopRight = () => (keys.current.right = false);
  const handleShoot = () => {
    setShowInstructions(false);
    shootRef.current();
  };

  return (
    <div className={styles.gameContainer}>
      <canvas
        ref={canvasRef}
        width={200}
        height={150}
        className={styles.canvas}
      />
      {showInstructions && (
        <div className={styles.instructions}>
          <h2>Welcome Pirate!</h2>
          <p>Use ◀ ▶ to move and 🚀 or spacebar to shoot</p>
        </div>
      )}
      <div className={styles.controls}>
        <div className={styles.moveControls}>
          <button
            className={styles.controlButton}
            onMouseDown={startLeft}
            onMouseUp={stopLeft}
            onMouseLeave={stopLeft}
            onTouchStart={startLeft}
            onTouchEnd={stopLeft}
          >
            ◀
          </button>
          <button
            className={styles.controlButton}
            onMouseDown={startRight}
            onMouseUp={stopRight}
            onMouseLeave={stopRight}
            onTouchStart={startRight}
            onTouchEnd={stopRight}
          >
            ▶
          </button>
        </div>
        <button
          className={styles.controlButton}
          onMouseDown={handleShoot}
          onTouchStart={handleShoot}
        >
          🚀
        </button>
      </div>
      {dialog === "base" && <BaseInfoDialog onClose={() => setDialog(null)} />}
      {dialog === "projects" && <ProjectsDialog onClose={() => setDialog(null)} />}
    </div>
  );
}

