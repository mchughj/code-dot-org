import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import StylizedBaseDialog from '@cdo/apps/templates/StylizedBaseDialog';
import StylizedTabView from '@cdo/apps/templates/StylizedTabView.jsx';
import {hide} from '../redux/animationPicker';
import CollectionTile from './CollectionTile.jsx';
import tmpCostumeLibrary from './tmpCostumeLibrary.json';

function GraphicsPicker(props) {
  function renderCollectionsTab() {
    console.log(tmpCostumeLibrary);
    return (
      <div>
        {Object.keys(tmpCostumeLibrary.collections).map(collectionName => (
          <CollectionTile
            key={collectionName}
            name={collectionName}
            imageUrl={
              'https://studio.code.org/blockly/media/p5lab/animation-previews/category_all.png'
            }
            assets={tmpCostumeLibrary.collections[collectionName]}
          />
        ))}
      </div>
    );
  }

  function getModalBody() {
    return (
      <StylizedTabView
        tabs={[
          {
            key: 'collections',
            name: 'Collections',
            renderFn: renderCollectionsTab
          },
          {
            key: 'costumes',
            name: 'Costumes',
            renderFn: () => <div>Costumes</div>
          },
          {
            key: 'backgrounds',
            name: 'Backgrounds',
            renderFn: () => <div>Backgrounds</div>
          }
        ]}
      />
    );
  }

  return (
    <StylizedBaseDialog
      isOpen={props.visible}
      handleClose={props.onClose}
      handleConfirmation={props.onClose}
      title={'Graphics Picker'}
      body={getModalBody()}
    />
  );
}

GraphicsPicker.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(
  state => ({
    visible: state.animationPicker.visible
  }),
  dispatch => ({
    onClose() {
      dispatch(hide());
    }
  })
)(GraphicsPicker);
