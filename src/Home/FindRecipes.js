import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, withRouter } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#f9faf5',
    boxShadow: 'none',
  },
  findBtn: {
      backgroundColor: theme.palette.primary.dark,
      color: 'white',
      textTransform: 'none',
      width: '200px',
      fontFamily: 'Nunito Sans',
      fontSize: '20px'
  },
  title: {
      fontSize: '3rem',
      fontWeight: '500',
  },
  recipelist: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'flex-start',
    width: '100%',
  },
  recipeCard: {
    width: "325px",
    borderRadius: '25px',
    margin: '25px 5px 25px'
  },
  seeMoreBtn: {
    backgroundColor: theme.palette.primary.main,
    textTransform: 'none',
    color: 'white',
    width: '200px',
    fontFamily: '"Nunito Sans"',
    fontSize: '20px'
  },
  rcActions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  rcContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  rcHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center'
  },
  rcIngs: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    width: '100%',
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function RecipeCard(props) {
    const classes = useStyles();
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        if (!data) {
          props.db.collection('recipes').doc(props.recipeid).get().then((doc) => {
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

    return (
        <Card className={classes.recipeCard}>
            {data? <CardContent className={classes.rcContent}>
                <div className={classes.rcHeader}>
                    <img src="assets/images/plate1.png" style={{width: '100px'}}/>
                    <Typography variant="h5" style={{fontWeight: '700', width: '175px'}}>{data.name}</Typography>
                </div>
                <div className={classes.rcHeader}>
                    <div>
                        <Typography variant="h6">Prep Time</Typography>
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
                <Typography variant="h6" style={{marginTop: '20px'}}>Ingredients</Typography>
                <div className={classes.rcIngs}>
                    {
                        Object.keys(data.ingredients).map((item) => (<Typography style={{fontFamily: '"Nunito Sans', fontSize: '14px', width: '130px'}}>{item.charAt(0).toUpperCase() + item.slice(1)}</Typography>))
                    }
                </div>
            </CardContent> : <CircularProgress/>}
            <CardActions className={classes.rcActions}>
                <Link to={"/recipe/"+props.recipeid}><Fab variant="extended" className={classes.seeMoreBtn}>See More</Fab></Link>
            </CardActions>
        </Card>
    );
}

function FindRecipes(props) {
    //<Link to="/"><img src={Logo} className={classes.logoimg} alt="SueChef Logo" /></Link>
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [norecipes, setNoRecipes] = React.useState(false);
  const [noneselected, setNoneSelected] = React.useState(false);
  const [recipes, setRecipes] = React.useState([]);

  const handleClickOpen = () => {
    let selection = props.selected;
    
    if (Object.keys(selection).length === 0) {
        setNoneSelected(true);
        return;
    }

    let selectionKeys = Object.keys(selection);
    let commonRecipes = [];
    let currentRecipes = selection[selectionKeys[0]].recipes;

    for (let i = 1; i < selectionKeys.length; i++) {
        let toMatch = selection[selectionKeys[i]].recipes;
        for (let j = 0; j < toMatch.length; j++) {
            if (currentRecipes.includes(toMatch[j])) {
                commonRecipes.push(toMatch[j])
            }
        }
        currentRecipes = commonRecipes;
        commonRecipes = [];
    }
    console.log(currentRecipes);

    if (currentRecipes.length === 0) {
        setNoRecipes(true);
        return;
    } else {
        setRecipes(currentRecipes);
        setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNoRecClose = () => {
    setNoRecipes(false);
  }

  const handleNoSelClose = () => {
    setNoneSelected(false);
  }

  return (
    <div>
      <Fab variant="extended" onClick={handleClickOpen} className={classes.findBtn}>Find Recipes</Fab>
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={norecipes} autoHideDuration={6000} onClose={handleNoRecClose}
        message="We're sorry, we found no recipes with those ingredients"
        ContentProps={{style: {fontFamily: '"Nunito Sans"', backgroundColor: 'red'}}}
        action={<IconButton onClick={handleNoRecClose}><CloseIcon style={{color: 'white'}}/></IconButton>}
        color="primary"
      />
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={noneselected} autoHideDuration={6000} onClose={handleNoSelClose}
        message="Please select an ingredient"
        ContentProps={{style: {fontFamily: '"Nunito Sans"', backgroundColor: 'red'}}}
        action={<IconButton onClick={handleNoSelClose}><CloseIcon style={{color: 'white'}}/></IconButton>}
      />
      <Dialog fullScreen PaperProps={{style: {backgroundColor: '#f9faf5'}}} open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.root}>
            <Typography className={classes.title}>
                Recipes
            </Typography>
            <div className={classes.recipelist}>
                {
                    recipes.map((id) => (
                        <RecipeCard db={props.db} recipeid={id}/>
                    ))
                }
            </div>
        </div>
      </Dialog>
    </div>
  );
}

export default withRouter(FindRecipes);