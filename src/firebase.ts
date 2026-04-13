// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGpi0C7lXUrllFAlstdmJMKEbCzFtbkec",
  authDomain: "omega-29536.firebaseapp.com",
  projectId: "omega-29536",
  storageBucket: "omega-29536.firebasestorage.app",
  messagingSenderId: "761428435205",
  appId: "1:761428435205:web:0575cf39e27f3fc5da576c"
};

// تهيئة تطبيق فايربيز
const app = initializeApp(firebaseConfig);

// تصدير قاعدة البيانات (للنصوص) والتخزين (لملفات الـ PDF والصور)
export const db = getFirestore(app);
export const storage = getStorage(app);