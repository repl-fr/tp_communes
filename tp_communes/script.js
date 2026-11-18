const api = "https://geo.api.gouv.fr";

const region = document.getElementById("region");
const departement = document.getElementById("departement");
const commune = document.getElementById("commune");
const resultat = document.getElementById("resultat");
const message = document.getElementById("message");
fetch(api + "/regions")
    .then(response => response.json())
    .then(data => {
        data.forEach(r => {
            region.innerHTML += `<option value="${r.code}">${r.nom}</option>`;
        });
    })
    .catch(() => message.textContent = "Erreur lors du chargement des régions.");
region.addEventListener("change", () => {
    departement.innerHTML = '<option value="">Choisir un département</option>';
    commune.innerHTML = '<option value="">Choisir une commune</option>';
    departement.disabled = true;
    commune.disabled = true;
    resultat.innerHTML = "<h2>Statistiques</h2>";
    if (region.value === "") return;
    fetch(api + "/departements?codeRegion=" + region.value)
        .then(response => response.json())
        .then(data => {
            data.forEach(d => {
                departement.innerHTML += `<option value="${d.code}">${d.code} - ${d.nom}</option>`;
            });
            departement.disabled = false;
            message.textContent = "Choisissez un département.";
        })
        .catch(() => message.textContent = "Erreur lors du chargement des départements.");
});
departement.addEventListener("change", () => {
    commune.innerHTML = '<option value="">Choisir une commune</option>';
    commune.disabled = true;
    resultat.innerHTML = "<h2>Statistiques</h2>";
    if (departement.value === "") return;
    fetch(api + "/communes?codeDepartement=" + departement.value + "&fields=nom,code,population,surface")
        .then(response => response.json())
        .then(data => {
            data.forEach(c => {
                commune.innerHTML += `<option value="${c.code}">${c.nom}</option>`;
            });
            const population = data.reduce((total, c) => total + (c.population || 0), 0);
            const superficie = data.reduce((total, c) => total + (c.surface || 0), 0);

            resultat.innerHTML = `
                <h2>Statistiques du département</h2>
                <p>Nombre de communes : ${data.length}</p>
                <p>Population totale : ${population.toLocaleString("fr-FR")} habitants</p>
                <p>Superficie totale : ${superficie.toLocaleString("fr-FR")} km²</p>
            `;
            commune.disabled = false;
            message.textContent = "Choisissez une commune pour voir ses informations.";
        })
        .catch(() => message.textContent = "Erreur lors du chargement des communes.");
});
commune.addEventListener("change", () => {
    if (commune.value === "") return;
    fetch(api + "/communes/" + commune.value + "?fields=nom,code,population,surface")
        .then(response => response.json())
        .then(c => {
            resultat.innerHTML = `
                <h2>Statistiques de ${c.nom}</h2>
                <p>Code INSEE : ${c.code}</p>
                <p>Population : ${c.population == null ? "Non disponible" : c.population.toLocaleString("fr-FR") + " habitants"}</p>
                <p>Superficie : ${c.surface == null ? "Non disponible" : c.surface + " km²"}</p>
            `;
            message.textContent = "Informations de la commune chargées.";
        })
        .catch(() => message.textContent = "Erreur lors du chargement de la commune.");
});
