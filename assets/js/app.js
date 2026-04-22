$(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function parseFrontmatter(md) {
    const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
    const meta = {};
    if (m) m[1].split(/\n/).forEach(function (line) {
      const kv = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2].trim();
    });
    return meta;
  }

  $.getJSON("content/site.json", function (site) {
    document.title = site.title;
    $("#title").text(site.title);
    $("#subtitle").text(site.subtitle);
    $("#hero").attr("src", site.image);
    $("#posts-heading").text(site.posts_heading);
  });

  const slugs = ["hello-world", "why-jquery", "content-in-git"];
  $.when.apply($, slugs.map(function (s) {
    return $.get("content/posts/" + s + ".md").then(parseFrontmatter);
  })).done(function () {
    const posts = slugs.length === 1 ? [arguments[0]] : Array.prototype.slice.call(arguments);
    posts
      .sort(function (a, b) { return (+a.order || 0) - (+b.order || 0); })
      .forEach(function (p) {
        $("#posts").append(
          '<li class="rounded-2xl overflow-hidden bg-white border border-stone-200 hover:shadow-md transition">' +
            '<img src="' + esc(p.image) + '" alt="" class="aspect-[3/2] object-cover w-full" />' +
            '<div class="p-5">' +
              '<h3 class="font-semibold text-lg">' + esc(p.title) + '</h3>' +
              '<p class="mt-2 text-sm text-slate-600">' + esc(p.text) + '</p>' +
            '</div>' +
          '</li>'
        );
      });
  });
});
