import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';
import color from '@cdo/apps/util/color';

function CollectionTile(props) {
  function handleClick() {
    console.log('click');
  }

  return (
    <div style={styles.container} onClick={handleClick}>
      <img style={styles.thumbnail} src={props.imageUrl} />
      <div style={styles.name}>{props.name}</div>
    </div>
  );
}

CollectionTile.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  assets: PropTypes.arrayOf(PropTypes.string).isRequired
};

CollectionTile.defaultProps = {
  assets: []
};

const styles = {
  container: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: color.light_gray,
    borderRadius: 10,
    display: 'inline-block',
    cursor: 'pointer',
    color: color.light_gray,
    margin: 8,
    ':hover': {
      borderWidth: 1,
      borderColor: color.purple,
      color: color.purple
    }
  },
  thumbnail: {
    width: 105
  },
  name: {
    padding: 4,
    textAlign: 'center'
  }
};

export default Radium(CollectionTile);
