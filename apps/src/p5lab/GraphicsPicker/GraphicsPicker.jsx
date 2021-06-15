import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import StylizedBaseDialog from '@cdo/apps/templates/StylizedBaseDialog';
import StylizedTabView from '@cdo/apps/templates/StylizedTabView.jsx';
import Button from '@cdo/apps/templates/Button';
import color from '@cdo/apps/util/color';
import {hide} from '../redux/animationPicker';
import CollectionTile from './CollectionTile.jsx';
import GraphicsTile from './GraphicsTile.jsx';
import tmpCostumeLibrary from './tmpCostumeLibrary.json';

class GraphicsPicker extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    selectedCollection: undefined
  };

  handleClose() {
    this.setState({selectedCollection: undefined});
    this.props.onClose();
  }

  renderCollectionsTab() {
    return this.state.selectedCollection ? (
      <div>
        <div style={styles.headerRow}>
          <Button
            text="Back"
            onClick={() => this.setState({selectedCollection: undefined})}
            color={Button.ButtonColor.blue}
            size={Button.ButtonSize.medium}
            style={styles.backButton}
          />
          <h1 style={styles.header}>{this.state.selectedCollection}</h1>
        </div>
        <hr style={styles.hr} />
        <div>
          {tmpCostumeLibrary.collections[this.state.selectedCollection].map(
            assetName => (
              <GraphicsTile
                key={assetName}
                imageUrl={tmpCostumeLibrary.metadata[assetName].sourceUrl}
                name={tmpCostumeLibrary.metadata[assetName].name}
              />
            )
          )}
        </div>
      </div>
    ) : (
      <div>
        {Object.keys(tmpCostumeLibrary.collections).map(collectionName => (
          <CollectionTile
            key={collectionName}
            name={collectionName}
            imageUrl={
              'https://studio.code.org/blockly/media/p5lab/animation-previews/category_all.png'
            }
            assets={tmpCostumeLibrary.collections[collectionName]}
            onSelect={() => this.setState({selectedCollection: collectionName})}
          />
        ))}
      </div>
    );
  }

  getModalBody() {
    return (
      <StylizedTabView
        tabs={[
          {
            key: 'collections',
            name: 'Collections',
            renderFn: this.renderCollectionsTab.bind(this)
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

  render() {
    return (
      <StylizedBaseDialog
        isOpen={this.props.visible}
        handleClose={this.handleClose.bind(this)}
        handleConfirmation={this.handleClose.bind(this)}
        title={'Graphics Picker'}
        body={this.getModalBody()}
      />
    );
  }
}

const styles = {
  headerRow: {
    textAlign: 'center'
  },
  header: {
    fontFamily: '"Gotham 4r", sans-serif',
    fontSize: 20,
    marginBottom: 5
  },
  hr: {
    margin: 0,
    color: color.purple
  },
  backButton: {
    float: 'left'
  }
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
