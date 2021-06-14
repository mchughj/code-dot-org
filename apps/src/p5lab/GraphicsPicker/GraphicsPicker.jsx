import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import StylizedBaseDialog from '@cdo/apps/templates/StylizedBaseDialog';
import StylizedTabView from '@cdo/apps/templates/StylizedTabView.jsx';
import {hide} from '../redux/animationPicker';

function GraphicsPicker(props) {
  function getBody() {
    return (
      <StylizedTabView
        tabs={[
          {
            key: 'collections',
            name: 'Collections',
            renderFn: () => <div>Collections</div>
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
      body={getBody()}
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
