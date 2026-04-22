import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { esc } from "../util.js";

export const type = "gallery";

export function render(b) {
  const slides = (b.images || [])
    .map(
      (src) =>
        '<div class="keen-slider__slide">' +
          '<img src="' + esc(src) + '" alt="" class="rounded-2xl aspect-[4/3] object-cover w-full" draggable="false" />' +
        "</div>"
    )
    .join("");
  return '<div class="keen-slider gallery-slider">' + slides + "</div>";
}

export function mount(root) {
  root.querySelectorAll(".gallery-slider").forEach((el) => {
    if (el.dataset.kSlider) return; // already mounted
    new KeenSlider(el, {
      loop: false,
      slides: { perView: 1.1, spacing: 16 },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 1.8, spacing: 20 },
        },
      },
    });
    el.dataset.kSlider = "1";
  });
}
