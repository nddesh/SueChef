// Import firebase first
import firebase from "firebase/app";
import "firebase/firestore";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Navigation from '../Navigation';
import Ingredients from './Ingredients';
import Recipes from './Recipes';

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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  instructions: {
    width: '70vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '50vh',
  }
}));

function TabPanel(props) {
  const { children, value, index, id, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Instructions() {
  const classes = useStyles();

  return (
    <div className={classes.instructions}>
      <Typography variant="h4">Adding/Editing Recipes</Typography>
      <Typography>
        To add a recipe, first make a list of all of the ingredients.
        Then, add each ingredient with the "Ingredients" tab. The tab
        should have a list of existing ingredients, so please avoid duplicates. You can also edit existing ingredients 
        if there's an error or misspelling. 
        Then, go to the "Recipes" tab, where you can look at/edit the list of existing recipes or add a new recipe.
      </Typography>
      <Typography>
        I strongly recommend clicking the "edit" button for the existing recipe before creating
        your own, in order to get a sense of the format of stuff.
        Please keep ingredient and recipe IDs in lowercase!
      </Typography>
    </div>
  );
}

export default function AdminPage(props) {
  const classes = useStyles();
  const [TabValue, setTabValue] = React.useState(0);
  const [ingredientData, setIngData] = React.useState({});
  const [recipeList, setRList] = React.useState({});
  const [gotData, setGotData] = React.useState(false);

  React.useEffect(() => {
    if (!gotData) {
      let metadataDoc = db.collection("recipes").doc("metadata");
      let recipelistDoc = db.collection("recipes").doc("recipelist");
  
      metadataDoc.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data: ", doc.data());
          setIngData(doc.data());
        } else {
          console.log("No metadata document found!");
        }
      }).catch((error) => {
        console.log("Error getting document: ", error);
      })
  
      recipelistDoc.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data: ", doc.data());
          setRList(doc.data());
        } else {
          console.log("No metadata document found!");
        }
      }).catch((error) => {
        console.log("Error getting document: ", error);
      })
      setGotData(true)
    }
  })

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Navigation mobile={props.mobile}/>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          value={TabValue}
          onChange={handleTabChange}
        >
          <Tab label="Instructions" id="inst" />
          <Tab label="Ingredients" id="ing" />
          <Tab label="Recipes" id="rec" />
        </Tabs>
        <TabPanel value={TabValue} index={0}>
          <Instructions/>
        </TabPanel>
        <TabPanel value={TabValue} index={1}>
          <Ingredients db={db} data={ingredientData}/>
        </TabPanel>
        <TabPanel value={TabValue} index={2}>
          <Recipes db={db} idata={ingredientData} rdata={recipeList}/>
        </TabPanel>
      </div>

    </div>
  );
}