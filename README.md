# 👾 Space Invaders Portfolio

> A playful experiment powered almost entirely by AI.
> This repository is about **99% AI-generated**, exploring what Codex can do.
> Think of it as a fun demo rather than a polished portfolio.
> Built with ❤️ by curious humans and a lot of silicon.

Blast a few pixel aliens and open dialog boxes or links along the way – this
little game showcases what AI tooling can whip up with Next.js. Controls are as
old-school as it gets: move with ◀ ▶ and fire with space/🚀.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the game by modifying `src/app/page.tsx`. The page
auto‑updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker

To build and run the production image locally:

```bash
docker build -t space-invaders-portfolio .
docker run -p 3000:3000 space-invaders-portfolio
```

The app is then available at [http://localhost:3000](http://localhost:3000).

## Continuous Deployment

This repository includes a GitHub Actions workflow that builds a Docker image and deploys it to a VPS on every push to the `master` branch.

To enable deployments you must configure the following repository secrets:

| Secret | Description |
| ------ | ----------- |
| `SSH_HOST` | VPS hostname or IP address |
| `SSH_USER` | SSH user with permission to run Docker |
| `SSH_PASSWORD` | Password for the SSH user |
| `GHCR_USERNAME` *(optional)* | Username for GitHub Container Registry |
| `GHCR_TOKEN` *(optional)* | Token with `read:packages` for private images |

The workflow publishes the image to GitHub Container Registry at `ghcr.io/<owner>/<repo>:latest` and then pulls and runs the container on your server.

On the VPS the container listens on port `3000` and can be proxied or exposed as needed.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
