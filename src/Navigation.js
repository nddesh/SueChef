import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CloseIcon from '@material-ui/icons/Close';
import ExploreIcon from '@material-ui/icons/Explore';
import Backdrop from '@material-ui/core/Backdrop';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';

import Logo from './assets/Logo.png';

const useStyles = makeStyles((theme) => {
  let style = ({
      root: {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: 'none',
      },
      toolbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      logoimg: {
        maxHeight: '7.5vh',
      },
      drawerinner: {
        height: '100%',
        backgroundColor: theme.palette.primary.dark,
        width: '33vw',
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'absolute',
        right: '0px',
        zIndex: '10',
      },
      navButton: {
        position: 'absolute',
        zIndex: '5',
        right: '10vw',
        width: '80vw',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '10px, 10px, 15px, 15px',
        height: '12vh',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: '10',
        textTransform: 'none',
        textAlign: 'left',
      },
      navButtonTitleText: {
        fontWeight: '700'
      },
      navButtonSubText: {
        fontFamily: '"Nunito Sans"',
        fontSize: '14px',
      },
      navLink: {
        textTransform: 'none',
        fontSize: '1.25rem',
      },
      deskLinks: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '30vw'
      }
    });
  return style;
});

function NavMenu(props) {
  const classes = useStyles();
  const [state, setState] = React.useState(false);

  let navBtns = props.links.map((link) => (
    <Button className={classes.navButton} style={{top: link.top}}>
      <img style={{width: '9vh', height: '9vh', position: 'relative', left: '-7.5vw'}} src={props.recipe? "../assets/images/" + link.image : "assets/images/" + link.image}/>
      <div>
        <Typography className={classes.navButtonTitleText} variant="h4">{link.title}</Typography>
        <Typography className={classes.navButtonSubText}>{link.description}</Typography>
      </div>
    </Button>
  ))
  
  return (
    <div>
      <IconButton onClick={() => setState(true)}>
        <MenuIcon style={{width: '40px', height: '40px'}}/>
      </IconButton>
      <Backdrop style={{zIndex: '5'}} /*anchor="right"*/ open={state} onClick={() => setState(false)} onClose={() => setState(false)}>
        <div className={classes.drawerinner}>
          <CloseIcon style={{color: "white", minWidth: '30px', minHeight: '30px', margin: '10px'}}/>
        </div>
        {navBtns}
      </Backdrop>
    </div>
  );
}

function Navigation(props) {
  const classes = useStyles();


  let extrastyle = {};
  if (!props.mobile || props.recipe) {
    extrastyle.backgroundColor = 'white';
  }

  let navmenuProps = [
    {
      title: 'Discover',
      top: '10vh',
      image: "discover.png",
      description: 'Find new everyday favorites'
    },
    {
      title: 'Favorites',
      top: '25vh',
      image: "favorites.png",
      description: 'All your likes in one place'
    },
    {
      title: 'Login',
      top: '40vh',
      image: "login.png",
      description: 'Save and like tasty meals'
    },
  ]

  let desklinklist = navmenuProps.map((item) => (
    <Button className={classes.navLink}>{item.title}</Button>
  ))

  let navmenu = props.mobile ? <NavMenu recipe={props.recipe} links={navmenuProps}/> : (<div className={classes.deskLinks}>{desklinklist}</div>);

  return (
      <AppBar position="static" className={classes.root} style={extrastyle}>
        <Toolbar className={classes.toolbar}>
          <Link to="/"><img src={Logo} className={classes.logoimg} alt="SueChef Logo" /></Link>
          {navmenu}
        </Toolbar>
      </AppBar>
  );
}

export default withRouter(Navigation);