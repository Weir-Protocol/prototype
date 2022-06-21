import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCURB2eSBy_HZPkUxbXBM3Lery8DMlXXFg",
  authDomain: "weir-protocol.firebaseapp.com",
  projectId: "weir-protocol",
  storageBucket: "weir-protocol.appspot.com",
  messagingSenderId: "334364025969",
  appId: "1:334364025969:web:76e6f1d9ec092bee0ae7d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore()

export {firestore}