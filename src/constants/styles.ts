import { Theme } from '@material-ui/core/styles';
export const paper = (theme: Theme & { custom: any }) => ({
  width: '100%',
  minWidth: '35rem',
  maxWidth: '90rem',
  minHeight: 'calc(100% - 0.5rem)',
  display: 'flex',
  flexDirection: 'column' as 'column',
  marginBottom: '0.25em',
  [theme.breakpoints.down('md')]: {
    minWidth: '10rem',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  boxShadow: theme.custom && theme.custom.minimal ? 'none' : undefined
});
