function toggle(el) {
  el.classList.toggle("active");
}

async function loadContent(event, file) {
  event.stopPropagation();

  try {
    const response = await fetch(`${file}.html`);

    if (!response.ok) {
      throw new Error("Nie znaleziono pliku");
    }

    const html = await response.text();

    document.getElementById("kbContent").innerHTML = html;

    /* ACTIVE STATE */
    document.querySelectorAll(".kb-link").forEach(link => {
      link.classList.remove("active");
    });

    event.target.classList.add("active");

  } catch (err) {
    document.getElementById("kbContent").innerHTML =
      "<h2>Błąd</h2><p>Nie udało się załadować treści.</p>";
  }
}
let currentLoadedPage = "";

async function loadAndScroll(event, page, sectionId) {
  event.stopPropagation();

  const content = document.getElementById("kbContent");

  if (currentLoadedPage !== page) {
    const response = await fetch(`kb/${page}.html`);
    const html = await response.text();

    content.innerHTML = html;
    currentLoadedPage = page;

    setTimeout(() => {
      scrollToKbSection(sectionId);
    }, 100);
  } else {
    scrollToKbSection(sectionId);
  }
}

function scrollToKbSection(id) {
  const container = document.getElementById("kbContent");
  const target = document.getElementById(id);

  if (!target) return;

  container.scrollTo({
    top: target.offsetTop - 20,
    behavior: "smooth"
  });
}