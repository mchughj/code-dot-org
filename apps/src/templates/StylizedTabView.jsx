import React from 'react';
import PropTypes from 'prop-types';
import color from '@cdo/apps/util/color';

/**
 * StylizedTabView
 */
export default class StylizedTabView extends React.Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        name: PropTypes.string,
        renderFn: PropTypes.func
      })
    )
  };

  state = {
    activeTab: this.props.tabs[0]
  };

  selectTab(tabInfo) {
    this.setState({activeTab: tabInfo});
  }

  tmpFn(tabInfo) {
    console.log(tabInfo);
    return (
      <div
        style={Object.assign(
          {},
          styles.tab,
          this.state.activeTab.key === tabInfo.key
            ? styles.activeTab
            : styles.inactiveTab
        )}
        key={tabInfo.key}
        onClick={() => this.setState({activeTab: tabInfo})}
      >
        {tabInfo.name}
      </div>
    );
  }

  render() {
    console.log(this.state.activeTab);
    return (
      <div>
        <div style={styles.tabContainer}>
          {this.props.tabs.map(tabInfo => this.tmpFn(tabInfo))}
        </div>
        {this.state.activeTab && this.state.activeTab.renderFn()}
      </div>
    );
  }
}

const styles = {
  tabContainer: {
    background: color.lightest_gray,
    padding: 10,
    border: '1px solid',
    borderColor: color.lighter_gray
  },
  tab: {
    padding: '2px 16px',
    margin: '0px 4px',
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: 20,
    lineHeight: '28px'
  },
  activeTab: {
    backgroundColor: color.teal,
    borderRadius: 25,
    color: color.white
  },
  inactiveTab: {
    backgroundColor: color.lightest_gray,
    color: color.dark_charcoal,
    ':hover': {
      color: color.teal
    }
  }
};
