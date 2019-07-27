import * as React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';

export interface ITextProps {
  text: string;
}
export const Text = observer(({ text }: ITextProps) => <Typography>{text}</Typography>);
