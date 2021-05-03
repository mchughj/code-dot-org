import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {createUuid} from '@cdo/apps/utils';
import color from '@cdo/apps/util/color';
var msg = require('@cdo/locale');
import BaseDialog from '@cdo/apps/templates/BaseDialog.jsx';
import SearchBar from '@cdo/apps/templates/SearchBar';
import HiddenUploader from '@cdo/apps/code-studio/components/HiddenUploader';
import {
  searchAssets,
  filterOutBackgrounds
} from '@cdo/apps/code-studio/assets/searchAssets';

import styles from './styles';
import {
  hide,
  pickNewAnimation,
  pickLibraryAnimation,
  beginUpload,
  handleUploadComplete,
  handleUploadError
} from './animationPickerModule';
import ScrollableList from '../AnimationTab/ScrollableList.jsx';
import AnimationPickerListItem from './AnimationPickerListItem.jsx';

// Some operating systems round their file sizes, so max size is 101KB even
// though our error message says 100KB, to help users avoid confusion.
const MAX_UPLOAD_SIZE = 101000;

const MAX_SEARCH_RESULTS = 40;
const MAX_HEIGHT = 460;

const animationPickerStyles = {
  allAnimations: {
    color: color.purple,
    fontFamily: "'Gotham 7r', sans-serif",
    cursor: 'pointer'
  },
  breadCrumbs: {
    margin: '8px 0',
    fontSize: 14,
    display: 'inline-block'
  },
  pagination: {
    float: 'right',
    display: 'inline',
    marginTop: 10
  },
  emptyResults: {
    paddingBottom: 10
  },
  navigation: {
    minHeight: 30
  }
};

/**
 * Dialog used for finding/selecting/uploading one or more assets to add to a
 * GameLab project.
 *
 * When opened, the picker can have one of two goals:
 *   NEW_ANIMATION - the picked assets become new animations in the project.
 *   NEW_FRAME - the picked assets become new frames in an existing animation.
 *
 * It's possible for the picker to be dismissed without selecting anything,
 * or it gets dismissed when a final selection is confirmed.
 *
 * As a dialog-type redux-friendly component, the AnimationPicker handles its
 * own display state and can be "rendered" at all times by its parent.
 */
class AnimationPicker extends React.Component {
  static propTypes = {
    // Provided externally
    channelId: PropTypes.string.isRequired,
    libraryManifest: PropTypes.object.isRequired,
    hideUploadOption: PropTypes.bool.isRequired,
    hideAnimationNames: PropTypes.bool.isRequired,
    navigable: PropTypes.bool.isRequired,
    defaultQuery: PropTypes.object,
    hideBackgrounds: PropTypes.bool.isRequired,
    canDraw: PropTypes.bool.isRequired,

    // Provided via Redux
    visible: PropTypes.bool.isRequired,
    uploadInProgress: PropTypes.bool.isRequired,
    uploadError: PropTypes.string,
    is13Plus: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onPickNewAnimation: PropTypes.func.isRequired,
    onPickLibraryAnimation: PropTypes.func.isRequired,
    onUploadStart: PropTypes.func.isRequired,
    onUploadDone: PropTypes.func.isRequired,
    onUploadError: PropTypes.func.isRequired,
    playAnimations: PropTypes.bool.isRequired
  };

