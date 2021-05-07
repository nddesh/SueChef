import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

import EditRecipe from './EditRecipe';
import AddRecipe from './AddRecipe';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '70vw'
    },
    list: {
        maxHeight: '50vh',
        marginBottom: '50px',
        overflow: 'auto'
    },
}));

export default function Recipes(props) {
    let classes = useStyles();

    return (
      <div className={classes.root}>
        <Typography variant="h4">Recipes</Typography>
        <Typography variant="h6">Current Recipes</Typography>
        <Card>
            <List className={classes.list}>
                {
                    props.rdata.recipes.map((recipename) => (
                        <ListItem>
                            <ListItemText primary={recipename}/>
                            <ListItemSecondaryAction>
                                <EditRecipe name={recipename} idata={props.idata} db={props.db}/>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                }
            </List>
            <AddRecipe idata={props.idata} db={props.db}/>
        </Card>
      </div>
    );
}