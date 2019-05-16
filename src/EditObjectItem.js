import React from 'react'; // eslint-disable-line no-unused-vars
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import EditField from './fieldEditors/EditField';
import utils from './utils';

class EditObjectItem extends React.Component {
  componentDidMount() {
    this.props.repository.loadDetail(this.props.objectPath);
    this.remove = this.remove.bind(this);
  }

  remove() {
    this.props.history.push(
      utils.dotPathToUrlPath(
        utils.getParentPath(this.props.objectPath),
        this.props.basePath || '',
      ),
    );
    this.props.repository.removeItems([this.props.objectPath]);
  }

  render() {
    const {
      objectPath, itemSchema, repository, basePath = '',
    } = this.props;
    if (!repository.detailIsLoaded(objectPath)) {
      return <div>Loading...</div>;
    }
    const data = repository.getDetail(this.props.objectPath);
    if (!data) {
      return <div>Not found</div>;
    }

    const isNewItem = utils.dotPathIsNewItem(objectPath);

    const errors = utils.getErrorsForItem(
      data,
      repository.data,
      repository.modelState.errors,
    );

    const fields = Object.getOwnPropertyNames(itemSchema.children)
      .map((fieldName) => {
        const fieldSchema = itemSchema.children[fieldName];
        const fieldErrors = errors
          .filter(err => err.fieldName === fieldName)
          .map(err => err.error);

        return <EditField key={fieldName} item={data}
          fieldName={fieldName} fieldSchema={fieldSchema}
          objectPath={objectPath} isNewItem={isNewItem}
          errors={fieldErrors}
          repository={repository}
          basePath={basePath}
          onChange={() => repository.setDirty()}/>;
      });
    let removeButton;
    if (utils.itemIsInArray(objectPath)) {
      removeButton = <div className="shed-object-remove"
        onClick={() => this.remove()}
        >
        Remove
      </div>;
    }
    return <div className="shed-object-view">
      {removeButton}
      {fields}
    </div>;
  }
}

export default withRouter(observer(EditObjectItem));