  state = {
    searchQuery: '',
    categoryQuery: '',
    currentPage: 0
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultQuery !== nextProps.defaultQuery) {
      const currentPage = 0;
      const {results, pageCount} = this.searchAssetsWrapper(
        currentPage,
        nextProps.defaultQuery
      );
      let nextQuery = nextProps.defaultQuery || {
        categoryQuery: '',
        searchQuery: ''
      };
      this.setState({
        ...nextQuery,
        currentPage,
        results,
        pageCount
      });
    }
  }

  searchAssetsWrapper = (page, config = {}) => {
    let {searchQuery, categoryQuery, libraryManifest} = config;

    // Set defaults if any config values are undefined.
    if (searchQuery === undefined) {
      searchQuery = this.state.searchQuery;
    }
    if (categoryQuery === undefined) {
      categoryQuery = this.state.categoryQuery;
    }
    if (libraryManifest === undefined) {
      libraryManifest = this.props.libraryManifest;
    }

    return searchAssets(
      searchQuery,
      categoryQuery,
      libraryManifest,
      page,
      MAX_SEARCH_RESULTS
    );
  };

  handleScroll = event => {
    const scrollWindow = event.target;
    const {currentPage, results, pageCount} = this.state;
    const nextPage = currentPage + 1;
    if (
      scrollWindow.scrollTop + MAX_HEIGHT >= scrollWindow.scrollHeight * 0.9 &&
      (!pageCount || nextPage <= pageCount)
    ) {
      let {results: newResults, pageCount} = this.searchAssetsWrapper(nextPage);
      if (this.props.hideBackgrounds) {
        newResults = filterOutBackgrounds(newResults);
      }

      this.setState({
        results: [...(results || []), ...newResults],
        currentPage: nextPage,
        pageCount
      });
    }
  };

  onSearchQueryChange = searchQuery => {
    const currentPage = 0;
    let {results, pageCount} = this.searchAssetsWrapper(currentPage, {
      searchQuery
    });
    if (this.props.hideBackgrounds) {
      results = filterOutBackgrounds(results);
    }
    this.setState({searchQuery, currentPage, results, pageCount});
  };

  onCategoryChange = event => {
    const categoryQuery = event.target.className;
    const currentPage = 0;
    let {results, pageCount} = this.searchAssetsWrapper(currentPage, {
      categoryQuery
    });
    if (this.props.hideBackgrounds) {
      results = filterOutBackgrounds(results);
    }
    this.setState({categoryQuery, currentPage, results, pageCount});
  };

  onClearCategories = () => {
    this.setState({
      categoryQuery: '',
      searchQuery: '',
      currentPage: 0,
      results: [],
      pageCount: 0
    });
  };

  onUploadClick = () => this.refs.uploader.openFileChooser();

  animationCategoriesRendering() {
    let categories = Object.keys(this.props.libraryManifest.categories || []);
    if (this.props.hideBackgrounds) {
      categories = categories.filter(category => category !== 'backgrounds');
    }
    categories.push('all');
    return categories.map(category => (
      <AnimationPickerListItem
        key={category}
        label={
          msg[`animationCategory_${category}`]
            ? msg[`animationCategory_${category}`]()
            : category
        }
        category={category}
        onClick={this.onCategoryChange}
      />
    ));
  }

  animationItemsRendering(animations) {
    return animations.map(animationProps => (
      <AnimationPickerListItem
        key={animationProps.sourceUrl}
        label={this.props.hideAnimationNames ? undefined : animationProps.name}
        animationProps={animationProps}
        onClick={this.props.onPickLibraryAnimation.bind(this, animationProps)}
        playAnimations={this.props.playAnimations}
      />
    ));
  }

  renderVisibleBody() {
    if (this.props.uploadError) {
      return (
        <h1>{msg.animationPicker_error({message: this.props.uploadError})}</h1>
      );
    } else if (this.props.uploadInProgress) {
      return <h1 style={styles.title}>{msg.animationPicker_uploading()}</h1>;
    } else if (!this.props.libraryManifest) {
      return <div>{msg.loading()}</div>;
    }
    const {searchQuery, categoryQuery, results} = this.state;
    const {hideUploadOption, is13Plus} = this.props;
    return (
      <div style={{marginBottom: 10}}>
        <h1 style={styles.title}>{msg.animationPicker_title()}</h1>
        {!is13Plus && !hideUploadOption && (
          <WarningLabel>{msg.animationPicker_warning()}</WarningLabel>
        )}
        <SearchBar
          placeholderText={msg.animationSearchPlaceholder()}
          onChange={evt => this.onSearchQueryChange(evt.target.value)}
        />
        {(searchQuery !== '' || categoryQuery !== '') && (
          <div style={animationPickerStyles.navigation}>
            {categoryQuery !== '' && (
              <div style={animationPickerStyles.breadCrumbs}>
                {this.props.navigable && (
                  <span
                    onClick={this.onClearCategories}
                    style={animationPickerStyles.allAnimations}
                  >
                    {`${msg.animationPicker_allCategories()} > `}
                  </span>
                )}
                <span>{msg[`animationCategory_${categoryQuery}`]()}</span>
              </div>
            )}
          </div>
        )}
        <ScrollableList
          style={{maxHeight: MAX_HEIGHT}}
          onScroll={this.handleScroll}
        >
          {(searchQuery !== '' || categoryQuery !== '') &&
            results.length === 0 && (
              <div style={animationPickerStyles.emptyResults}>
                {msg.animationPicker_noResultsFound()}
              </div>
            )}
          {((searchQuery === '' && categoryQuery === '') ||
            (results.length === 0 && this.props.canDraw)) && (
            <div>
              <AnimationPickerListItem
                label={msg.animationPicker_drawYourOwn()}
                icon="pencil"
                onClick={this.props.onPickNewAnimation}
              />
              {!hideUploadOption && (
                <AnimationPickerListItem
                  label={msg.animationPicker_uploadImage()}
                  icon="upload"
                  onClick={this.onUploadClick}
                />
              )}
            </div>
          )}
          {searchQuery === '' &&
            categoryQuery === '' &&
            this.animationCategoriesRendering()}
          {(searchQuery !== '' || categoryQuery !== '') &&
            this.animationItemsRendering(results || [])}
        </ScrollableList>
      </div>
    );
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <BaseDialog
        isOpen
        handleClose={this.props.onClose}
        uncloseable={this.props.uploadInProgress}
        fullWidth={true}
        style={styles.dialog}
      >
        <HiddenUploader
          ref="uploader"
          toUrl={
            '/v3/animations/' +
            this.props.channelId +
            '/' +
            createUuid() +
            '.png'
          }
          allowedExtensions=".png,.jpg,.jpeg"
          onUploadStart={this.props.onUploadStart}
          onUploadDone={this.props.onUploadDone}
          onUploadError={this.props.onUploadError}
        />
        {this.renderVisibleBody()}
      </BaseDialog>
    );
  }
}

