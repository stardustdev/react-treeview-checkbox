import React from 'react';
import { TextareaAutosize } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(3),
    width: theme.spacing(60),
    resize: 'none',
    overflow: 'auto',
  },
}));

interface IProps {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<IProps> = ({
  value,
  handleChange,
}: IProps): JSX.Element => {
  const classes = useStyles();

  return (
    <TextareaAutosize
      className={classes.root}
      placeholder="Input JSON string"
      rowsMin={40}
      value={value}
      onChange={handleChange}
    />
  );
};

export default TextArea;
