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
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;
    ctx.imageSmoothingEnabled = false;

    const width = canvas.width;
    const height = canvas.height;

    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const pixelSize = 2;
    const shipPixels = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ];

    const player = {
      x:
        width / 2 - (shipPixels[0].length * pixelSize) / 2,
      y: height - shipPixels.length * pixelSize - 2,
      width: shipPixels[0].length * pixelSize,
      height: shipPixels.length * pixelSize,
      speed: 2,
    };

    const bullets: {
      x: number;
      y: number;
      rx: number;
      ry: number;
      speed: number;
    }[] = [];

    targets.current = TARGET_CONFIG.map((data, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 20 + col * 30;
      const y = 20 + row * 30;
      const width = 20;
      const height = 14;
      switch (data.type) {
        case "dialog":
          return new DialogTarget(
            x,
            y,
            width,
            height,
            data.src,
            () => setDialog(data.dialog)
          );
        case "link":
          return new LinkTarget(x, y, width, height, data.src, data.url);
        case "dummy":
          return new DummyTarget(x, y, width, height);
      }
    });

    let targetDirection = 1;
    let targetSteps = 0;
    const targetInterval = setInterval(() => {
      targets.current.forEach((t) => {
        t.x += 10 * targetDirection;
      });
      targetSteps++;
      if (targetSteps === 3) {
        targetDirection *= -1;
        targetSteps = 0;
      }
    }, 2000);

    function shoot() {
      setShowInstructions(false);
      bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        rx: 2,
        ry: 6,
        speed: 5,
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

      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      bullets.forEach((b) => {
        ctx.fillText("🚀", b.x, b.y);
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
      clearInterval(targetInterval);
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
          <h2>Welcome, pilot!</h2>
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

