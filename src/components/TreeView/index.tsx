import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';
import { TreeItem, TreeView } from '@material-ui/lab';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: '1px solid black',
    padding: theme.spacing(2),
    width: theme.spacing(60),
  },
  treeitem: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export interface ITreeNode {
  name: string;
  children: Array<ITreeNode>;
  checkedState?: number;
}

interface IProps {
  json: Array<ITreeNode>;
}

const CustomTreeView: React.FC<IProps> = ({ json }: IProps): JSX.Element => {
  const classes = useStyles();
  const [data, setData] = useState<Array<ITreeNode>>([]);

  useEffect(() => {
    setData(json);
  }, [json]);

  const changeNode = (
    nodeData: Array<ITreeNode>,
    item: ITreeNode,
    state: number
  ) => {
    for (let i = 0; i < nodeData.length; i++) {
      if (nodeData[i].name === item.name) {
        nodeData[i].checkedState = state;
        return;
      }
      if (nodeData[i].children) {
        changeNode(nodeData[i].children, item, state);
      }
    }
  };

  const onChildClick = (item: ITreeNode, state: number) => {
    changeNode(data, item, state);

    if (item.children) {
      item.children.forEach((child) => {
        onChildClick(child, state);
      });
    }
  };

  const onGetPath = (data: Array<ITreeNode>, item: ITreeNode) => {
    let i;
    for (i = 0; i < data.length; i++) {
      if (data[i].name === item.name) {
        return [i];
      }
      if (data[i].children) {
        let res: any = onGetPath(data[i].children, item);
        if (res) {
          return [i, ...res];
        }
      }
    }
    return null;
  };

  const onSetCheckParent = (
    data: Array<ITreeNode>,
    deep: number,
    path: Array<number>
  ) => {
    let head: ITreeNode = {
      name: '',
      children: data,
    };
    for (let i = 0; i < deep; i++) {
      head = head.children[path[i]];
    }
    let status = head.children.every((item) => item.checkedState === 0);
    if (status) {
      head.checkedState = 0;
    } else {
      status = head.children.every((item) => item.checkedState === 1);
      if (status) {
        head.checkedState = 1;
      } else {
        head.checkedState = 2;
      }
    }
  };

  const getCheckbox = (item: ITreeNode) => {
    if (!item.checkedState) {
      item.checkedState = 0;
    }
    const onClickParent = (event: React.MouseEvent<HTMLWebViewElement>) => {
      event.stopPropagation();
      let nextStatus;
      if (!item.checkedState) {
        nextStatus = 1;
      } else if (item.checkedState === 1) {
        nextStatus = 0;
      } else {
        nextStatus = 1;
      }
      onChildClick(item, nextStatus);
      let path;
      path = onGetPath(data, item);
      if (path) {
        let len = path.length;
        for (let i = len - 1; i >= 0; i--) {
          onSetCheckParent(data, i, path);
        }
      }
      setData([...data]);
    };

    return (
      <div className={classes.treeitem} onClick={onClickParent}>
        {item.checkedState === 0 ? (
          <CheckBoxOutlineBlankIcon />
        ) : item.checkedState === 1 ? (
          <CheckBoxIcon />
        ) : (
          <IndeterminateCheckBoxIcon />
        )}
        {item.name}
      </div>
    );
  };

  const getTreeWidget = (children: Array<ITreeNode>) => {
    return children.map((parent: ITreeNode, index: number) => (
      <TreeItem nodeId={parent.name} label={getCheckbox(parent)} key={index}>
        {parent.children ? getTreeWidget(parent.children) : ''}
      </TreeItem>
    ));
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ArrowDropDown />}
      defaultExpandIcon={<ArrowRight />}
    >
      {getTreeWidget(data)}
    </TreeView>
  );
};

export default CustomTreeView;
