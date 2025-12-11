// firebase-config.js - configurazione Firebase per Turni Pulizie

const firebaseConfig = {
  apiKey: "AIzaSyARK3DvwfLPzGiGpuX-gjNJ4fCb8kETvqE",
  authDomain: "test-7fc65.firebaseapp.com",
  projectId: "test-7fc65",
  storageBucket: "test-7fc65.firebasestorage.app",
  messagingSenderId: "298068250376",
  appId: "1:298068250376:web:418ef6d183e8f5bda0a6bd",
  measurementId: "G-F7SD3BKD4S"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
