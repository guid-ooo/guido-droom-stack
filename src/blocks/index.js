import * as gallery from "./gallery.js";
import * as textImage from "./text-image.js";

const registry = Object.fromEntries([gallery, textImage].map((m) => [m.type, m]));

export function renderBlocks(blocks) {
  if (!blocks || !blocks.length) return "";
  return blocks
    .map((b) => {
      const mod = registry[b._block];
      return mod ? '<section class="mb-16">' + mod.render(b) + "</section>" : "";
    })
    .join("");
}

export function mountBlocks(container) {
  if (!container) return;
  Object.values(registry).forEach((mod) => mod.mount && mod.mount(container));
}
