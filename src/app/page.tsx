'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import DialogTarget from '@/targets/DialogTarget';
import LinkTarget from '@/targets/LinkTarget';
import DeadTarget from '@/targets/DeadTarget';
import Target from '@/targets/Target';
import BaseInfoDialog from '@/components/dialogs/BaseInfoDialog';
import ProjectsDialog from '@/components/dialogs/ProjectsDialog';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef({ left: false, right: false });
  const [dialog, setDialog] = useState<'base' | 'projects' | null>(null);

  const targets = useRef<Target[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const width = canvas.width;
    const height = canvas.height - 40;

    const pixelSize = 2;
    const shipPixels = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ];

    const player = {
      x: width / 2 - (shipPixels[0].length * pixelSize) / 2,
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

    const targetData = [
      {
        type: 'dialog' as const,
        src: 'https://img.icons8.com/ios-filled/50/info.png',
        action: () => setDialog('base'),
      },
      {
        type: 'dialog' as const,
        src: 'https://img.icons8.com/ios-filled/50/code-file.png',
        action: () => setDialog('projects'),
      },
      {
        type: 'link' as const,
        src: 'https://img.icons8.com/ios-filled/50/instagram-new.png',
        url: 'https://www.instagram.com',
      },
      {
        type: 'link' as const,
        src: 'https://img.icons8.com/ios-filled/50/twitter.png',
        url: 'https://twitter.com',
      },
      {
        type: 'dead' as const,
        src: 'https://img.icons8.com/ios-filled/50/skull.png',
      },
    ];

    targets.current = targetData.map((data, i) => {
      const x = 20 + i * 30;
      const y = 20;
      const width = 20;
      const height = 14;
      switch (data.type) {
        case 'dialog':
          return new DialogTarget(x, y, width, height, data.src, data.action);
        case 'link':
          return new LinkTarget(x, y, width, height, data.src, data.url);
        case 'dead':
          return new DeadTarget(x, y, width, height, data.src);
      }
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
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
    }

    function keyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'ArrowUp') shoot();
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
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'white';
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

      ctx.fillStyle = 'yellow';
      bullets.forEach((b) => {
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.rx, b.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      targets.current.forEach((t) => t.draw(ctx));
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
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
        <button className={styles.controlButton}>X</button>
      </div>
      {dialog === 'base' && <BaseInfoDialog onClose={() => setDialog(null)} />}
      {dialog === 'projects' && (
        <ProjectsDialog onClose={() => setDialog(null)} />
      )}
    </div>
  );
}
