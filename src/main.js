import barba from "@barba/core";
import $ from "jquery";
import "./style.css";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const meta = {};
  let body = md;
  if (m) {
    m[1].split(/\n/).forEach((line) => {
      const kv = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2].trim();
    });
    body = m[2];
  }
  return { meta, body };
}

const POST_SLUGS = ["hello-world", "why-jquery", "content-in-git"];

// Persistent header — lives outside barba wrapper, loaded once.
$.getJSON("/content/site.json", function (site) {
  document.title = site.title;
  $("#title").text(site.title);
  $("#subtitle").text(site.subtitle);
  $("#hero").attr("src", site.image);
});

function renderHome(root) {
  const $root = $(root);
  $.getJSON("/content/site.json", function (site) {
    $root.find("#posts-heading").text(site.posts_heading);
  });

  $.when.apply(
    $,
    POST_SLUGS.map((s) =>
      $.get("/content/posts/" + s + ".md").then((md) =>
        Object.assign({ slug: s }, parseFrontmatter(md).meta)
      )
    )
  ).done(function () {
    const posts = POST_SLUGS.length === 1 ? [arguments[0]] : Array.prototype.slice.call(arguments);
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
      $root.find("#post-body").html(
        body.trim().split(/\n{2,}/)
          .map((p) => "<p>" + esc(p.trim()) + "</p>")
          .join("")
      );
    })
    .fail(function () {
      $root.find("#post-title").text("Post not found");
    });
}

function run(namespace, container) {
  if (namespace === "home") renderHome(container);
  else if (namespace === "post") renderPost(container);
}

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
