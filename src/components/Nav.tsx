import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Routes from './../mobx/routes';
import { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';

interface INavBarProps {
  routeTitle: string;
  children?: any;
  routesStore: Routes;
}

const NavBar = ({ routeTitle, children, routesStore }: INavBarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null as any);
  const classes = useStyles();
  const theme: any = useTheme();

  const handleScroll = (event: any) => {
    const scrollTop = event.nativeEvent.target.scrollTop;
    if (scrollTop > 15 && !scrolled) {
      setScrolled(true);
    } else if (scrollTop < 15 && scrolled) {
      setScrolled(false);
    }
  };

  const handleMenu = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const navigateTo = (routeName: string) => {
    routesStore.navigate({ name: routeName, params: {} });
  };

  const toggleDrawer = () => (drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true));

  const open = Boolean(anchorEl);
  return (
    <div className={classes.root}>
      <AppBar position={'fixed'} className={classnames({ [classes.appBar]: true, scrolled })} color="default">
        <Toolbar>
          <div className={classes.grow}>
            <span
              className={`${classes.menuButton} ${classes.link}`}
              color="inherit"
              onClick={() => navigateTo('home')}
            >
              CSS-Presentation
            </span>
            <Typography variant="h6" color="inherit">
              {routeTitle}
            </Typography>
          </div>
          <IconButton aria-haspopup="true" onClick={handleMenu} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={toggleDrawer}>Side Bar</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* <Drawer
        variant="permanent"
        onClose={() => (drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true))}
        classes={{
          paper: classnames(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose)
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem button={true} onClick={toggleDrawer}>
            <ListItemIcon>
              <MenuIcon />
            </ListItemIcon>
          </ListItem>
          <NavigationItems
            items={[            ]}
            onClick={navigateTo}
          />
        </List>
      </Drawer> */}
      <main className={classes.content} onScroll={theme.custom && theme.custom.minimal && handleScroll}>
        <div className={classes.toolbar} />
        <div className={classes.visibleSpace}>{children}</div>
      </main>
    </div>
  );
};

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    display: 'flex'
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center'
  },
  link: {
    cursor: 'pointer'
  },
  logo: {
    height: '2rem',
    marginRight: '0.5rem'
  },
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative' as 'relative',
    display: 'flex'
  },
  appBar: {
    zIndex: 1201
  },
  drawerPaper: {
    position: 'absolute' as 'absolute',
    whiteSpace: 'nowrap' as 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden' as 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    minHeight: '100%',
    padding: '1rem',
    maxWidth: '100%',
    overflowX: 'hidden',
    overflowY: 'auto' as 'auto',
    paddingTop: theme.custom && theme.custom.contentPadding,
    paddingBottom: theme.custom && theme.custom.contentPadding
  },
  visibleSpace: {
    height: 'calc(100% - 4.3em)',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row-reverse' as 'row-reverse'
  },
  toolbar: theme.mixins.toolbar
}));

export default NavBar;
