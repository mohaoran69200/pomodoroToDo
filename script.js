// Sélectionne les boutons de démarrage, pause et arrêt avec leurs IDs respectifs
const startButton = document.querySelector('#pomodoro-start');
const pauseButton = document.querySelector('#pomodoro-pause');
const stopButton = document.querySelector('#pomodoro-stop');

// Crée une barre de progression circulaire dans l'élément avec l'ID 'pomodoro-timer'
const progressBar = new ProgressBar.Circle('#pomodoro-timer', {
    strokeWidth: 2,
    text: {
        value: '25:00',
        style: {
            fontSize: '2rem',
            fontFamily: 'title',
            position: 'absolute',
            top: '50%',
            left: '50%',
            padding: 0,
            margin: 0,
            color: '#1896c4',
            transform: {
                prefix: true,
                value: 'translate(-50%, -50%)'
            }
        }
    },
    trailColor: '#1896c4',
});


// Pour garantir que la classe est ajoutée après la création du progressBar
progressBar.text.classList.add('timer-text');


// Ajoute un écouteur d'événement 'click' au bouton de démarrage pour appeler la fonction toggleClock()
startButton.addEventListener('click', () => {
    toggleClock();
});

// Ajoute un écouteur d'événement 'click' au bouton de pause pour appeler la fonction toggleClock()
pauseButton.addEventListener('click', () => {
    toggleClock();
});

// Ajoute un écouteur d'événement 'click' au bouton d'arrêt pour appeler la fonction toggleClock() avec l'argument true
stopButton.addEventListener('click', () => {
    toggleClock(true);
});

// Initialise la variable pour indiquer si le timer est en cours d'exécution
let isClockRunning = false;

// Durée de la session de focus (25 minutes = 1500 secondes)
let focusSessionDuration = 1500;

// Temps restant pour la session de focus (initialisé à 1500 secondes)
let currentTimeLeftSession = 1500;

// Durée de la session de pause (5 minutes = 300 secondes)
let breakSessionDuration = 300;

// Initialisation de l'identifiant du timer
let clockTimer;

// Variable pour le temps passé dans la session actuelle
let timeSpentInCurrentSession = 0;

// Variable pour suivre le mode actuel ('focus' ou 'break')
let currentMode = 'focus';

// Fonction pour démarrer, mettre en pause ou réinitialiser le timer
const toggleClock = (reset) => {
    if (reset) {
        // Si 'reset' est vrai, arrête le timer et réinitialise le temps restant
        stopClock();
    } else {
        if (isClockRunning === true) {
            // Si le timer est déjà en cours d'exécution, le met en pause
            isClockRunning = false;
            clearInterval(clockTimer);
        } else {
            // Si le timer est arrêté, le démarre
            isClockRunning = true;
            clockTimer = setInterval(() => {
                stepDown();
                displayCurrentTimeLeftSession();
                progressBar.set(calculateSessionProgress());
            }, 1000);
        }
    }
};

// Fonction pour décrémenter le temps restant
const stepDown = () => {
    if (currentTimeLeftSession > 0) {
        currentTimeLeftSession--;
        timeSpentInCurrentSession++;
    } else {
        clearInterval(clockTimer);
        isClockRunning = false;
        // Vous pouvez ajouter une logique ici pour passer automatiquement à la pause ou réinitialiser
    }
};

// Fonction pour afficher le temps restant de la session actuelle
const displayCurrentTimeLeftSession = () => {
    const secondsLeft = currentTimeLeftSession;
    const seconds = secondsLeft % 60;
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const hours = Math.floor(secondsLeft / 3600);

    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time;
    }

    let formattedTime = "";
    if (hours === 0) {
        formattedTime = `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    } else {
        formattedTime = `${hours}:${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
    }

    progressBar.text.innerText = formattedTime;
};

// Fonction pour arrêter le timer et réinitialiser le temps restant
const stopClock = () => {
    clearInterval(clockTimer);
    isClockRunning = false;

    // Réinitialise le temps restant en fonction du mode actuel
    if (currentMode === 'focus') {
        currentTimeLeftSession = focusSessionDuration;
    } else if (currentMode === 'break') {
        currentTimeLeftSession = breakSessionDuration;
    }

    timeSpentInCurrentSession = 0;
    displayCurrentTimeLeftSession();
    progressBar.set(0);
};

// Fonction pour calculer la progression de la session
const calculateSessionProgress = () => {
    const sessionDuration = currentMode === 'focus' ? focusSessionDuration : breakSessionDuration;
    return timeSpentInCurrentSession / sessionDuration;
};

// Sélectionne les titres h2 pour les sessions de focus et de pause
const focusTitle = document.querySelector('#focus-mode');
const breakTitle = document.querySelector('#break-mode');

// Ajoute un écouteur d'événement 'click' pour le titre 'Focus'
focusTitle.addEventListener('click', () => {
    switchToFocusMode();
});

// Ajoute un écouteur d'événement 'click' pour le titre 'Break'
breakTitle.addEventListener('click', () => {
    switchToBreakMode();
});

// Fonction pour passer en mode focus
const switchToFocusMode = () => {
    currentMode = 'focus';
    focusSessionDuration = 1500;
    currentTimeLeftSession = focusSessionDuration;
    timeSpentInCurrentSession = 0;
    displayCurrentTimeLeftSession();
    progressBar.set(0);

    document.body.style.backgroundColor = 'rgb(5, 6, 45) ';
    document.querySelector('header').style.backgroundColor = 'rgb(5, 6, 45) ';
    document.querySelector('.container-pomo').style.backgroundColor = 'rgb(5, 6, 45) ';

    focusTitle.classList.add('active');
    breakTitle.classList.remove('active');
};

// Fonction pour passer en mode pause
const switchToBreakMode = () => {
    currentMode = 'break';
    breakSessionDuration = 300;
    currentTimeLeftSession = breakSessionDuration;
    timeSpentInCurrentSession = 0;
    displayCurrentTimeLeftSession();
    progressBar.set(0);

    document.body.style.backgroundColor = '#271149';
    document.querySelector('header').style.backgroundColor = '#f0f8ff';
    document.querySelector('.container-pomo').style.backgroundColor = '#f0f8ff';
    document.querySelector('header').style.backgroundColor = '#271149';
    document.querySelector('.container-pomo').style.backgroundColor = '#271149';
    focusTitle.classList.remove('active');
    breakTitle.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments et initialisation
    const taskInput = document.getElementById('new-task'); // Correction du sélecteur
    const taskList = document.getElementById('task-list');

    // Fonction pour ajouter une nouvelle tâche
    function addTask(taskText) {
        // Crée les éléments nécessaires
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('task-container');

        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskTextElement = document.createElement('span');
        taskTextElement.classList.add('task-text');
        taskTextElement.textContent = taskText;

        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-btn');
        completeButton.textContent = 'Complete';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';

        // Ajout des éléments dans le conteneur de la tâche
        taskItem.appendChild(taskTextElement);
        taskContainer.appendChild(taskItem);
        taskContainer.appendChild(completeButton);
        taskContainer.appendChild(deleteButton);

        // Ajout du conteneur de la tâche dans la liste
        taskList.appendChild(taskContainer);

        // Ajout des événements aux boutons
        completeButton.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            completeButton.classList.toggle('completed');
        });

        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskContainer);
        });
    }

    // Ajout de la tâche lors de la soumission du formulaire ou en appuyant sur la touche "Entrée"
    const addTaskHandler = () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    };

    document.getElementById('add-task').addEventListener('click', addTaskHandler);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskHandler();
        }
    });
});




