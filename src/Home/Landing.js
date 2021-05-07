import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import headerImg from '../assets/plate1.png';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  topText: {
    backgroundColor: theme.palette.secondary.main,
    width: '100%'
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    margin: '1vh',
  }, 
  headerImage: {
    maxHeight: '60vw',
    marginTop: '7.5vw',
  },
  startBtn: {
    marginTop: '15px',
    width: '150px'
  },
  bgArc: {
    width: '100%',
    height: '40vh',
    borderRadius: '0 0 100% 100%',
    backgroundColor: theme.palette.secondary.main,
    position: 'absolute',
    zIndex: '-1',
    top: '15vh'
  },
  text: {
    width: '90vw',
    textAlign: 'center',
    fontFamily: '"Nunito Sans"',
    lineHeight: '1.75',
  }
}));

const useLaptopStyles = makeStyles((theme) => ({
    root: {
      width: '90vw',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      padding: '5vw',
      paddingTop: '10vh',
      justifyContent: 'space-around'
    },
    title: {
      fontWeight: '700',
    }, 
    headerImage: {
      maxWidth: '30vw',
      zIndex: '5'
    },
    startBtn: {
      width: '150px',
      fontWeight: '700',
      position: 'absolute',
      top: '85vh',
      left: '45vw'

    },
    bgArc: {
        width: '90vh',
        height: '90vh',
        borderRadius: '100% 0 0 100%',
        backgroundColor: theme.palette.secondary.main,
        position: 'absolute',
        right: '-50vh',
        top: '5vh'
      },
    left: {
        maxWidth: '50vw',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    text: {
      width: '40vw',
      fontFamily: '"Nunito Sans"',
    }
  }));

export default function Landing(props) {
    const classes = useStyles();
    const laptopClasses = useLaptopStyles();

    let page;

    if (!props.mobile) {
    page = (
        <div className={laptopClasses.root}>
            <Button size="large" variant="contained" className={laptopClasses.startBtn} onClick={props.start}>Start</Button>
            <div className={laptopClasses.left}>
              <Typography className={laptopClasses.title} variant="h4">Sue will help you</Typography>
              <Typography className={laptopClasses.title} variant="h1">Find a Recipe</Typography>
              <Typography className={laptopClasses.title} variant="h4">with ingredients from your fridge!</Typography>
              <Typography className={laptopClasses.text} variant="h5">SueChef is your personal kitchen helper! Input the ingredients from 
                your fridge and pantry, and Sue will find you the perfect recipe using those ingredients!</Typography>
            </div>
            <img src={headerImg} className={laptopClasses.headerImage} alt="Header Image" />
            <div className={laptopClasses.bgArc}></div>
        </div>
    )
    } else {
    page = (
        <div className={classes.root}>
            <div className={classes.topText}>
              <Typography className={classes.title} variant="h6">Sue will help you</Typography>
              <Typography className={classes.title} variant="h4">Find a Recipe</Typography>
              <Typography className={classes.title} variant="h6">with ingredients from your fridge!</Typography>
            </div>
            <img src={headerImg} className={classes.headerImage} alt="Header Image" />
            <div className={classes.bgArc}></div>
            <Typography className={classes.text}>SueChef is your personal kitchen helper! Input the ingredients from 
              your fridge and pantry, and Sue will find you the perfect recipe using those ingredients!</Typography>
            <Button variant="contained" className={classes.startBtn} onClick={props.start}>Start</Button>
        </div>
    )
    }

    return page;
}