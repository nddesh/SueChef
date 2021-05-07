import firebase from "firebase/app";
import "firebase/firestore";

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimerIcon from '@material-ui/icons/Timer';

import Navigation from '../Navigation';

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
} else {
    firebase.app(); // if already initialized, use that one
}

let db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
    root: {

    },
    header: {
        backgroundColor: theme.palette.primary.light,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5vw',
    },
    ingredients: {
        backgroundColor: '#f9faf5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5vw',
    },
    ingColumns: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    directions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5vw',
    },
    alternatives: {
        backgroundColor: '#f9faf5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5vw',
    },
    attribution: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5vw',
    }
}));

export default function RecipePage(props) {
    const classes = useStyles();
    const [data, setData] = React.useState(null);

    let {recipeid} = useParams();

    React.useEffect(() => {
        if (!data) {
            db.collection('recipes').doc(recipeid).get().then((doc) => {
              if (doc.exists) {
                console.log(doc.data());
                setData(doc.data());
              } else {
                console.log("No recipe document found!");
              }
            }).catch((error) => {
                console.log("Error getting document: ", error);
            })
        }
    });

    if (!data) {
        return <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><CircularProgress/></div>;
    } else if (props.mobile) {
        let ingNames = [];
        let ingAmount = [];
    
        for (const key in data.ingredients) {
            ingNames.push(<Typography style={{fontFamily: '"Nunito Sans"'}}>{key}</Typography>);
            let quant = data.ingredients[key].quantity
            ingAmount.push(
                <Typography style={{fontFamily: '"Nunito Sans"'}}>{(quant > 0? quant:"") + " " + data.ingredients[key].units}</Typography>
            );
        }

        return (
            <div className={classes.root}>
                <Navigation recipe={true} mobile={true}/>
                <div className={classes.header}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                        <Typography variant="h4" style={{marginBottom: '5vw', fontWeight: '700', textAlign:'center'}}>{data.name}</Typography>
                        <div style={{marginBottom: '5vw', display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
                            <div>
                                <Typography variant="h6">Cook Time</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"'}}>{data.totaltime} mins</Typography>
                            </div>
                            <div>
                                <Typography variant="h6">Servings</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"'}}>{data.servings}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6">Difficulty</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"'}}>{data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}</Typography>
                            </div>
                        </div>
                    </div>
                    <img src={"../assets/images/recipeImages/" + data.imagefile} style={{maxWidth: '90vw', borderRadius: '5vw'}}/>
                </div>
                <div className={classes.ingredients}>
                    <Typography variant="h5" style={{width: '100%', marginBottom: '5vw', fontWeight: '500'}}>Ingredients</Typography>
                    <div className={classes.ingColumns} style={{alignItems: 'flex-start'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>{ingAmount}</div>
                        <div style={{borderLeft: '2px solid black', marginLeft: '5px', marginRight: '5px'}}></div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>{ingNames}</div>
                    </div>
                </div>
                <div className={classes.directions}>
                    <Typography variant="h5" style={{width: '100%', marginBottom: '5vw', fontWeight: '500'}}>Directions</Typography>
                    {
                        data.steps.map((step) => (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '3vw'}}>
                                <TimerIcon style={{color: '#aaaaaa'}}/>
                                <Typography style={{fontFamily: '"Nunito Sans"'}}>{step.time} mins</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"', width: '65vw', marginLeft: '5vw'}}>{step.instruction}</Typography>
                            </div>
                        ))
                    } 
                </div>
                <div className={classes.alternatives}>
                    <Typography variant="h5" style={{width: '100%', marginBottom: '5vw', fontWeight: '500'}}>Alternatives</Typography>
                    {
                        Object.keys(data.alternatives).map((key) => (
                            <Typography style={{width: '100%', fontFamily: '"Nunito Sans"'}}>{key} - {data.alternatives[key]}</Typography>
                        ))
                    }
                </div>
                <div className={classes.attribution}>
                    <Typography style={{fontFamily: '"Nunito Sans"'}}>Recipe courtesy of <a target="_blank" href={data.alink}>{data.aname}</a> </Typography>
                </div>
            </div>
        );
    } else {
        let ingNames1 = [];
        let ingAmount1 = [];
        let ingAmount2 = [];
        let ingNames2 = [];
        let count = 0;
    
        if (Object.keys(data.ingredients).length > 6) {
            for (const key in data.ingredients) {
                if (count % 2 === 0) {
                    ingNames1.push(<Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{key}</Typography>);
                    let quant = data.ingredients[key].quantity
                    ingAmount1.push(
                        <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{(quant > 0? quant:"") + " " + data.ingredients[key].units}</Typography>
                    );
                } else {
                    ingNames2.push(<Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{key}</Typography>);
                    let quant = data.ingredients[key].quantity
                    ingAmount2.push(
                        <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{(quant > 0? quant:"") + " " + data.ingredients[key].units}</Typography>
                    );
                }
                count++;
            }
        } else {
            for (const key in data.ingredients) {
                ingNames1.push(<Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{key}</Typography>);
                let quant = data.ingredients[key].quantity
                ingAmount1.push(
                    <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{(quant > 0? quant:"") + " " + data.ingredients[key].units}</Typography>
                );
            }
        }


        return (
            <div className={classes.root}>
                <Navigation recipe={true} mobile={false}/>
                <div className={classes.header} style={{flexDirection: 'row'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                        <Typography variant="h2" style={{marginBottom: '5vw', fontWeight: '700', textAlign:'center'}}>{data.name}</Typography>
                        <div style={{marginBottom: '5vw', display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
                            <div>
                                <Typography variant="h5">Cook Time</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{data.totaltime} mins</Typography>
                            </div>
                            <div>
                                <Typography variant="h5">Servings</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{data.servings}</Typography>
                            </div>
                            <div>
                                <Typography variant="h5">Difficulty</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1)}</Typography>
                            </div>
                        </div>
                    </div>
                    <img src={"../assets/images/recipeImages/" + data.imagefile} style={{maxWidth: '40vw', borderRadius: '5vw'}}/>
                </div>
                <div className={classes.ingredients}>
                    <Typography variant="h3" style={{width: '100%', marginBottom: '5vw', fontWeight: '500'}}>Ingredients</Typography>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
                        <div className={classes.ingColumns} style={{justifyContent: 'center'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>{ingAmount1}</div>
                            <div style={{borderLeft: '2px solid black', marginLeft: '5px', marginRight: '5px'}}></div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>{ingNames1}</div>
                        </div>
                        <div className={classes.ingColumns} style={{justifyContent: 'center'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>{ingAmount2}</div>
                            <div style={{borderLeft: '2px solid black', marginLeft: '5px', marginRight: '5px'}}></div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>{ingNames2}</div>
                        </div>
                    </div>
                </div>
                <div className={classes.directions}>
                    <Typography variant="h3" style={{width: '100%', marginBottom: '5vw', fontWeight: '500'}}>Directions</Typography>
                    {
                        data.steps.map((step) => (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '3vw'}}>
                                <TimerIcon style={{color: '#aaaaaa'}}/>
                                <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{step.time} mins</Typography>
                                <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem', width: '75vw', marginLeft: '3vw'}}>{step.instruction}</Typography>
                            </div>
                        ))
                    } 
                </div>
                <div className={classes.alternatives}>
                    <Typography variant="h3" style={{width: '100%', marginBottom: '5vw', fontWeight: '500'}}>Alternatives</Typography>
                    {
                        Object.keys(data.alternatives).map((key) => (
                            <Typography style={{width: '100%', fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>{key} - {data.alternatives[key]}</Typography>
                        ))
                    }
                </div>
                <div className={classes.attribution}>
                    <Typography style={{fontFamily: '"Nunito Sans"', fontSize: '1.25rem'}}>Recipe courtesy of <a target="_blank" href={data.alink}>{data.aname}</a> </Typography>
                </div>
            </div>
        );
    }

}