import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '70vw'
    },
    ingButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '50px',
        fontSize: '16px',
        fontFamily: 'serif',
        border: '1px solid black',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px',
        padding: '10px',
        margin: '10px',
        cursor: 'pointer'
    },
    ingButtonImg: {
        maxWidth: '40px'
    },
    ingCategory: {
        display: 'flex',
        flexWrap: 'wrap',
        width: "100%",
    }
}));

function AddDialog(props) {
    let category = props.category;

    const [name, setName] = React.useState("");
    const [img, setImg] = React.useState("");

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName("");
        setImg("");
    };

    const changeName = (event) => {
        setName(event.target.value);
    }

    const changeImg = (event) => {
        setImg(event.target.value);
    }

    const addIngredient = () => {
        props.data[category][name] = {
            icon: img,
            recipes: [],
        };
        props.db.collection("recipes").doc("metadata").update(props.data);
        handleClose();
    }

    return (
        <div>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Ingredient
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Ingredient</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To add an ingredient, please put the ingredient name and the image file names (just the file names, no folders).
                The list of image files can be found in the Google Drive <a target="_blank" href="https://drive.google.com/drive/u/0/folders/1kH_khdZRc2WFcni374zWQRl_-AJXYI4V">here</a>.
            </DialogContentText>
            <TextField
                autoFocus
                label="Ingredient Name"
                fullWidth
                onChange={changeName}
            />
            <TextField
                label="Image"
                fullWidth
                onChange={changeImg}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={addIngredient} color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

function EditableIngredient(props) {
    let category = props.category;

    const [name, setName] = React.useState(props.name);
    const [img, setImg] = React.useState(props.data[category][props.name].icon);

    const [open, setOpen] = React.useState(false);

    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName(props.name);
        setImg(props.data[category][props.name].icon);
    };

    const changeName = (event) => {
        setName(event.target.value);
    }

    const changeImg = (event) => {
        setImg(event.target.value);
    }

    const addIngredient = () => {
        props.data[category][name].icon = img;
        props.db.collection("recipes").doc("metadata").update(props.data);
        handleClose();
    }

    const handleDelete = () => {
        delete props.data[category][name];
        props.db.collection("recipes").doc("metadata").update(props.data);
        handleClose();
    }

    return (
        <div>
        <div className={classes.ingButton} onClick={handleClickOpen}>
            <img src={"assets/foodIcons/colored/" + props.data[category][props.name].icon} className={classes.ingButtonImg}></img>
            <p>{props.name}</p>
        </div>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Ingredient</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit the name or properties of an ingredient. 
                The list of image files can be found in the Google Drive <a target="_blank" href="https://drive.google.com/drive/u/0/folders/1kH_khdZRc2WFcni374zWQRl_-AJXYI4V">here</a>.
            </DialogContentText>
            <TextField
                autoFocus
                label="Ingredient Name"
                fullWidth
                onChange={changeName}
                defaultValue={name}
            />
            <TextField
                label="Image"
                fullWidth
                onChange={changeImg}
                defaultValue={img}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDelete} variant="contained" style={{backgroundColor: "red", color: "white"}}>
                Delete
            </Button>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={addIngredient} color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}


export default function Ingredients(props) {
    const db = props.db;
    const ingredientData = props.data;

    let classes = useStyles();

    let getIngredients = (key) => {
        if (ingredientData[key]) {
            return Object.keys(ingredientData[key]).map((innerkey) => (
                <EditableIngredient db={db} data={ingredientData} category={key} name={innerkey}/>
            ))
        } else {
            return <div></div>;
        }
    }

    let accordions = Object.keys(ingredientData).map((key) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
            <Typography variant="h6">{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.ingCategory}>
                {getIngredients(key)}
                </div>
                <AddDialog db={db} data={ingredientData} category={key}/>
            </AccordionDetails>
          </Accordion>
        );
    });

    return (
      <div className={classes.root}>
        <Typography variant="h4">Existing Ingredients</Typography>
        <Typography>Look for your ingredient in the categories below, and if it's not there, add it!</Typography>
        <Typography>To edit an ingredient, just click on it.</Typography>
        <Typography>To refresh and see changes, click to another tab and then click back.</Typography>
        
        {accordions}
  
      </div>
    );
}