import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '70vw'
    },
    list: {
        maxHeight: '50vh',
    },
    spacing: {
        marginTop: '20px',
        marginBottom: '20px',
    }
}));

function StepsTable(props) {
    const classes = useStyles();

    function createChangeFxn(index, istime) {
        if (istime) {
            return (event) => {
                props.changeTime(index, Number(event.target.value));
            }
        } else {
            return (event) => {
                props.changeInstr(index, event.target.value);
            }
        }
    }

    function getDeleteRow(index) {
        return () => {
            props.deleteRow(index);
        };
    }

    return (
        <TableContainer className={classes.spacing} component={Paper}>
            <Typography variant="h6">Recipe Steps</Typography>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Index</TableCell>
                    <TableCell>Time (Min)</TableCell>
                    <TableCell>Instruction</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.data.map((row, index) => (
                <TableRow key={index}>
                    <Fab onClick={getDeleteRow(index)}><DeleteIcon/></Fab>
                    <TableCell>{index}</TableCell>
                    <TableCell>
                        <TextField
                            defaultValue={row.time}
                            type="number"
                            onChange={createChangeFxn(index, true)}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            multiline
                            fullWidth
                            defaultValue={row.instruction}
                            onChange={createChangeFxn(index, false)}
                        />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
            <Button color="secondary" variant="contained" onClick={props.addRow}>Add Row</Button>
      </TableContainer>
    );
}

function IngredientsTable(props) {
    const classes = useStyles();

    function createChangeFxn(ingredient, quant) {
        if (quant) {
            return (event) => {
                props.changeQuantity(ingredient, Number(event.target.value));
            }
        } else {
            return (event) => {
                props.changeUnits(ingredient, event.target.value);
            }
        }
    }

    let unitsList = ['teaspoons', 'tablespoons', 'to taste', 'pounds', 'grams',
    'cups', 'liters', 'milliliters', 'gallons', 'ounces', 'pint', 'quart', 'whole', 'slices'];

    return (
        <TableContainer className={classes.spacing} component={Paper}>
            <Typography variant="h6">Ingredient Quantities</Typography>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>Ingredient</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Units</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys(props.data).map((ingredient) => (
                <TableRow key={ingredient}>
                    <TableCell>{ingredient}</TableCell>
                    <TableCell>
                        <TextField
                            defaultValue={props.data[ingredient].quantity}
                            type="number"
                            onChange={createChangeFxn(ingredient, true)}
                        />
                    </TableCell>
                    <TableCell>
                        <Select
                            defaultValue={props.data[ingredient].units}
                            style={{minWidth: '100px'}}
                            onChange={createChangeFxn(ingredient, false)}
                            >
                            {
                                unitsList.map((item) => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))
                            }
                        </Select>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
      </TableContainer>
    );
}

export default function EditRecipe(props) {
    const [open, setOpen] = React.useState(false);

    const [data, setData] = React.useState({
        name: "",
        alternatives: {},
        totaltime: 0,
        servings: 0,
        ingredients: {},
        category: [],
        difficulty: "",
        imagefile: "",
        steps: [],
        alink: '',
        aname: ''
    });

    let toAdd = [];
    let toRemove = [];

    const handleClickOpen = () => {
        props.db.collection('recipes').doc(props.name).get().then((doc) => {
            if (doc.exists) {
              setData(doc.data());
              setOpen(true);
              toAdd = [];
              toRemove = [];
            } else {
              console.log("No recipe document found!");
            }
        }).catch((error) => {
        console.log("Error getting document: ", error);
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        props.db.collection("recipes").doc(props.name).update(data);
        if (toAdd.length > 0 || toRemove.length > 0) {
            let metadoc = props.db.collection("recipes").doc('metadata');
            metadoc.get().then((doc) => {
                if (doc.exists) {
                  let metadata = doc.data();
                  Object.keys(metadata).map((category) => {
                    for (let i = 0; i < toAdd.length; i++) {
                        if (toAdd[i] in metadata[category]) {
                            metadata[category][toAdd[i]].recipes.push(props.name);
                        }
                    }
                      for (let i = 0; i < toRemove.length; i++) {
                        if (toRemove[i] in metadata[category]) {
                            let index = metadata[category][toRemove[i]].recipes.indexOf(props.name);
                            metadata[category][toRemove[i]].recipes.splice(index, 1);
                        }
                    }
                  })
                  metadoc.update(metadata);
                  toAdd = [];
                  toRemove = [];
                } else {
                  console.log("No metadata document found!");
                }
            }).catch((error) => {
            console.log("Error getting document: ", error);
            })
        }

        handleClose();
    }

    function createChangeFxn(key, isNum) {
        return (event) => {
            if (isNum) {
                data[key] = Number(event.target.value);
            } else {
                data[key] = event.target.value;
            }
        };
    }

    function altChange(event) {
        try {
            data.alternatives = JSON.parse(event.target.value);
            setData({
                alternatives: JSON.parse(event.target.value),
                ...data
            })
        } catch(e) {
            return;
        }
    }

    function ingChange(event) {
        let ingList = event.target.value;
        let ings = Object.keys(data.ingredients);
        let newdata = {...data.ingredients};
        for (let i = 0; i < ingList.length; i++) {
            if (!ings.includes(ingList[i])) {
                newdata[ingList[i]] = {
                    quantity: 0,
                    units: "teaspoons"
                }
                toAdd.push(ingList[i]);
            }
        }
        for (let i = 0; i < ings.length; i++) {
            if (!ingList.includes(ings[i])) {
                delete newdata[ings[i]]
                toRemove.push(ings[i]);
            }
        }
        data.ingredients = newdata;
        setData({
            ingredients: newdata,
            ...data
        })
    }

    function ingQuantChange(ingredient, quantity) {
        let newdata = {...data.ingredients};
        newdata[ingredient].quantity = quantity;
        setData({
            ingredients: newdata,
            ...data
        });
    }

    function ingUnitsChange(ingredient, units) {
        let newdata = {...data.ingredients};
        newdata[ingredient].units = units;
        setData({
            ingredients: newdata,
            ...data
        });
    }

    let allingredients = [];
    Object.keys(props.idata).map((key) => {
        Object.keys(props.idata[key]).map((innerkey) => {
            allingredients.push(innerkey);
        })
    })

    function changeInstr(index, newInstr) {
        data.steps[index].instruction = newInstr;
    }

    function changeTime(index, newtime) {
        data.steps[index].time = newtime;
    }

    function addStep() {
        let newdata = [...data.steps];
        newdata.push({
            time: 0,
            instruction: ''
        });
        console.log(newdata);
        data.steps = newdata;
        setData({
            steps: newdata,
            ...data
        });
    }

    function removeStep(index) {
        data.steps.splice(index, 1);
        let newdata = [...data.steps];
        newdata.splice(index, 1);
        setData({
            steps: newdata,
            ...data
        });
    }

    return (
        <div>
        <Fab onClick={handleClickOpen} variant="extended"><EditIcon/>Edit</Fab>
        <Dialog scroll="paper" open={open} maxWidth="lg" onClose={handleClose}>
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Edit the name or properties of a recipe. 
                After you put the filename of the header image, upload it to 
                <a target="_blank" href="https://drive.google.com/drive/u/0/folders/1PwJ6b5pKpFgI-vbpHTvhGnNkRs-CBwcM"> this folder</a>
            </DialogContentText>
                <TextField
                    autoFocus
                    label="Recipe Name"
                    fullWidth
                    defaultValue={data.name}
                    onChange={createChangeFxn("name", false)}
                />
                <TextField
                    label="Attribution Name"
                    fullWidth
                    defaultValue={data.aname}
                    onChange={createChangeFxn("aname", false)}
                />
                <TextField
                    label="Attribution Link"
                    fullWidth
                    defaultValue={data.alink}
                    onChange={createChangeFxn("alink", false)}
                />
                <TextField
                    label="Servings"
                    defaultValue={data.servings}
                    onChange={createChangeFxn("servings", true)}
                    type="number"
                />
                <TextField
                    label="Total Time (Minutes)"
                    defaultValue={data.totaltime}
                    onChange={createChangeFxn("totaltime", true)}
                    type="number"
                />
                <TextField
                    label="Image File Name"
                    defaultValue={data.imagefile}
                    onChange={createChangeFxn("imagefile", false)}
                />
                <InputLabel shrink={true}>Difficulty</InputLabel>
                <Select
                    defaultValue={data.difficulty ? data.difficulty : " "}
                    style={{minWidth: '100px'}}
                    onChange={createChangeFxn("difficulty", false)}
                >
                    <MenuItem value={"easy"}>Easy</MenuItem>
                    <MenuItem value={"medium"}>Medium</MenuItem>
                    <MenuItem value={"difficult"}>Hard</MenuItem>
                </Select>
                <InputLabel shrink={true}>Category</InputLabel>
                <Select
                    multiple
                    defaultValue={data.category ? data.category : []}
                    style={{minWidth: '100px'}}
                    onChange={createChangeFxn("category", false)}
                    renderValue={(selected) => (
                        <div>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                        </div>
                    )}
                    >
                    <MenuItem value={"dinner"}>Dinner</MenuItem>
                    <MenuItem value={"lunch"}>Lunch</MenuItem>
                    <MenuItem value={"breakfast"}>Breakfast</MenuItem>
                    <MenuItem value={"desserts"}>Desserts</MenuItem>
                    <MenuItem value={"snacks"}>Snacks</MenuItem>
                    <MenuItem value={"drinks"}>Drinks</MenuItem>
                </Select>
                <InputLabel shrink={true}>Ingredients</InputLabel>
                <Select
                    multiple
                    defaultValue={Object.keys(data.ingredients) ? Object.keys(data.ingredients) : []}
                    style={{width: '100%'}}
                    onChange={ingChange}
                    renderValue={(selected) => (
                        <div>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                        </div>
                    )}
                    >
                    {allingredients.map((ing) => (
                        <MenuItem value={ing}>{ing}</MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Ingredient Alternatives (JSON)"
                    fullWidth
                    defaultValue={JSON.stringify(data.alternatives)}
                    onChange={altChange}
                />
                <IngredientsTable data={data.ingredients} changeQuantity={ingQuantChange} changeUnits={ingUnitsChange} />
                <StepsTable data={data.steps} changeTime={changeTime} changeInstr={changeInstr} deleteRow={removeStep} addRow={addStep}/>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary">
                Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
                Save
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}