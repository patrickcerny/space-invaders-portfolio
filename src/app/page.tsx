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

    const width = canvas.width;
    const height = canvas.height;

    const player = {
      x: width / 2 - 20,
      y: height - 40,
      width: 40,
      height: 20,
      speed: 5,
    };

    const bullets: {
      x: number;
      y: number;
      width: number;
      height: number;
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
    ];

    const invaders = invaderData.map((data, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = data.src;
      return {
        x: 80 + i * 120,
        y: 60,
        width: 50,
        height: 50,
        img,
        url: data.url,
      };
    });

    function shoot() {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 7,
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
        if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
      }

      bulletsLoop: for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        for (let j = 0; j < invaders.length; j++) {
          const inv = invaders[j];
          if (
            b.x < inv.x + inv.width &&
            b.x + b.width > inv.x &&
            b.y < inv.y + inv.height &&
            b.y + b.height > inv.y
          ) {
            window.open(inv.url, "_blank");
            invaders.splice(j, 1);
            bullets.splice(i, 1);
            break bulletsLoop;
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "white";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = "red";
      bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));

      invaders.forEach((inv) => {
        if (inv.img.complete) {
          ctx.drawImage(inv.img, inv.x, inv.y, inv.width, inv.height);
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
        width={800}
        height={600}
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

