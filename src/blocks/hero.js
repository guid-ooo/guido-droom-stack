import { esc } from "../util.js";

export const type = "hero";

export function render(b) {
  const image = b.image
    ? '<img src="' + esc(b.image) + '" alt="" class="w-full aspect-[16/9] object-cover rounded-2xl shadow-md" />'
    : "";
  const heading = b.heading
    ? '<h2 class="mt-8 text-4xl md:text-5xl font-semibold tracking-tight">' + esc(b.heading) + "</h2>"
    : "";
  const description = b.description
    ? '<p class="mt-3 text-base text-slate-600 max-w-2xl">' + esc(b.description) + "</p>"
    : "";
  return (
    '<div class="hero-block">' +
      image +
      '<div class="text-center flex flex-col items-center">' +
        heading +
        description +
      "</div>" +
    "</div>"
  );
}

export function mount() {}
