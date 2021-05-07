import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import FindRecipes from './FindRecipes'
import './Selection.css';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '15vh',
    marginBottom: '5vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }, 
  categoryIcon: {
      maxWidth: '40px',
  },
  tabhead: {
      textAlign: 'center'
  },
  text: {
      marginTop: '5vh',
      marginBottom: '5vh',
  },
  foodImg: {
      maxWidth: '40px',
  },
  selectedList: {
    width: '85vw',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'flex-start',
    marginBottom: '5vh',
  },
  selected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '5px',
  }
}));

let ingredients = [
    {
        header: 'fruits',
        headerImg: './assets/fruits.png'
    },
    {
        header: 'veggies',
        headerImg: './assets/veggies.png'
    },
    {
        header: 'meats',
        headerImg: './assets/meats.png'
    },
    {
        header: 'breads',
        headerImg: './assets/breads.png'
    },
    {
        header: 'liquids',
        headerImg: './assets/liquids.png'
    },
    {
        header: 'other',
        headerImg: './assets/other.png'
    },
    {
        header: 'spices',
        headerImg: './assets/spices.png'
    },
]

function Selector(props) {
    const classes = useStyles();

    let headers = ingredients.map((ingredient) => (
            <Tab><img className={classes.categoryIcon} src={ingredient.headerImg}/><Typography className={classes.tabhead}>{ingredient.header}</Typography></Tab>
    ));

    function createHandler(key, value) {
        return (event) => {
            props.modSelected(key, value, !event.target.checked);
        }
    }

    let tabpanels;
    if (Object.keys(props.data).length > 0) {
        tabpanels = ingredients.map((ingredient) => {
            let category = ingredient.header;
            let foods = Object.keys(props.data[category]).map((key) => (
                <FormControlLabel
                    labelPlacement="bottom"
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    control={
                        <Checkbox
                            checked={key in props.selected} 
                            icon={<img className={classes.foodImg} src={"assets/foodIcons/bw/" + props.data[category][key].icon}/>} 
                            checkedIcon={<img className={classes.foodImg} src={"assets/foodIcons/colored/" + props.data[category][key].icon}/>}
                            onChange={createHandler(key, props.data[category][key])}
                        />
                    }
                    style={{margin: '10px', maxHeight: '80px'}}
                />
            ))
            return (
                <TabPanel>{foods}</TabPanel>
            )
        });
    }

    return (
      <Tabs>
        <TabList>
            {headers}
        </TabList>
        {tabpanels}
      </Tabs>
    );
}

export default function Selection(props) {
    const classes = useStyles();
    const [selected, updateSelected] = React.useState({});

    function modSelected(key, value, todelete) {
        let newselected = {...selected}
        if (todelete) {
            delete newselected[key];
        } else {
            newselected[key] = value;
        }
        console.log(newselected);
        updateSelected(newselected);
    }

    return (
    <div className={classes.root} id="selection">
        <Typography className={classes.text} variant="h5">Choose your Ingredients</Typography>
        <Selector data={props.data} selected={selected} modSelected={modSelected}/>
        <Typography className={classes.text} variant="h5">Your Selection</Typography>
        <div className={classes.selectedList}>
            {
                Object.keys(selected).map((key) => (
                    <div className={classes.selected}>
                        <img src={"assets/foodIcons/colored/" + selected[key].icon} className={classes.foodImg}/>
                        <Typography>{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                    </div>
                ))
            }
        </div>
        <FindRecipes selected={selected} db={props.db}/>
        <Typography style={{margin: '3vw', fontFamily: '"Nunito Sans"'}}>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></Typography>
    </div>
    );
}