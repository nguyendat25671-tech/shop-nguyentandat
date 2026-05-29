// ======================================================
// FIREBASE IMPORT
// ======================================================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {

  apiKey:
  "AIzaSyCqFcZe-p8GBB0sdo5K4QAFex52_5--nLQ",

  authDomain:
  "shoptandat-baf8c.firebaseapp.com",

  projectId:
  "shoptandat-baf8c",

  storageBucket:
  "shoptandat-baf8c.appspot.com",

  messagingSenderId:
  "757338881059",

  appId:
  "1:757338881059:web:cc1da8a24693f554a68596"

};

// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app =
initializeApp(firebaseConfig);

// ======================================================
// FIRESTORE DATABASE
// ======================================================

const db =
getFirestore(app);

// ======================================================
// EXPORT
// ======================================================

export { db };