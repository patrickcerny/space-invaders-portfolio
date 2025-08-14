export type TargetConfig =
  | { type: "dialog"; src: string; dialog: "base" | "projects" }
  | { type: "link"; src: string; url: string }
  | { type: "dummy" };

// Configuration for the 3x5 grid of targets displayed in the game.
// Icons are loaded from Icons8 and links can easily be changed here.
export const TARGET_CONFIG: TargetConfig[] = [
  // Row 1
  {
    type: "link",
    src: "https://img.icons8.com/color/48/github.png",
    url: "https://github.com/patrickcerny",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/stackoverflow.png",
    url: "https://stackoverflow.com/users/13879137/patrick-cerny",
  },
  {
    type: "dialog",
    src: "https://img.icons8.com/color/48/info--v1.png",
    dialog: "base",
  },
  {
    type: "dialog",
    src: "https://img.icons8.com/color/48/code-file.png",
    dialog: "projects",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/instagram-new.png",
    url: "https://www.instagram.com/patrick.cerny/",
  },

  // Row 2
  {
    type: "link",
    src: "https://img.icons8.com/color/48/linkedin.png",
    url: "https://www.linkedin.com/in/patrickcerny/",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/film-reel.png",
    url: "https://www.otiosum-austria.com/",
  },
  {
    type: "link",
    src: "https://img.icons8.com/color/48/briefcase.png",
    url: "https://www.gmg.biz/start/default.aspx#Start",
  },
  { type: "dummy" },
  { type: "dummy" },

  // Row 3 - remaining dummy targets
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },

  // Row 4
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
  { type: "dummy" },
];

