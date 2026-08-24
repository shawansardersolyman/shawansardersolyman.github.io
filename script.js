/* =========================================================
   SHAWAN PERSONAL WEBSITE
   Main JavaScript
   ========================================================= */


/* =========================================================
   AUTOMATIC IMAGE FOLDERS
   ========================================================= */

const AUTO_FOLDERS = {
  achievements: {
    dir: "assets/awards/",
    prefix: "award-",
    max: 100
  },

  moments: {
    dir: "assets/moments/",
    prefix: "moment-",
    max: 200
  },

  places: {
    dir: "assets/places/",
    prefix: "place-",
    max: 100
  },

  builds: {
    dir: "assets/builds/",
    prefix: "project-",
    max: 100
  }
};


/* =========================================================
   SAFE SELECTOR
   ========================================================= */

const $ = selector => document.querySelector(selector);


/* =========================================================
   ESCAPE HTML
   ========================================================= */

const esc = value =>
  String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char])
  );


/* =========================================================
   FIND IMAGES AUTOMATICALLY
   ========================================================= */

async function findImages(cfg) {

  const out = [];

  for (let i = 1; i <= cfg.max; i++) {

    const number = String(i).padStart(2, "0");

    let found = "";

    for (const ext of ["jpg", "jpeg", "png", "webp"]) {

      const url =
        `${cfg.dir}${cfg.prefix}${number}.${ext}`;

      const ok = await new Promise(resolve => {

        const img = new Image();

        img.onload = () => resolve(true);

        img.onerror = () => resolve(false);

        img.src = url + "?v=" + Date.now();

      });

      if (ok) {
        found = url;
        break;
      }

    }

    if (found) {

      out.push(found);

    } else if (i > 1) {

      break;

    }

  }

  return out;
}


/* =========================================================
   AUTO LOAD PHOTOS INTO SITE DATA
   ========================================================= */

async function loadAutoPhotos() {

  const [
    achievements,
    moments,
    places,
    builds
  ] = await Promise.all([

    findImages(AUTO_FOLDERS.achievements),

    findImages(AUTO_FOLDERS.moments),

    findImages(AUTO_FOLDERS.places),

    findImages(AUTO_FOLDERS.builds)

  ]);


  if (!Array.isArray(SITE.achievements)) {
    SITE.achievements = [];
  }

  if (!Array.isArray(SITE.moments)) {
    SITE.moments = [];
  }

  if (!Array.isArray(SITE.places)) {
    SITE.places = [];
  }

  if (!Array.isArray(SITE.builds)) {
    SITE.builds = [];
  }


  if (!SITE.achievements.length) {

    SITE.achievements =
      achievements.map((image, i) => ({
        title:
          `Achievement ${String(i + 1).padStart(2, "0")}`,

        meta: "ACHIEVEMENT",

        text: "",

        image
      }));

  }


  if (!SITE.moments.length) {

    SITE.moments =
      moments.map((image, i) => ({
        caption:
          `Moment ${String(i + 1).padStart(2, "0")}`,

        image
      }));

  }


  if (!SITE.places.length) {

    SITE.places =
      places.map((image, i) => ({
        place:
          `Place ${String(i + 1).padStart(2, "0")}`,

        note: "",

        image
      }));

  }


  if (!SITE.builds.length) {

    SITE.builds =
      builds.map((image, i) => ({
        title:
          `Project ${String(i + 1).padStart(2, "0")}`,

        type: "PROJECT",

        text: "",

        image
      }));

  }

}


/* =========================================================
   GALLERY CONFIGURATION
   ========================================================= */

const GALLERY_CONFIG = {

  achievements: {
    folder: "assets/awards/",
    prefix: "award-",
    max: 100,
    container: "#achievementGrid",
    info: "achievementInfo"
  },

  moments: {
    folder: "assets/moments/",
    prefix: "moment-",
    max: 200,
    container: "#momentGrid",
    info: "momentInfo"
  },

  places: {
    folder: "assets/places/",
    prefix: "place-",
    max: 100,
    container: "#placeGrid",
    info: "placeInfo"
  },

  builds: {
    folder: "assets/builds/",
    prefix: "project-",
    max: 100,
    container: "#buildGrid",
    info: "buildInfo"
  }

};


