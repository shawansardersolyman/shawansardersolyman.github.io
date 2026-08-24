/* =========================================================
   SHAWAN PERSONAL WEBSITE
   Clean Main JavaScript
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const GALLERIES = {

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
   SHORT SELECTOR
   ========================================================= */

const $ = selector =>
  document.querySelector(selector);


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function esc(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char])
  );

}


/* =========================================================
   CHECK IMAGE
   ========================================================= */

function imageExists(url) {

  return new Promise(resolve => {

    const img = new Image();

    img.onload = () => resolve(true);

    img.onerror = () => resolve(false);

    img.src = url + "?v=" + Date.now();

  });

}


/* =========================================================
   FIND IMAGES AUTOMATICALLY
   ========================================================= */

async function findImages(config) {

  const images = [];

  for (let i = 1; i <= config.max; i++) {

    const number =
      String(i).padStart(2, "0");

    let found = "";

    for (
      const extension
      of ["jpg", "jpeg", "png", "webp"]
    ) {

      const file =
        `${config.folder}${config.prefix}${number}.${extension}`;

      if (await imageExists(file)) {

        found = file;
        break;

      }

    }

    /*
      Stop when the sequence ends.

      Example:
      award-01
      award-02
      award-03
      award-04

      If award-05 doesn't exist,
      scanning stops here.
    */

    if (!found) {

      if (i > 1) break;

      continue;

    }

    images.push(found);

  }

  return images;

}


/* =========================================================
   GALLERY STATE
   ========================================================= */

const galleryState = {

  items: [],
  section: "",
  index: 0

};


/* =========================================================
   GET IMAGE INFORMATION
   ========================================================= */

