import $ from "jquery";
import "./style.css";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function parse(md) {
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

$(function () {
  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug) { $("#title").text("Post not found"); return; }

  $.get("/content/posts/" + slug + ".md")
    .done(function (md) {
      const { meta, body } = parse(md);
      document.title = meta.title + " — Dream Stack";
      $("#title").text(meta.title);
      $("#image").attr("src", meta.image);
      $("#body").html(
        body.trim().split(/\n{2,}/)
          .map((p) => "<p>" + esc(p.trim()) + "</p>")
          .join("")
      );
    })
    .fail(function () {
      $("#title").text("Post not found");
    });
});
