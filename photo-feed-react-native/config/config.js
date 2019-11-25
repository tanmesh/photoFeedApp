import firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAJxCNFdpKTa_YO3S42aiRV47lUsw9alEw",
  authDomain: "splatter-47c9a.firebaseapp.com",
  databaseURL: "https://splatter-47c9a.firebaseio.com",
  projectId: "splatter-47c9a",
  storageBucket: "splatter-47c9a.appspot.com",
  messagingSenderId: "32511338577",
  appId: "1:32511338577:web:78f7b7a6313a1dfe5ef070",
  measurementId: "G-K6G75ZW3XR"
};
firebase.initializeApp(config);

export const f = firebase;
export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

