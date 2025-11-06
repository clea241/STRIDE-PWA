// --- 1. Register the Service Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((reg) => {
                console.log('Service worker registered.', reg);
            })
            .catch((err) => {
                console.error('Service worker registration failed:', err);
            });
        
        // --- NEW: Load saved draft ---
        // We do this here to make sure the elements are loaded
        loadDraft();
        // --- END OF NEW PART ---
    });
}

// --- 2. Database Setup (IndexedDB) ---
const DB_NAME = 'surveyDB';
const STORE_NAME = 'surveys';
let db;

// Function to open the IndexedDB database
function initDB() {
    // ... (This function is UNCHANGED) ...
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            console.log('Database created or upgraded.');
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database opened successfully.');
            resolve();
        };
        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to add a survey to the database
function addSurveyToDB(surveyData) {
    // ... (This function is UNCHANGED) ...
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error('Database is not open.');
            return reject('Database not open');
        }
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(surveyData);
        request.onsuccess = () => {
            console.log('Survey added to IndexedDB:', surveyData);
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(function(reg) {
                    return reg.sync.register('sync-surveys');
                }).then(() => {
                    console.log('Sync task registered');
                }).catch((err) => {
                    console.error('Sync task registration failed:', err);
                });
            }
            resolve(request.result);
        };
        request.onerror = (event) => {
            console.error('Error adding survey to DB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// --- 3. Handle Form Submission ---

// --- NEW: Get references to form elements ---
const surveyForm = document.getElementById('surveyForm');
const nameInput = document.getElementById('name');
const contactInput = document.getElementById('contact');
const clearFormBtn = document.getElementById('clearFormBtn');
// --- END OF NEW PART ---

surveyForm.addEventListener('submit', (event) => {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    const surveyData = {
        name: nameInput.value,
        contact: contactInput.value,
        timestamp: new Date().toISOString()
    };

    // Save the data to IndexedDB
    addSurveyToDB(surveyData)
        .then(() => {
            console.log('Survey saved to IndexedDB.');
            alert('Thank you! Your survey has been saved offline.');

            // Clear the form
            event.target.reset();

            // --- NEW: Clear the saved draft from localStorage ---
            clearDraft();
            // --- END OF NEW PART ---
        })
        .catch((err) => {
            console.error('Failed to save survey:', err);
            alert('There was an error saving your survey.');
        });
});

// --- 4. Initialize the Database ---
initDB().catch(err => console.error('Failed to initialize database:', err));

// --- 5. NEW: Draft Saving Functions (localStorage) ---

// Function to load the draft from localStorage
function loadDraft() {
    nameInput.value = localStorage.getItem('draftName') || '';
    contactInput.value = localStorage.getItem('draftContact') || '';
    if(nameInput.value || contactInput.value) {
        console.log('Draft loaded from localStorage.');
    }
}

// Function to clear the draft from localStorage
function clearDraft() {
    localStorage.removeItem('draftName');
    localStorage.removeItem('draftContact');
    console.log('Draft cleared from localStorage.');
}

// Event listener to save text as the user types
nameInput.addEventListener('input', () => {
    localStorage.setItem('draftName', nameInput.value);
});

contactInput.addEventListener('input', () => {
    localStorage.setItem('draftContact', contactInput.value);
});

// Event listener for the new "Clear Draft" button
clearFormBtn.addEventListener('click', () => {
    // Clear the visual form
    nameInput.value = '';
    contactInput.value = '';
    
    // Clear the saved draft
    clearDraft();
    
    console.log('Form and draft cleared by user.');
});
// --- END OF NEW SECTION ---