/* =========================================================
   GALLERY STATE
   ========================================================= */

const galleryState = {

  items: [],

  section: "",

  index: 0

};


/* =========================================================
   GET IMAGE INFO
   ========================================================= */

function galleryInfo(section, file) {

  const cfg = GALLERY_CONFIG[section];

  if (!cfg) return {};

  const map =
    SITE[cfg.info] || {};

  const filename =
    file.split("/").pop();

  return map[filename] || {};

}


/* =========================================================
   CREATE LIGHTBOX
   ========================================================= */

function ensureLightbox() {

  if ($("#v7Lightbox")) return;


  document.body.insertAdjacentHTML(
    "beforeend",

    `
      <div
        class="v7-lightbox"
        id="v7Lightbox"
        aria-hidden="true"
      >

        <button
          class="v7-lb-close"
          id="v7LbClose"
          aria-label="Close"
        >
          ×
        </button>

        <button
          class="v7-lb-arrow v7-lb-prev"
          id="v7LbPrev"
          aria-label="Previous"
        >
          ‹
        </button>

        <div class="v7-lb-content">

          <img
            id="v7LbImage"
            alt=""
          >

          <div class="v7-lb-caption">

            <strong id="v7LbTitle"></strong>

            <span id="v7LbMeta"></span>

          </div>

        </div>

        <button
          class="v7-lb-arrow v7-lb-next"
          id="v7LbNext"
          aria-label="Next"
        >
          ›
        </button>

      </div>
    `
  );


  $("#v7LbClose").onclick =
    closeLightbox;


  $("#v7LbPrev").onclick =
    () => moveLightbox(-1);


  $("#v7LbNext").onclick =
    () => moveLightbox(1);


  $("#v7Lightbox").onclick =
    event => {

      if (
        event.target.id ===
        "v7Lightbox"
      ) {

        closeLightbox();

      }

    };


  document.addEventListener(
    "keydown",
    event => {

      const box =
        $("#v7Lightbox");

      if (
        !box ||
        !box.classList.contains("open")
      ) {
        return;
      }


      if (event.key === "Escape") {

        closeLightbox();

      }


      if (event.key === "ArrowLeft") {

        moveLightbox(-1);

      }


      if (event.key === "ArrowRight") {

        moveLightbox(1);

      }

    }
  );


  let startX = 0;


  $("#v7Lightbox").addEventListener(
    "touchstart",
    event => {

      startX =
        event.changedTouches[0].screenX;

    },
    {
      passive: true
    }
  );


  $("#v7Lightbox").addEventListener(
    "touchend",
    event => {

      const dx =
        event.changedTouches[0].screenX -
        startX;


      if (Math.abs(dx) > 45) {

        moveLightbox(
          dx < 0 ? 1 : -1
        );

      }

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   OPEN LIGHTBOX
   ========================================================= */

function openLightbox(
  items,
  section,
  index
) {

  ensureLightbox();

  galleryState.items =
    items;

  galleryState.section =
    section;

  galleryState.index =
    index;

  updateLightbox();

  $("#v7Lightbox")
    .classList.add("open");

  $("#v7Lightbox")
    .setAttribute(
      "aria-hidden",
      "false"
    );

  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   UPDATE LIGHTBOX
   ========================================================= */

function updateLightbox() {

  const file =
    galleryState.items[
      galleryState.index
    ];

  if (!file) return;


  const info =
    galleryInfo(
      galleryState.section,
      file
    );


  const image =
    $("#v7LbImage");

  const title =
    $("#v7LbTitle");

  const meta =
    $("#v7LbMeta");


  image.src =
    file;

  image.alt =
    info.title || "";


  title.textContent =
    info.title || "";


  meta.textContent =
    info.meta ||
    info.text ||
    info.note ||
    "";


  title.style.display =
    info.title
      ? "block"
      : "none";


  meta.style.display =
    (
      info.meta ||
      info.text ||
      info.note
    )
      ? "block"
      : "none";

}


/* =========================================================
   MOVE LIGHTBOX
   ========================================================= */

function moveLightbox(delta) {

  const total =
    galleryState.items.length;

  if (!total) return;


  galleryState.index =
    (
      galleryState.index +
      delta +
      total
    ) % total;


  updateLightbox();

}


/* =========================================================
   CLOSE LIGHTBOX
   ========================================================= */

function closeLightbox() {

  const box =
    $("#v7Lightbox");


  if (box) {

    box.classList.remove("open");

    box.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  document.body.style.overflow =
    "";

}


/* =========================================================
   CREATE GALLERY CARDS
   ========================================================= */

function galleryCards(
  section,
  items
) {

  return items.map(
    (file, index) => {

      const info =
        galleryInfo(
          section,
          file
        );


      const title =
        info.title || "";


      const meta =
        info.meta || "";


      return `

        <button
          class="v7-gallery-item"
          type="button"
          aria-label="${esc(
            title || "Open image"
          )}"
        >

          <img
            src="${esc(file)}"
            alt="${esc(title)}"
            loading="lazy"
          >

          ${
            title || meta
              ? `
                <span class="v7-gallery-overlay">

                  <strong>
                    ${esc(title)}
                  </strong>

                  <small>
                    ${esc(meta)}
                  </small>

                </span>
              `
              : ""
          }

        </button>

      `;

    }
  ).join("");

}


/* =========================================================
   RENDER GALLERY
   ========================================================= */

function renderGallery(
  section,
  items
) {

  const cfg =
    GALLERY_CONFIG[section];


  const element =
    $(cfg.container);


  if (!element) return;


  element.className =
    "v7-gallery";


  const firstItems =
    items.slice(0, 9);


  element.innerHTML =
    galleryCards(
      section,
      firstItems
    );


  [
    ...element.querySelectorAll(
      ".v7-gallery-item"
    )
  ].forEach(
    (button, index) => {

      button.onclick =
        () => openLightbox(
          items,
          section,
          index
        );

    }
  );


  const oldMore =
    element.nextElementSibling;


  if (
    oldMore &&
    oldMore.classList.contains(
      "v7-gallery-more"
    )
  ) {

    oldMore.remove();

  }


  if (items.length > 9) {

    const more =
      document.createElement(
        "div"
      );


    more.className =
      "v7-gallery-more";


    more.innerHTML = `

      <button type="button">
        View all ${items.length}
      </button>

    `;


    more
      .querySelector("button")
      .onclick = () => {

        element.innerHTML =
          galleryCards(
            section,
            items
          );


        [
          ...element.querySelectorAll(
            ".v7-gallery-item"
          )
        ].forEach(
          (button, index) => {

            button.onclick =
              () => openLightbox(
                items,
                section,
                index
              );

          }
        );


        more.remove();

      };


    element.after(more);

  }

}


/* =========================================================
   LOAD ALL GALLERIES
   ========================================================= */

async function loadV7Galleries() {

  ensureLightbox();


  const results =
    await Promise.all(

      Object.entries(
        GALLERY_CONFIG
      ).map(
        async ([section, cfg]) => {

          const images =
            await findImages(cfg);

          return [
            section,
            images
          ];

        }
      )

    );


  for (
    const [section, images]
    of results
  ) {

    renderGallery(
      section,
      images
    );

  }

}


/* =========================================================
   SOCIAL ICONS
   ========================================================= */

const icons = {

  facebook:
  '<svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z"/></svg>',

  instagram:
  '<svg viewBox="0 0 24 24"><path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm0 2A3.2 3.2 0 0 0 4 7.2v9.6A3.2 3.2 0 0 0 7.2 20h9.6a3.2 3.2 0 0 0 3.2-3.2V7.2A3.2 3.2 0 0 0 16.8 4H7.2Zm9.9 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>',

  linkedin:
  '<svg viewBox="0 0 24 24"><path d="M5 3.5A2.5 2.5 0 1 1 5 8.5 2.5 2.5 0 0 1 5 3.5ZM3 10h4v11H3V10Zm6 0h3.8v1.5h.1c.5-.9 1.8-1.9 3.8-1.9 4.1 0 4.9 2.6 4.9 6v5.4h-4v-4.8c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21H9V10Z"/></svg>',

  github:
  '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.6-4.5 4.8.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',

  youtube:
  '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z"/></svg>',

  telegram:
  '<svg viewBox="0 0 24 24"><path d="m21.8 3.3-3.1 17.4c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 14.2l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 2.9c.9-.3 1.7.2 1.2.4Z"/></svg>',

  whatsapp:
  '<svg viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6.1-3.5-8.3ZM12.1 21.5h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 1 1 8.5 4.7Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.5-.7-2.5-1.3-3.5-2.9-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.8.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z"/></svg>',

  email:
  '<svg viewBox="0 0 24 24"><path d="M2.5 5h19A2.5 2.5 0 0 1 24 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 0 16.5v-9A2.5 2.5 0 0 1 2.5 5Zm0 2a.5.5 0 0 0-.5.5v.2l10 6.2 10-6.2v-.2a.5.5 0 0 0-.5-.5h-19Zm19.5 3-8.9 5.5a2 2 0 0 1-2.1 0L2 10v6.5a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5V10Z"/></svg>'

};


/* =========================================================
   NORMALIZE SOCIAL URL
   ========================================================= */

const normalizeUrl = url => {

  const value =
    String(url || "").trim();

  if (!value) return "";

  if (
    /^(https?:\/\/|mailto:|tel:)/i
      .test(value)
  ) {
    return value;
  }

  return "https://" + value;

};


/* =========================================================
   INITIALIZE PAGE CONTENT
   ========================================================= */

async function initializePage() {

  try {

    /* Load automatic images first */
    await loadAutoPhotos();


    /* Hero */
    $("#heroName").textContent =
      SITE.fullName || "";


    $("#heroIntro").textContent =
      SITE.heroIntro || "";


    /* About */
    $("#aboutText").textContent =
      SITE.about || "";


    /* Profile image */
    const profile =
      $("#profileImage");


    if (profile) {

      profile.src =
        SITE.profileImage ||
        "assets/profile.jpg";


      profile.onerror =
        () => {

          profile.style.display =
            "none";


          const fallback =
            $("#profileFallback");


          if (fallback) {

            fallback.style.display =
              "flex";

          }

        };

    }


    /* Year */
    const currentYear =
      new Date().getFullYear();


    $("#heroYear").textContent =
      currentYear;


    $("#year").textContent =
      currentYear;


    /* =====================================================
       STORY
       ===================================================== */

    const storyList =
      $("#storyList");


    if (
      storyList &&
      Array.isArray(SITE.story)
    ) {

      storyList.innerHTML =
        SITE.story.map(
          (item, index) => `

            <article class="story-item">

              <div class="story-no">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <div class="story-year">
                ${esc(item.year || "")}
              </div>

              <div>

                <h3>
                  ${esc(item.title || "")}
                </h3>

                <p>
                  ${esc(item.text || "")}
                </p>

              </div>

            </article>

          `
        ).join("");

    }


    /* =====================================================
       NOW
       ===================================================== */

    const nowList =
      $("#nowList");


    if (
      nowList &&
      Array.isArray(SITE.now)
    ) {

      nowList.innerHTML =
        SITE.now.map(
          item => `

            <div>
              <span>↗</span>
              ${esc(item)}
            </div>

          `
        ).join("");

    }


    /* =====================================================
       SOCIALS
       ===================================================== */

    const socials =
      $("#socials");


    if (
      socials &&
      Array.isArray(SITE.socials)
    ) {

      const active =
        SITE.socials
          .map(item => ({
            ...item,
            url: normalizeUrl(item.url)
          }))
          .filter(item => item.url);


      socials.innerHTML =
        active.length

          ? active.map(
              item => `

                <a
                  class="social"
                  href="${esc(item.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${esc(item.name)}"
                >

                  ${
                    icons[item.icon] ||
                    icons.email
                  }

                  <span>
                    ${esc(item.name)}
                  </span>

                </a>

              `
            ).join("")

          : `
              <span class="social-empty">
                Your social links will appear here.
              </span>
            `;

    }


    /* =====================================================
       LOAD GALLERIES
       ===================================================== */

    await loadV7Galleries();


    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target
                .classList
                .add("visible");


              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold:.1
        }
      );


    document
      .querySelectorAll(".reveal")
      .forEach(
        element =>
          observer.observe(element)
      );


    /* Hero should appear immediately */
    const heroReveal =
      document.querySelector(
        ".hero-inner.reveal"
      );


    if (heroReveal) {

      setTimeout(
        () => {
          heroReveal.classList.add(
            "visible"
          );
        },
        100
      );

    }


    /* =====================================================
       THEME
       ===================================================== */

    const theme =
      $("#themeToggle");


    if (
      localStorage.getItem(
        "shawan-theme"
      ) === "light"
    ) {

      document.body
        .classList
        .add("light");

    }


    if (theme) {

      theme.onclick = () => {

        document.body
          .classList
          .toggle("light");


        localStorage.setItem(
          "shawan-theme",

          document.body
              .classList
              .contains("light")
            ? "light"
            : "dark"
        );

      };

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menu =
      $("#mobileNav");


    const menuBtn =
      $("#menuToggle");


    if (menu && menuBtn) {

      menuBtn.onclick = () => {

        const open =
          menu.classList.toggle(
            "open"
          );


        menuBtn.setAttribute(
          "aria-expanded",
          open
        );

      };


      menu
        .querySelectorAll("a")
        .forEach(link => {

          link.onclick = () => {

            menu.classList.remove(
              "open"
            );


            menuBtn.setAttribute(
              "aria-expanded",
              "false"
            );

          };

        });

    }


    /* =====================================================
       CURSOR GLOW
       ===================================================== */

    const glow =
      document.querySelector(
        ".cursor-glow"
      );


    if (glow) {

      window.addEventListener(
        "pointermove",
        event => {

          glow.style.left =
            event.clientX + "px";


          glow.style.top =
            event.clientY + "px";

        }
      );

    }


    /* =====================================================
       HEADER LOGO FALLBACK
       ===================================================== */

    const headerLogo =
      $("#headerLogo");


    const headerFallback =
      $("#headerLogoFallback");


    if (headerLogo) {

      headerLogo.onerror =
        () => {

          headerLogo.style.display =
            "none";


          if (headerFallback) {

            headerFallback.style.display =
              "inline-block";

          }

        };

    }


    /* =====================================================
       LOADING LOGO FALLBACK
       ===================================================== */

    const loaderLogo =
      $("#loaderLogo");


    const loaderFallback =
      $("#loaderFallback");


    if (loaderLogo) {

      loaderLogo.onerror =
        () => {

          loaderLogo.style.display =
            "none";


          if (loaderFallback) {

            loaderFallback.style.display =
              "block";

          }

        };

    }


    /* =====================================================
       PAGE READY
       ===================================================== */

    document.body.classList.add(
      "page-ready"
    );


    /* Give browser a moment to paint final content */
    requestAnimationFrame(() => {

      setTimeout(
        hidePageLoader,
        250
      );

    });


  } catch (error) {

    console.error(
      "Portfolio initialization error:",
      error
    );


    /*
      Even if something goes wrong,
      don't leave the visitor stuck
      on the loading screen.
    */

    document.body.classList.add(
      "page-ready"
    );


    setTimeout(
      hidePageLoader,
      300
    );

  }

}


/* =========================================================
   HIDE LOADING SCREEN
   ========================================================= */

function hidePageLoader() {

  const loader =
    $("#pageLoader");


  if (!loader) return;


  loader.classList.add(
    "hide"
  );


  setTimeout(
    () => {

      if (loader.parentNode) {

        loader.parentNode.removeChild(
          loader
        );

      }

    },
    650
  );

}


/* =========================================================
   START WEBSITE
   ========================================================= */

initializePage();
