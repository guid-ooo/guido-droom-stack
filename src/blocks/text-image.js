import { esc } from "../util.js";

export const type = "text_image";

export function render(b) {
  const imageLeft = b.layout === "left";
  const textCol =
    '<div class="prose prose-slate max-w-none">' + (b.text || "") + "</div>";
  const imgCol = b.image
    ? '<img src="' + esc(b.image) + '" alt="" class="rounded-2xl shadow-md aspect-[4/3] object-cover w-full" />'
    : "";
  return (
    '<div class="grid md:grid-cols-2 gap-8 items-center">' +
      (imageLeft ? imgCol + textCol : textCol + imgCol) +
    "</div>"
  );
}

export function mount() {}
