import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import TextArea from 'src/components/TextArea';
import TreeView, { ITreeNode } from 'src/components/TreeView';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  view: {
    display: 'flex',
  },
  parse: {
    marginTop: theme.spacing(2),
  },
}));

const Preview: React.FC<{}> = (): JSX.Element => {
  const classes = useStyles();
  const [value, setValue] = useState<string>('');
  const [json, setJson] = useState<Array<ITreeNode>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onParse = () => {
    if (isValidJSONString(value)) {
      setJson(JSON.parse(value));
    } else {
      alert('Input Valid JSON String!');
    }
  };

  const isValidJSONString = (str: string): boolean => {
    try {
      JSON.parse(str);
    } catch {
      return false;
    }
    return true;
  };

  return (
    <div className={classes.root}>
      <div className={classes.view}>
        <TextArea value={value} handleChange={handleChange} />
        <TreeView json={json} />
      </div>
      <Button
        className={classes.parse}
        color="secondary"
        size="large"
        variant="contained"
        onClick={onParse}
      >
        Parse
      </Button>
    </div>
  );
};

export default Preview;
