body = document.querySelector("body")
document.addEventListener('DOMContentLoaded', function() {
  var ctx = document.getElementById('beignetChart').getContext('2d');
  var pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: ['Academique', 'Extra-Academique', 'Distraction'],
          datasets: [{
              label: 'My First Dataset',
              data: [0, 0, 0],
              backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
          }]
      },
  });

  function mettreAJourChart() {
      var tableau = document.querySelector('.table tbody');
      var categories = ['Academique', 'Extra-Academique', 'Distraction'];
      var donnees = [0, 0, 0];

      for (var i = 0; i < tableau.children.length; i++) {
          var categorie = tableau.children[i].children[3].textContent;
          var index = categories.indexOf(categorie);
          donnees[index]++;
      }

      pieChart.data.datasets[0].data = donnees;
      pieChart.update();
  }

  function ajouterTacheAuTableau(tache) {
    var tbody = document.querySelector('.table tbody') || document.querySelector('.table');
    var newRow = tbody.insertRow();

    var cellNum = newRow.insertCell(0);
    cellNum.innerHTML = tbody.children.length;

    var cellDate = newRow.insertCell(1);
    cellDate.innerHTML = tache.date;

    var cellTitre = newRow.insertCell(2);
    cellTitre.innerHTML = tache.titre;

    var cellCategorie = newRow.insertCell(3);
    cellCategorie.innerHTML = tache.categorie;

    /* var cellStatut = newRow.insertCell(4);
    cellStatut.innerHTML = tache.statut;
  
    var cellSupprimer = newRow.insertCell(5); */

    var cellSupprimer = newRow.insertCell(4);
    var deleteButton = document.createElement('button');
    var editButton = document.createElement('button');
    var vueButton = document.createElement('button');
    vueButton.innerHTML = '<i class="bi bi-eye"></i>';
    editButton.innerHTML = '<i class="bi bi-pen-fill"></i>'
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>'
    vueButton.classList.add("btn-vue");// Ajout d'une clase
    editButton.classList.add('btn-edit'); // Ajoutez une classe au bouton
    deleteButton.classList.add('btn-supprimer'); // Ajoutez une classe au bouton
    cellSupprimer.appendChild(vueButton);
    cellSupprimer.appendChild(editButton);
    cellSupprimer.appendChild(deleteButton);

    var divDosListe = document.getElementsByClassName('dos');
    if (divDosListe.length > 0) {
        var divDos = divDosListe[0];
        divDos.innerHTML = `${tache.description}`;
    }

    mettreAJourChart();
    enregistrerTaches(); //Enregistrer la tâche dans le localStorage

    // Ajout de l'événement click pour supprimer la tâche
    deleteButton.addEventListener('click', function() {
        supprimerTache(newRow);
    });

    // Ajout de l'événement click pour afficher les détails de la tâche
    vueButton.addEventListener('click', function() {
      var  infoDetailDiv = document.getElementById('infoDetail');
      afficherDetailsTache(newRow, tache);
      if (infoDetailDiv.style.display === "none") {
        infoDetailDiv.style.display = "block";
      } else {
        infoDetailDiv.style.display = "none";
      }
    });

   

  }

  const ajout = document.getElementById('ajouter');
  ajout.addEventListener('click', function() {
      const categorie = document.getElementById('selection').value;
      const titre = document.querySelector('input[placeholder="Titre"]').value;
      const date = document.querySelector('input[type="date"]').value;
      const description = document.querySelector('textarea[placeholder="Description"]').value;
      const statut = document.getElementById('types').value;

      const nouvelleTache = {
          categorie,
          titre,
          date,
          description,
          statut
      };

      ajouterTacheAuTableau(nouvelleTache);

      document.querySelector('input[placeholder="Titre"]').value = '';
      document.querySelector('input[type="date"]').value = '';
      document.querySelector('textarea[placeholder="Description"]').value = '';
      document.getElementById('types').value = '';

      // appeler la fonction afficherAlerte 
      afficherAlerte("Ajout de la tache", "Enregistrement réussit");
  });

  // Fonction pour afficher les détails d'une tâche
  function afficherDetailsTache(row, tache) {
    var titre = tache.titre || 'N/A';
    var date = tache.date || 'N/A';
    var categorie = tache.categorie || 'N/A';
    var description = tache.description || 'N/A';
    var statut = tache.statut || 'N/A';

    // Modifier le contenu de la div pour afficher les détails
    var infoDetailDiv = document.getElementById('infoDetail');
    infoDetailDiv.innerHTML = `
      <h2>Détails de la tâche</h2>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Titre:</strong> ${titre}</p>
      <p><strong>Catégorie:</strong> ${categorie}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Statut:</strong> ${statut}</p>
    `;

    

  }

  // Fonction pour supprimer une tâche en fonction de la ligne du tableau
  function supprimerTache(row) {
    row.remove();
    mettreAJourChart();
    chargerTaches(); // Charger les tâches précédemment enregistrées
  }

  // fonction pour afficher l'alerte dans la div
  function afficherAlerte(titre, message) {
    var titreAlerte = document.getElementById('titreAlerte');
    var messageAlerte = document.getElementById('messageAlerte');
    var conteneurAlerte = document.getElementById('conteneurAlerte');

    if (titreAlerte && messageAlerte && conteneurAlerte) {
      titreAlerte.innerHTML = titre;
      messageAlerte.innerHTML = message;
    }

    // Cacher la div d'alerte après 3 secondes
    setTimeout(function() {
      conteneurAlerte.style.display = 'none';
    }, 3000);

  }

});

function enregistrerTaches() {
  const tableauTaches = Array.from(document.querySelectorAll('.table tbody tr')).map(tr => {
    const tache = {
      num: tr.children[0].textContent,
      date: tr.children[1].textContent,
      titre: tr.children[2].textContent,
      categorie: tr.children[3].textContent,
      description: document.querySelector('.dos').textContent,
      statut: document.getElementById('types').value
    };
    return tache;
  });
  localStorage.setItem("taches", JSON.stringify(tableauTaches));
}

function chargerTaches() {
  const tachesEnregistrees = localStorage.getItem("taches");
  if (tachesEnregistrees) {
    const tableauTaches = JSON.parse(tachesEnregistrees);
    tableauTaches.forEach(tache => {
      const newRow = document.createElement('tr');
      // ...
      // Ajouter les cellules et le contenu de chaque tâche
      // ...
      tbody.appendChild(newRow);
    });
    mettreAJourChart();
  }
}