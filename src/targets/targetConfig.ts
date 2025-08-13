export type TargetConfig =
  | { type: "dialog"; src: string; dialog: "base" | "projects" }
  | { type: "link"; src: string; url: string }
  | { type: "dummy" };

// Configuration for the 4x5 grid of targets displayed in the game.
// Icons are loaded from Icons8 and links can easily be changed here.
export const TARGET_CONFIG: TargetConfig[] = [
  // Row 1 (top)
  {
    type: "link",
    src: "https://img.icons8.com/color/48/linkedin.png",
    url: "https://www.linkedin.com",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/twitter--v1.png",
    url: "https://twitter.com",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/stackoverflow.png",
    url: "https://stackoverflow.com",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/github.png",
    url: "https://github.com",
  },
  { type: "dummy" },

  // Row 2
  {
    type: "link",
    src: "https://img.icons8.com/color/48/instagram-new.png",
    url: "https://www.instagram.com",
  },
  {
    type: "dialog",
    src: "https://img.icons8.com/color/48/code-file.png",
    dialog: "projects",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/film-reel.png",
    url: "#",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/briefcase.png",
    url: "#",
  },
  { type: "dummy" },

  // Row 3
  { type: "dummy" },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/github.png",
    url: "https://github.com",
  },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },

  // Row 4 (bottom)
  {
    type: "dialog",
    src: "https://img.icons8.com/color/48/info--v1.png",
    dialog: "base",
  },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
];

