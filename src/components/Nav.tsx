import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { ICustomTheme } from '../App';
import logo from '../assets/css-presentation.svg';

interface INavBarProps {
  routeTitle: string;
  children?: React.ReactNode;
}

const NavBar = ({ routeTitle, children }: INavBarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const classes = useStyles();
  const theme: ICustomTheme = useTheme();

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    if (!event.nativeEvent.target) return;
    const scrollTop = (event.nativeEvent.target as HTMLDivElement).scrollTop;
    if (scrollTop > 15 && !scrolled) {
      setScrolled(true);
    } else if (scrollTop < 15 && scrolled) {
      setScrolled(false);
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position={'fixed'} className={classnames({ [classes.appBar]: true, scrolled })} color="default">
        <Toolbar>
          <div className={classes.grow}>
            <span className={`${classes.menuButton} ${classes.link}`} color="inherit">
              <img className={classes.logo} src={logo} />
            </span>
            <Typography variant="h6" color="inherit">
              CSS Presentation
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content} onScroll={e => theme.custom && theme.custom.minimal && handleScroll(e)}>
        <div className={classes.toolbar} />
        <div className={classes.visibleSpace}>{children}</div>
      </main>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center'
  },
  link: {
    cursor: 'pointer'
  },
  logo: {
    height: '3rem',
    margin: '0.5rem'
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
