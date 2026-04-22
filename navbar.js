function renderNavbar(pageName) {
  const header = document.createElement("div");
  header.className = "top-header";

  header.innerHTML = `
    <div class="page-title">${pageName}</div>

    <div class="navbar">
      <a href="index.html">🏠 Home</a>
      <a href="knowledgeBase.html">📘 Wiedza 40 pokoleń</a>
      <a href="testC.html">🧠 Test na cwela</a>
    </div>
  `;

  document.body.prepend(header);
}