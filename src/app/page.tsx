"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef({ left: false, right: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const width = canvas.width;
    const height = canvas.height;

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

    const invaderData = [
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
        url: "https://www.instagram.com",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png",
        url: "https://www.facebook.com",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/fr/c/c8/Twitter_Bird.svg",
        url: "https://twitter.com",
      },
      {
        src: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Youtube_logo.png",
        url: "https://www.youtube.com",
      },
      { dead: true },
      { dead: true },
    ];

    const invaders = invaderData.map((data, i) => {
      const inv = {
        x: 20 + i * 30,
        y: 20,
        width: 20,
        height: 14,
        url: data.url ?? null,
        dead: !!data.dead,
        img: null as HTMLImageElement | null,
        loaded: false,
      };
      if (data.src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          inv.loaded = true;
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${data.src}`);
          inv.loaded = true;
        };
        img.src = data.src;
        inv.img = img;
      } else {
        inv.loaded = true;
      }
      return inv;
    });

    function shoot() {
      bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        rx: 1,
        ry: 2,
        speed: 5,
      });
    }

    function keyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
    }

    function keyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
      if (e.key === "ArrowUp") shoot();
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
        for (let j = 0; j < invaders.length; j++) {
          const inv = invaders[j];
          if (
            b.x - b.rx < inv.x + inv.width &&
            b.x + b.rx > inv.x &&
            b.y - b.ry < inv.y + inv.height &&
            b.y + b.ry > inv.y
          ) {
            if (inv.url) {
              window.open(inv.url, "_blank");
              invaders.splice(j, 1);
            }
            bullets.splice(i, 1);
            break bulletsLoop;
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

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

      ctx.fillStyle = "yellow";
      bullets.forEach((b) => {
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      invaders.forEach((inv) => {
        if (inv.img && inv.loaded) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(
            inv.x + inv.width / 2,
            inv.y + inv.height / 2,
            inv.width / 2,
            inv.height / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.clip();
          ctx.drawImage(inv.img, inv.x, inv.y, inv.width, inv.height);
          ctx.restore();
        } else {
          ctx.fillStyle = "gray";
          ctx.beginPath();
          ctx.ellipse(
            inv.x + inv.width / 2,
            inv.y + inv.height / 2,
            inv.width / 2,
            inv.height / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
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
    };
  }, []);

  const startLeft = () => (keys.current.left = true);
  const stopLeft = () => (keys.current.left = false);
  const startRight = () => (keys.current.right = true);
  const stopRight = () => (keys.current.right = false);

  return (
    <div className={styles.gameContainer}>
      <canvas
        ref={canvasRef}
        width={200}
        height={150}
        className={styles.canvas}
      />
      <div className={styles.controls}>
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
    </div>
  );
}

