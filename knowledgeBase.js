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