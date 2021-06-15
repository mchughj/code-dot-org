import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';
import color from '@cdo/apps/util/color';

function GraphicsTile(props) {
  return (
    <div style={styles.container}>
      <img style={styles.thumbnail} src={props.imageUrl} />
      <div style={styles.name}>{props.name}</div>
    </div>
  );
}

GraphicsTile.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired
};

const styles = {
  container: {
    textAlign: 'center',
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
    width: 100,
    height: 100,
    objectFit: 'contain'
  },
  name: {
    padding: 4,
    textAlign: 'center'
  }
};

export default Radium(GraphicsTile);
