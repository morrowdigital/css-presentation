import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Upload from '@material-ui/icons/CloudUpload';
import Videos from '@material-ui/icons/VideoLibrary';
import Star from '@material-ui/icons/Star';

const iconLookup = {
  Upload,
  Star,
  Videos
};

interface INavItem {
  title: string;
  name: string;
  icon: string;
}

interface INavigationItems {
  items: INavItem[];
  onClick: (name: string) => void;
}

export const NavigationItems = ({ items, onClick }: INavigationItems) => (
  <>
    {items.map(item => {
      const Icon = iconLookup[item.icon] || iconLookup.Star;
      return (
        <ListItem button={true} key={item.name} onClick={() => onClick(item.name)}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      );
    })}
  </>
);
