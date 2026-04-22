import barba from "@barba/core";
import $ from "jquery";
import yaml from "js-yaml";
import { marked } from "marked";
import { esc } from "./util.js";
import { renderBlocks, mountBlocks } from "./blocks/index.js";
import "./style.css";

function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: md };
  let meta = {};
  try { meta = yaml.load(m[1]) || {}; } catch { meta = {}; }
  return { meta, body: m[2] };
}

// Post discovery -------------------------------------------------------------

const POSTS = Object.keys(import.meta.glob("/content/posts/*.md")).map((path) => ({
  slug: path.split("/").pop().replace(/\.md$/, ""),
  url: path,
}));

// Persistent header ----------------------------------------------------------

$.getJSON("/content/site.json", function (site) {
  document.title = site.title;
  $("#title").text(site.title);
  $("#subtitle").text(site.subtitle);
  $("#hero").attr("src", site.image);
});

// Renderers ------------------------------------------------------------------

function renderHome(root) {
  const $root = $(root);

  $.getJSON("/content/site.json", function (site) {
    $root.find("#posts-heading").text(site.posts_heading);
    const blocksEl = $root.find("#blocks")[0];
    blocksEl.innerHTML = renderBlocks(site.blocks);
    mountBlocks(blocksEl);
  });

  Promise.all(
    POSTS.map((p) =>
      Promise.resolve($.get(p.url)).then((md) =>
        Object.assign({ slug: p.slug }, parseFrontmatter(md).meta)
      )
    )
  ).then((posts) => {
    const $list = $root.find("#posts").empty();
    posts
      .sort((a, b) => (+a.order || 0) - (+b.order || 0))
      .forEach((p) => {
        $list.append(
          '<li>' +
            '<a href="/post.html?slug=' + esc(p.slug) + '" class="block rounded-2xl overflow-hidden bg-white border border-stone-200 hover:shadow-md transition">' +
              '<img src="' + esc(p.image) + '" alt="" class="aspect-[3/2] object-cover w-full" />' +
              '<div class="p-5">' +
                '<h3 class="font-semibold text-lg">' + esc(p.title) + "</h3>" +
                '<p class="mt-2 text-sm text-slate-600">' + esc(p.text) + "</p>" +
              "</div>" +
            "</a>" +
          "</li>"
        );
      });
  });
}

function renderPost(root) {
  const $root = $(root);
  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug) { $root.find("#post-title").text("Post not found"); return; }

  $.get("/content/posts/" + slug + ".md")
    .done(function (md) {
      const { meta, body } = parseFrontmatter(md);
      $root.find("#post-title").text(meta.title);
      $root.find("#post-image").attr("src", meta.image);
      $root.find("#post-body").html(marked.parse(body.trim()));
      const blocksEl = $root.find("#post-blocks")[0];
      blocksEl.innerHTML = renderBlocks(meta.blocks);
      mountBlocks(blocksEl);
    })
    .fail(function () {
      $root.find("#post-title").text("Post not found");
    });
}

function run(namespace, container) {
  if (namespace === "home") renderHome(container);
  else if (namespace === "post") renderPost(container);
}

// Barba ----------------------------------------------------------------------

function fade(el, from, to) {
  return el.animate(
    [{ opacity: from }, { opacity: to }],
    { duration: 260, easing: "ease", fill: "forwards" }
  ).finished;
}

barba.init({
  transitions: [
    {
      name: "fade",
      leave({ current }) { return fade(current.container, 1, 0); },
      enter({ next }) { window.scrollTo(0, 0); return fade(next.container, 0, 1); }
    }
  ]
});

barba.hooks.afterEnter((data) => run(data.next.namespace, data.next.container));

const initial = document.querySelector('[data-barba="container"]');
if (initial) run(initial.dataset.barbaNamespace, initial);