function getImageInfo(section, file) {

  const config =
    GALLERIES[section];

  if (!config) return {};

  const infoMap =
    SITE[config.info] || {};

  const filename =
    file.split("/").pop();

  return infoMap[filename] || {};

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

function createLightbox() {

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
        aria-label="Previous image"
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
        aria-label="Next image"
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


  /* Keyboard navigation */

  document.addEventListener(
    "keydown",
    event => {

      const lightbox =
        $("#v7Lightbox");

      if (
        !lightbox ||
        !lightbox.classList.contains("open")
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


  /* Mobile swipe */

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

      const endX =
        event.changedTouches[0].screenX;

      const distance =
        endX - startX;


      if (Math.abs(distance) > 45) {

        moveLightbox(
          distance < 0 ? 1 : -1
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

  createLightbox();

  galleryState.items =
    items;

  galleryState.section =
    section;

  galleryState.index =
    index;

  updateLightbox();


  const lightbox =
    $("#v7Lightbox");


  lightbox.classList.add("open");

  lightbox.setAttribute(
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
    getImageInfo(
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


  /*
    Title and information are shown
    ONLY inside the lightbox.
  */

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
   NEXT / PREVIOUS
   ========================================================= */

function moveLightbox(direction) {

  const total =
    galleryState.items.length;

  if (!total) return;


  galleryState.index =
    (
      galleryState.index +
      direction +
      total
    ) % total;


  updateLightbox();

}


/* =========================================================
   CLOSE LIGHTBOX
   ========================================================= */

function closeLightbox() {

  const lightbox =
    $("#v7Lightbox");


  if (!lightbox) return;


  lightbox.classList.remove(
    "open"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   CREATE GALLERY CARDS
   =========================================================
   
   IMPORTANT:
   Gallery thumbnails now show ONLY the image.
   
   Title / meta / description are NOT shown
   over the image.
   
   They will appear inside the lightbox
   after clicking the image.
   ========================================================= */

function createGalleryCards(
  section,
  images
) {

  return images.map(
    (file, index) => {

      const info =
        getImageInfo(
          section,
          file
        );


      const title =
        info.title || "";


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

        </button>

      `;

    }
  ).join("");

}


/* =========================================================
   CONNECT GALLERY BUTTONS
   ========================================================= */

function connectGalleryButtons(
  container,
  images,
  section
) {

  container
    .querySelectorAll(
      ".v7-gallery-item"
    )
    .forEach(
      (button, index) => {

        button.onclick =
          () => openLightbox(
            images,
            section,
            index
          );

      }
    );

}


/* =========================================================
   RENDER GALLERY
   ========================================================= */
function renderGallery(
  section,
  images
) {

  const config =
    GALLERIES[section];

  const container =
    $(config.container);


  if (!container) return;


  container.className =
    "v7-gallery";


  /*
    Show only 6 images initially.
  */

  const visibleImages =
    images.slice(0, 6);


  container.innerHTML =
    createGalleryCards(
      section,
      visibleImages
    );


  connectGalleryButtons(
    container,
    images,
    section
  );


  /*
    Remove previous View All button.
  */

  const existingMore =
    container.nextElementSibling;


  if (
    existingMore &&
    existingMore.classList.contains(
      "v7-gallery-more"
    )
  ) {

    existingMore.remove();

  }


  /*
    No need for View All
    if there are 6 or fewer images.
  */

  if (images.length <= 6) {
    return;
  }


  const more =
    document.createElement("div");


  more.className =
    "v7-gallery-more";


  more.innerHTML = `

    <button type="button">
      View all ${images.length}
    </button>

  `;


  more
    .querySelector("button")
    .onclick = () => {

      container.innerHTML =
        createGalleryCards(
          section,
          images
        );


      connectGalleryButtons(
        container,
        images,
        section
      );


      more.remove();

    };


  container.after(more);

}


/* =========================================================
   LOAD ALL GALLERIES
   ========================================================= */

async function loadGalleries() {

  createLightbox();


  const entries =
    Object.entries(GALLERIES);


  const results =
    await Promise.all(

      entries.map(
        async ([section, config]) => {

          const images =
            await findImages(config);

          return {
            section,
            images
          };

        }
      )

    );


  results.forEach(
    ({ section, images }) => {

      renderGallery(
        section,
        images
      );

    }
  );

}


/* =========================================================
   SOCIAL ICONS
   ========================================================= */

const icons = {

  facebook:
    '<svg viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H7.7v3h2.7v8h3.1Z"/></svg>',

  instagram:
    '<svg viewBox="0 0 24 24"><path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2Zm0 2A3.2 3.2 0 0 0 4 7.2v9.6A3.2 3.2 0 0 0 7.2 20h9.6a3.2 3.2 0 0 0 3.2-3.2V7.2A3.2 3.2 0 0 0 16.8 4H7.2Zm9.9 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0-3-3Z"/></svg>',

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
   NORMALIZE URL
   ========================================================= */

function normalizeUrl(url) {

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

}


/* =========================================================
   RENDER SOCIAL LINKS
   ========================================================= */

function renderSocials() {

  const container =
    $("#socials");


  if (!container) return;


  const socials =
    Array.isArray(SITE.socials)
      ? SITE.socials
      : [];


  const active =
    socials
      .map(item => ({
        ...item,
        url: normalizeUrl(item.url)
      }))
      .filter(item => item.url);


  if (!active.length) {

    container.innerHTML = `
      <span class="social-empty">
        Your social links will appear here.
      </span>
    `;

    return;

  }


  container.innerHTML =
    active.map(item => `

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

    `).join("");

}


/* =========================================================
   RENDER STORY
   ========================================================= */

function renderStory() {

  const container =
    $("#storyList");


  if (!container) return;


  const story =
    Array.isArray(SITE.story)
      ? SITE.story
      : [];


  container.innerHTML =
    story.map(
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


/* =========================================================
   RENDER NOW
   ========================================================= */

function renderNow() {

  const container =
    $("#nowList");


  if (!container) return;


  const now =
    Array.isArray(SITE.now)
      ? SITE.now
      : [];


  container.innerHTML =
    now.map(
      item => `

        <div>
          <span>↗</span>
          ${esc(item)}
        </div>

      `
    ).join("");

}


/* =========================================================
   PROFILE IMAGE FALLBACK
   ========================================================= */

function setupProfileImage() {

  const image =
    $("#profileImage");

  const fallback =
    $("#profileFallback");


  if (!image) return;


  image.src =
    SITE.profileImage ||
    "assets/profile.jpg";


  image.onerror =
    () => {

      image.style.display =
        "none";


      if (fallback) {

        fallback.style.display =
          "flex";

      }

    };

}


/* =========================================================
   LOGO FALLBACKS
   ========================================================= */

function setupLogoFallbacks() {

  const headerLogo =
    $("#headerLogo");

  const headerFallback =
    $("#headerLogoFallback");


  if (headerLogo) {

    headerLogo.src =
      SITE.logo ||
      "assets/logo.png";


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


  const loaderLogo =
    $("#loaderLogo");

  const loaderFallback =
    $("#loaderFallback");


  if (loaderLogo) {

    loaderLogo.src =
      SITE.logo ||
      "assets/logo.png";


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

}


/* =========================================================
   THEME
   ========================================================= */

function setupTheme() {

  const button =
    $("#themeToggle");


  if (
    localStorage.getItem(
      "shawan-theme"
    ) === "light"
  ) {

    document.body.classList.add(
      "light"
    );

  }


  if (!button) return;


  button.onclick =
    () => {

      const isLight =
        document.body.classList.toggle(
          "light"
        );


      localStorage.setItem(
        "shawan-theme",
        isLight
          ? "light"
          : "dark"
      );

    };

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

  const menu =
    $("#mobileNav");

  const button =
    $("#menuToggle");


  if (!menu || !button) return;


  button.onclick =
    () => {

      const open =
        menu.classList.toggle(
          "open"
        );


      button.setAttribute(
        "aria-expanded",
        String(open)
      );

    };


  menu
    .querySelectorAll("a")
    .forEach(link => {

      link.onclick =
        () => {

          menu.classList.remove(
            "open"
          );


          button.setAttribute(
            "aria-expanded",
            "false"
          );

        };

    });

}


/* =========================================================
   CURSOR GLOW
   ========================================================= */

function setupCursorGlow() {

  const glow =
    document.querySelector(
      ".cursor-glow"
    );


  if (!glow) return;


  /*
    Disable this effect on touch devices.
  */

  if (
    window.matchMedia(
      "(hover: none)"
    ).matches
  ) {

    glow.style.display =
      "none";

    return;

  }


  window.addEventListener(
    "pointermove",
    event => {

      glow.style.left =
        event.clientX + "px";

      glow.style.top =
        event.clientY + "px";

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   REVEAL ANIMATIONS
   ========================================================= */

function setupRevealAnimations() {

  const elements =
    document.querySelectorAll(
      ".reveal"
    );


  if (!elements.length) return;


  if (
    !("IntersectionObserver" in window)
  ) {

    elements.forEach(
      element =>
        element.classList.add(
          "visible"
        )
    );

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );


              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.1
      }
    );


  elements.forEach(
    element =>
      observer.observe(element)
  );


  /*
    Hero appears immediately.
  */

  const hero =
    document.querySelector(
      ".hero-inner.reveal"
    );


  if (hero) {

    setTimeout(
      () => {

        hero.classList.add(
          "visible"
        );

      },
      100
    );

  }

}


/* =========================================================
   PAGE LOADER
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

        loader.remove();

      }

    },
    650
  );

}


/* =========================================================
   INITIALIZE PAGE
   ========================================================= */

async function initializePage() {

  try {

    /*
      -------------------------------------------------------
      BASIC CONTENT
      -------------------------------------------------------
    */

    $("#heroName").textContent =
      SITE.fullName || "";


    $("#heroIntro").textContent =
      SITE.heroIntro || "";


    $("#aboutText").textContent =
      SITE.about || "";


    /*
      -------------------------------------------------------
      YEAR
      -------------------------------------------------------
    */

    const year =
      new Date().getFullYear();


    $("#heroYear").textContent =
      year;


    $("#year").textContent =
      year;


    /*
      -------------------------------------------------------
      PROFILE / LOGO
      -------------------------------------------------------
    */

    setupProfileImage();

    setupLogoFallbacks();


    /*
      -------------------------------------------------------
      CONTENT SECTIONS
      -------------------------------------------------------
    */

    renderStory();

    renderNow();

    renderSocials();


    /*
      -------------------------------------------------------
      GALLERIES
      -------------------------------------------------------
    */

    await loadGalleries();


    /*
      -------------------------------------------------------
      UI
      -------------------------------------------------------
    */

    setupTheme();

    setupMobileMenu();

    setupCursorGlow();

    setupRevealAnimations();


    /*
      -------------------------------------------------------
      PAGE READY
      -------------------------------------------------------
    */

    document.body.classList.add(
      "page-ready"
    );


    requestAnimationFrame(
      () => {

        setTimeout(
          hidePageLoader,
          250
        );

      }
    );


  } catch (error) {

    console.error(
      "Portfolio initialization error:",
      error
    );


    /*
      Never leave the visitor
      stuck on the loading screen.
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
   START
   ========================================================= */

initializePage();
