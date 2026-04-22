$(function () {
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12 }
  );
  function observeReveals($scope) { ($scope || $(document)).find(".reveal").each(function () { io.observe(this); }); }

  $(document).on("click", 'a[href^="#"]', function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 72 }, 500);
    }
  });

  function parseFrontmatter(md) {
    const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!m) return { meta: {}, body: md };
    const meta = {};
    m[1].split(/\n/).forEach(function (line) {
      const kv = line.match(/^([a-zA-Z_][\w-]*)\s*:\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2].trim();
    });
    return { meta: meta, body: m[2] };
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  const accentMap = {
    sky:     "bg-sky-100 text-sky-700",
    cyan:    "bg-cyan-100 text-cyan-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber:   "bg-amber-100 text-amber-700",
    rose:    "bg-rose-100 text-rose-700",
  };

  $.getJSON("content/site.json").done(function (site) {
    document.title = site.brand + " — a calmer way to build websites";
    $("[data-brand]").text(site.brand);
    $("[data-footer]").text(site.footer);

    // Hero
    const h = site.hero;
    $("#hero").html(
      '<div class="mx-auto max-w-6xl px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">' +
        '<div class="reveal">' +
          '<span class="inline-flex items-center gap-2 text-xs font-medium tracking-wide uppercase text-emerald-700 bg-emerald-100/70 rounded-full px-3 py-1">' +
            '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ' + escapeHtml(h.eyebrow) +
          '</span>' +
          '<h1 class="font-display text-5xl md:text-6xl leading-[1.05] mt-5">' + h.title_html + '</h1>' +
          '<p class="mt-6 text-lg text-slate-600 max-w-lg">' + escapeHtml(h.body) + '</p>' +
          '<div class="mt-8 flex flex-wrap items-center gap-3">' +
            '<a href="' + escapeHtml(h.primary_cta.href) + '" class="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-5 py-3 font-medium hover-lift">' + escapeHtml(h.primary_cta.label) + ' →</a>' +
            '<a href="' + escapeHtml(h.secondary_cta.href) + '" class="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-white">' + escapeHtml(h.secondary_cta.label) + '</a>' +
          '</div>' +
        '</div>' +
        '<div class="reveal relative">' +
          '<div class="absolute -inset-8 bg-gradient-to-br from-emerald-200/40 via-amber-100/40 to-rose-200/40 blur-3xl rounded-full"></div>' +
          '<img src="' + escapeHtml(h.image) + '" alt="" class="relative rounded-3xl shadow-xl aspect-[4/5] object-cover w-full" />' +
          '<div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 items-center gap-3 hidden md:flex">' +
            '<div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center"><span class="text-emerald-600">✨</span></div>' +
            '<div>' +
              '<div class="text-sm font-semibold">' + escapeHtml(h.badge_title) + '</div>' +
              '<div class="text-xs text-slate-500">' + escapeHtml(h.badge_body) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    // Features
    let featuresHtml =
      '<div class="mx-auto max-w-6xl px-6">' +
        '<div class="max-w-2xl reveal">' +
          '<h2 class="font-display text-4xl">' + escapeHtml(site.features_heading) + '</h2>' +
          '<p class="mt-4 text-slate-600">' + escapeHtml(site.features_body) + '</p>' +
        '</div>' +
        '<div class="mt-14 grid md:grid-cols-3 gap-6">';
    site.features.forEach(function (f) {
      const accent = accentMap[f.accent] || accentMap.emerald;
      featuresHtml +=
        '<article class="reveal rounded-2xl border border-stone-200 bg-stone-50/60 p-6 hover-lift">' +
          '<div class="w-11 h-11 rounded-xl ' + accent + ' flex items-center justify-center mb-5 text-xl">' + escapeHtml(f.icon) + '</div>' +
          '<h3 class="font-semibold text-lg">' + escapeHtml(f.title) + '</h3>' +
          '<p class="mt-2 text-slate-600 text-sm leading-relaxed">' + escapeHtml(f.body) + '</p>' +
        '</article>';
    });
    featuresHtml += '</div></div>';
    $("#features").html(featuresHtml);

    // Story
    let storyHtml = '<div class="mx-auto max-w-6xl px-6 space-y-28">';
    site.story.forEach(function (s, i) {
      const textFirst = i % 2 === 0;
      const bullets = (s.bullets && s.bullets.length)
        ? '<ul class="mt-6 space-y-2 text-sm text-slate-700">' +
          s.bullets.map(function (b) {
            return '<li class="flex gap-2"><span class="text-emerald-600">✓</span> ' + escapeHtml(b) + '</li>';
          }).join("") + '</ul>'
        : '';
      const textCol =
        '<div class="reveal ' + (textFirst ? "order-2 md:order-1" : "") + '">' +
          '<span class="text-xs uppercase tracking-wider text-emerald-700 font-semibold">' + escapeHtml(s.number) + ' · ' + escapeHtml(s.eyebrow) + '</span>' +
          '<h3 class="font-display text-3xl md:text-4xl mt-3">' + escapeHtml(s.title) + '</h3>' +
          '<p class="mt-4 text-slate-600 leading-relaxed">' + escapeHtml(s.body) + '</p>' +
          bullets +
        '</div>';
      const imgCol =
        '<div class="reveal ' + (textFirst ? "order-1 md:order-2" : "") + '">' +
          '<img src="' + escapeHtml(s.image) + '" alt="" class="rounded-3xl shadow-md aspect-[4/3] object-cover w-full" />' +
        '</div>';
      storyHtml += '<div class="grid md:grid-cols-2 gap-12 items-center">' + textCol + imgCol + "</div>";
    });
    storyHtml += '</div>';
    $("#story").html(storyHtml);

    // Journal heading
    $("#journal-heading").text(site.journal_heading);
    $("#journal-body").text(site.journal_body);

    // Journal posts
    const $list = $("#posts-list");
    const requests = site.posts_order.map(function (slug) {
      return $.get("content/posts/" + slug + ".md").then(function (md) {
        return { slug: slug, parsed: parseFrontmatter(md) };
      });
    });
    $.when.apply($, requests).done(function () {
      const results = requests.length === 1 ? [arguments[0]] : Array.prototype.slice.call(arguments);
      results.forEach(function (r) {
        const meta = r.parsed.meta;
        $list.append(
          '<li class="reveal group">' +
            '<a href="#" class="block rounded-2xl overflow-hidden border border-stone-200 bg-white hover-lift">' +
              '<div class="aspect-[3/2] overflow-hidden">' +
                '<img src="' + escapeHtml(meta.image) + '" alt="" class="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />' +
              '</div>' +
              '<div class="p-5">' +
                '<div class="text-xs text-slate-500">' + escapeHtml(formatDate(meta.date)) + '</div>' +
                '<h3 class="font-display text-xl mt-1">' + escapeHtml(meta.title) + '</h3>' +
                '<p class="mt-2 text-sm text-slate-600">' + escapeHtml(meta.excerpt) + '</p>' +
              '</div>' +
            '</a>' +
          '</li>'
        );
      });
      observeReveals($list);
    });

    // CTA
    const c = site.cta;
    $("#cta").html(
      '<div class="mx-auto max-w-4xl px-6">' +
        '<div class="reveal rounded-3xl bg-slate-900 text-white p-10 md:p-14 relative overflow-hidden">' +
          '<div class="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>' +
          '<h2 class="font-display text-4xl md:text-5xl leading-tight relative">' + escapeHtml(c.title) + '</h2>' +
          '<p class="mt-4 text-slate-300 max-w-xl relative">' + escapeHtml(c.body) + '</p>' +
          '<div class="mt-8 flex flex-wrap gap-3 relative">' +
            '<a href="' + escapeHtml(c.primary.href) + '" class="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-5 py-3 font-medium hover-lift">' + escapeHtml(c.primary.label) + '</a>' +
            '<a href="' + escapeHtml(c.secondary.href) + '" class="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-medium hover:bg-white/5">' + escapeHtml(c.secondary.label) + '</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    observeReveals();
  }).fail(function () {
    $("#hero").html('<div class="mx-auto max-w-6xl px-6 py-24 text-center text-slate-500">Could not load content/site.json. Run a local server (e.g. <code>python3 -m http.server</code>) — browsers block file:// fetches.</div>');
  });
});
