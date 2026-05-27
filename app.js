let produkte = [];

const sucheInput = document.getElementById("suche");
const container = document.getElementById("ergebnisse");

// Daten laden
fetch("produkte.json")
  .then(res => res.json())
  .then(data => {
    produkte = data;
    anzeigen(produkte);
  });

// Live-Suche
sucheInput.addEventListener("input", () => {

  const text = sucheInput.value.toLowerCase();

  const gefiltert = produkte.filter(produkt => {

    const produktTreffer =
      produkt.name.toLowerCase().includes(text) ||
      produkt.marke.toLowerCase().includes(text) ||
      produkt.artikelnummer.toLowerCase().includes(text);

    const fahrzeugTreffer = produkt.fahrzeuge.some(fzg =>
      fzg.modell.toLowerCase().includes(text) ||
      fzg.typ.toLowerCase().includes(text)
    );

    return produktTreffer || fahrzeugTreffer;
  });

  anzeigen(gefiltert);
});


// Render Funktion (Akkordeon)
function anzeigen(liste) {

  container.innerHTML = "";

  if (liste.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        Kein passendes Produkt gefunden
      </div>
    `;
    return;
  }

  liste.forEach(produkt => {

    const div = document.createElement("div");
    div.className = "accordion-item";

    const suchtext = sucheInput.value.toLowerCase();

    const passendeFahrzeuge = produkt.fahrzeuge.filter(fzg => {
      if (suchtext === "") return true;

      return (
        fzg.modell.toLowerCase().includes(suchtext) ||
        fzg.typ.toLowerCase().includes(suchtext)
      );
    });

    div.innerHTML = `
      <button class="accordion-header">
        ${produkt.name} (${produkt.artikelnummer})
      </button>

      <div class="accordion-body">

        <p><b>Marke:</b> ${produkt.marke}</p>

        ${passendeFahrzeuge.map(fzg => `
          <div class="fahrzeug">
            <b>${fzg.modell}</b><br>
            ${fzg.typ}<br>
            ${fzg.von} - ${fzg.bis}
          </div>
        `).join("")}

      </div>
    `;

    container.appendChild(div);
  });

  initAccordion();
}


// Akkordeon Verhalten
function initAccordion() {
  document.querySelectorAll(".accordion-header").forEach(btn => {
    btn.onclick = () => {
      btn.parentElement.classList.toggle("active");
    };
  });
}