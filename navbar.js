function renderNavbar(pageName) {
  const header = document.createElement("div");
  header.className = "top-header";

  header.innerHTML = `
    <div class="page-title">${pageName}</div>

    <div class="navbar">
      <a href="index">Podobno starting page</a>
      <a href="knowledgeBase">Wiedza 40 pokoleń</a>
      <a href="testc-optimized">Kartkóweczka</a>
    </div>
  `;

  document.body.prepend(header);
}
