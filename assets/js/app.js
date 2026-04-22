$(function () {
  $.get("content/pages/home.md", function (md) {
    const body = md.replace(/^---[\s\S]*?---\s*/, "");
    $("#home").html(body.replace(/\n\n/g, "</p><p>").replace(/^/, "<p>") + "</p>");
  });

  const posts = ["hello-world"];
  posts.forEach(function (slug) {
    $.get("content/posts/" + slug + ".md", function (md) {
      const title = (md.match(/title:\s*(.+)/) || [, slug])[1].trim();
      const date = (md.match(/date:\s*(.+)/) || [, ""])[1].trim();
      $("#posts").append(
        '<li class="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm transition">' +
          '<div class="font-medium">' + title + "</div>" +
          '<div class="text-sm text-slate-500">' + date + "</div>" +
        "</li>"
      );
    });
  });
});
