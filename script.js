
//================Variables Globales================================================================================================================

let now = new Date();
let is24HourFormat = true; // Default to 24-hour format
let selectedTimeZone = 'local'; // Default time zone
let alarmTime = null; // Store the alarm time
let alarmSound = null; // Store the selected alarm sound
let alarmePasLancer=true // variable qui sert a vérifiée que l'qlarme n'est pas déjà lancée
let audio = null; // Déclarez l'audio comme une variable globale pour pouvoir l'arreter depuis n'importe quelle fonctions (par exemple ici depuis la fonction du bouton Stop)

let hours = now.getHours();
let minutes = now.getMinutes();

updateClock(); // Appel initial pour afficher l'heure immédiatement





const timezoneSelect = document.getElementById('timezone');
const timeElement = document.getElementById('time');




// Alarm Modal Setup
const syncBtn = document.getElementById('syncBtn');
const alarmModal = document.getElementById('alarmModal');
const setAlarmBtn = document.getElementById('setAlarm');
const cancelAlarmBtn = document.getElementById('cancelAlarm');
const hoursSelect = document.getElementById('alarm-hours');
const minutesSelect = document.getElementById('alarm-minutes');
const songSelect = document.getElementById('song'); // Added to handle the song selection
const stopButton = document.getElementById('stopButton');// Mettre à jour la référence du bouton





const colorPicker = document.getElementById('color-picker');




// Ferme la modale des settings
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');



//================FIN Variables Globales================================================================================================================






//================Gestion de l'horloge================================================================================================================

// Met à jour l'heure selon le fuseau horaire et le format sélectionné

function updateClock() {
				  const timeElement = document.getElementById('time');
				  let now = new Date();

				  // Si un fuseau horaire est sélectionné, ajuste l'heure
				  if (selectedTimeZone !== 'local') {
					const options = { timeZone: selectedTimeZone };
					now = new Date(now.toLocaleString('en-US', options)); // Convertir en heure locale du fuseau
				  }
				    let hours = now.getHours();
					let minutes = now.getMinutes();
				  minutes = minutes < 10 ? '0' + minutes : minutes;


				  let period = ''; // AM or PM

				  // Gérer l'affichage 12h ou 24h
				  if (!is24HourFormat) {
					period = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
					hours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
					hours = hours === 0 ? 12 : hours; // Display 12 instead of 0 for midnight
					timeElement.style.fontSize = '3rem';//Changer la police pour que l'affichage de l'heure ne soit pas trop grosse
				  } else {
					hours = hours < 10 ? '0' + hours : hours;
					timeElement.style.fontSize = '4rem';//Changer la police pour que l'affichage de l'heure ne soit pas trop petit
				  }

				  // Display time with AM/PM if in 12-hour format
				  timeElement.textContent = `${hours}:${minutes} ${!is24HourFormat ? period : ''}`;
				}


// Mise à jour de l'heure toutes les secondes
setInterval(updateClock, 1000);






// Ajout d'un événement au clic sur l'heure pour changer le format (12h/24h)

timeElement.addEventListener('click', () => {
  is24HourFormat = !is24HourFormat; // Alterne entre 12h et 24h
  updateClock();
});





//================FIN Gestion de l'horloge================================================================================================================








//================Partie Alarme================================================================================================================

// Show modal on "Sync" button click
syncBtn.addEventListener('click', () => {
  alarmModal.style.display = 'flex';  // Show the modal
  document.body.classList.add('modal-open');  // Ajoute la classe pour flouter l'heure
});

// Close the modal without setting an alarm
cancelAlarmBtn.addEventListener('click', () => {
  alarmModal.style.display = 'none';  // Hide the modal
  document.body.classList.remove('modal-open');  // Retire la classe quand la modale est fermée
});

// Set the alarm and song
setAlarmBtn.addEventListener('click', () => {
  const selectedHour = hoursSelect.value;
  const selectedMinute = minutesSelect.value;
  alarmSound = songSelect.value; // Get the selected song
  alarmTime = `${selectedHour.padStart(2, '0')}:${selectedMinute.padStart(2, '0')}`;
  console.log(`Alarm set for ${alarmTime} with sound ${alarmSound}`);
  
  // On dit que l'alarme n'est pas lancée à chaque fois qu'on set une nouvelle alarme
  	alarmePasLancer=true

  // Hide the modal after setting the alarm
  alarmModal.style.display = 'none';
  document.body.classList.remove('modal-open');  // Retire la classe une fois l'alarme définie
});

// Function to check the current time and compare it with the alarm time
function checkAlarm() {
  if (!alarmTime) return;  // If no alarm is set, exit the function

  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;

  if (currentTime === alarmTime & alarmePasLancer) {
	audio = new Audio(`${alarmSound}.mp3`); // Initialiser l'audio global
    audio.play(); // Jouer le son d'alarme
    alarmTime = null;  // Reset alarm after it goes off
	alarmePasLancer=false
	// Afficher le bouton d'arrêt
    stopButton.style.display = 'block';
	 document.body.classList.add('modal-open');  // Ajoute la classe pour flouter l'heure




  }
}


// Gére le fait que quand on click sur le bouton "arreter le reveil" le son s'Arrête
stopButton.addEventListener('click', () => {
    if (audio) {
        audio.pause();          // Arrête la musique
        audio.currentTime = 0;   // Remet la musique au début (facultatif)
    }
    stopButton.style.display = 'none';  // Masquer le bouton après l'arrêt
	document.body.classList.remove('modal-open');  // Retire la classe quand la modale est fermée

});



// Check every 3 secondes if the alarm should go off
setInterval(checkAlarm, 3000);  // 3000 ms = 3sec


//================FIN Partie Alarme================================================================================================================









//================Partie Settings================================================================================================================




// Gestion du changement de fuseau horaire via le menu déroulant

timezoneSelect.addEventListener('change', () => {
  selectedTimeZone = timezoneSelect.value;
  updateClock();
});

// Populate the hour and minute dropdowns
for (let i = 0; i < 24; i++) {
  let option = document.createElement('option');
  option.value = i;
  option.text = i < 10 ? '0' + i : i;
  hoursSelect.appendChild(option);
}

for (let i = 0; i < 60; i++) {
  let option = document.createElement('option');
  option.value = i;
  option.text = i < 10 ? '0' + i : i;
  minutesSelect.appendChild(option);
}











// Gérer le changement de couleur de l'interface

colorPicker.addEventListener('input', function () {
  document.body.style.backgroundColor = colorPicker.value;
});

// Ferme la modale des settings
closeSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
  document.body.classList.remove('modal-open');  // Retire la classe quand la modale est fermée
});


settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
  document.body.classList.add('modal-open');  // Ajoute la classe pour flouter l'heure
});


//================FIN Partie Settings================================================================================================================






