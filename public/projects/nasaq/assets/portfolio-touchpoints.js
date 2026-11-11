(() => {
  const base = "/projects/nasaq/";
  let wiredFrame = null;

  function syncFrame(frame) {
    try {
      const location = frame.contentWindow.location;
      if (location.origin !== window.location.origin || !location.pathname.startsWith(base)) return;
      const link = document.querySelector("#plugin-showcase-new-tab");
      if (link) link.href = location.href;
    } catch {}
  }

  function enhance() {
    document
      .querySelectorAll('a.case[href*="/projects/nasaq/"]:not([data-nasaq-material])')
      .forEach((link) => {
        link.dataset.nasaqMaterial = "true";
        link.classList.add("nasaq-material-row");

        const logo = link.querySelector('img[src*="nasaq-mark"]');
        if (logo) logo.src = `${base}assets/nasaq-mark.svg?identity=violet-20261111`;
        if (!document.getElementById("work-nasaq")) link.id = "work-nasaq";

        const title = link.querySelector(".case-title");
        const description = link.querySelector(".case-desc");
        if (title) title.textContent = "Nasaq: Design for every direction";
        if (description) {
          description.textContent =
            "An Arabic-first design system. One visual language, two reading directions.";
        }

        const preview = document.createElement("a");
        preview.className = "nasaq-material-preview";
        preview.href = `${base}case-study-en.html`;
        preview.dataset.nasaqDirect = "";
        preview.setAttribute("aria-label", "Open the Nasaq case study");
        preview.innerHTML = `<img src="${base}assets/illustrations/material-cover.svg" alt="Animated Nasaq design system preview with bilingual typography and moving interface cards" width="1200" height="675" loading="lazy">`;

        const links = document.createElement("nav");
        links.className = "nasaq-material-links";
        links.setAttribute("aria-label", "Explore Nasaq");
        links.innerHTML = `<a href="${base}case-study-en.html" data-nasaq-direct>Read the story</a><a href="${base}en.html" data-nasaq-direct>Explore the system</a><a href="${base}downloads/nasaq-brand-kit.zip" download>Brand kit</a>`;

        link.after(preview, links);
      });

    const frame = document.querySelector("#plugin-showcase-frame");
    const dialog = document.querySelector("#plugin-showcase-dialog");
    if (frame && dialog) {
      dialog.classList.toggle(
        "nasaq-material-dialog",
        (frame.getAttribute("src") || "").includes("/projects/nasaq/"),
      );
      if (wiredFrame !== frame) {
        wiredFrame = frame;
        frame.addEventListener("load", () => syncFrame(frame));
      }
    }
  }

  new MutationObserver(enhance).observe(document.querySelector("#app") || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });
  enhance();
})();
