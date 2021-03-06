import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import utils from '../utils';

const objectArrayEditField = ({ objectPath, fieldName, basePath = '' }) => {
  let dotPath;
  if (objectPath) {
    dotPath = `${objectPath}.${fieldName}`;
  } else {
    dotPath = fieldName;
  }

  return <Link
    className="shed-array-link"
    to={utils.dotPathToUrlPath(dotPath, basePath)}>
      <div>View...</div>
    </Link>;
};

export default observer(objectArrayEditField);
