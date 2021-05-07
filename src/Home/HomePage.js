// Import firebase first
import firebase from "firebase/app";
import "firebase/firestore";

import React from 'react';

import Navigation from '../Navigation';
import Landing from './Landing';
import Selection from './Selection';

// Set up firebase
let firebaseConfig = {
  apiKey: "AIzaSyBMaNQHuNWqF20ofzLpkR_MWY2XfKMLIKY",
  authDomain: "suechef-307006.firebaseapp.com",
  projectId: "suechef-307006",
  storageBucket: "suechef-307006.appspot.com",
  messagingSenderId: "524821477995",
  appId: "1:524821477995:web:2577b128547c0fcd3d4f2e",
  measurementId: "G-LKG3MX0JEW"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

let db = firebase.firestore();

let metadataDoc = db.collection("recipes").doc("metadata");

function HomePage(props) {

  const [ingredientData, setIngData] = React.useState({});
  const [gotData, setGotData] = React.useState(false);
  const [selection, setSelection] = React.useState(false);

  React.useEffect(() => {
    if (!gotData) {
      metadataDoc.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data: ", doc.data());
          setIngData(doc.data());
          setGotData(true);
        } else {
          console.log("No metadata document found!");
        }
      }).catch((error) => {
        console.log("Error getting document: ", error);
      })
    }
  });

  React.useLayoutEffect(() => {
    if (selection) {
      document.getElementById('selection').scrollIntoView({behavior: 'smooth'});
    }
  });

  function start() {
    setSelection(true);
  }

  return (
    <div>
      <Navigation mobile={props.mobile} recipe={false}/>
      <Landing mobile={props.mobile} start={start}/>
      {selection ? <Selection mobile={props.mobile} db={db} data={ingredientData}/>: <div></div>}
    </div>
  );
}

export default HomePage;