export default connect(
  state => ({
    visible: state.animationPicker.visible,
    uploadInProgress: state.animationPicker.uploadInProgress,
    uploadError: state.animationPicker.uploadError,
    is13Plus: state.pageConstants.is13Plus,
    playAnimations: !state.pageConstants.allAnimationsSingleFrame
  }),
  dispatch => ({
    onClose() {
      dispatch(hide());
    },
    onPickNewAnimation() {
      dispatch(pickNewAnimation());
    },
    onPickLibraryAnimation(animation) {
      dispatch(pickLibraryAnimation(animation));
    },
    onUploadStart(data) {
      if (data.files[0].size >= MAX_UPLOAD_SIZE) {
        dispatch(handleUploadError(msg.animationPicker_unsupportedSize()));
      } else if (
        data.files[0].type === 'image/png' ||
        data.files[0].type === 'image/jpeg'
      ) {
        dispatch(beginUpload(data.files[0].name));
        data.submit();
      } else {
        dispatch(handleUploadError(msg.animationPicker_unsupportedType()));
      }
    },
    onUploadDone(result) {
      dispatch(handleUploadComplete(result));
    },
    onUploadError(status) {
      dispatch(handleUploadError(status));
    }
  })
)(AnimationPicker);

const WarningLabel = ({children}) => (
  <span style={{color: color.red}}>{children}</span>
);
WarningLabel.propTypes = {
  children: PropTypes.node
};
