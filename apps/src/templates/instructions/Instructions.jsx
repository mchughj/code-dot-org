import PropTypes from 'prop-types';
import React from 'react';
import MarkdownInstructions from './MarkdownInstructions';
import NonMarkdownInstructions from './NonMarkdownInstructions';
import InputOutputTable from './InputOutputTable';
import AniGifPreview from './AniGifPreview';
import ImmersiveReaderButton from './ImmersiveReaderButton';
import ExampleImage from './ExampleImage';
import i18n from '@cdo/locale';

/**
 * A component for displaying our level instructions text, and possibly also
 * authored hints UI and/or an anigif. These instructions can appear in the top
 * pane or in a modal dialog. In the latter case, we will sometimes show just
 * the hints or just the anigif (in this case instructions/longInstructions
 * props will be undefined).
 */
class Instructions extends React.Component {
  static propTypes = {
    puzzleTitle: PropTypes.string,
    shortInstructions: PropTypes.string,
    instructions2: PropTypes.string,
    longInstructions: PropTypes.string,
    imgURL: PropTypes.string,
    authoredHints: PropTypes.element,
    inputOutputTable: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    inTopPane: PropTypes.bool,
    onResize: PropTypes.func,
    isBlockly: PropTypes.bool,
    noInstructionsWhenCollapsed: PropTypes.bool
  };

  /**
   * Body logic is as follows:
   *
   * If we have been given long instructions, render a div containing
   * that, optionally with inline-styled margins.
   *
   * Otherwise, render up to two sets of instructions.
   * These instructions may contain spans and images as determined by
   * substituteInstructionImages
   */
  renderMainBody() {
    if (this.props.longInstructions) {
      return (
        <MarkdownInstructions
          markdown={this.props.longInstructions}
          onResize={this.props.onResize}
          inTopPane={this.props.inTopPane}
          isBlockly={this.props.isBlockly}
          noInstructionsWhenCollapsed={this.props.noInstructionsWhenCollapsed}
        />
      );
    } else {
      return (
        <NonMarkdownInstructions
          shortInstructions={this.props.shortInstructions}
          instructions2={this.props.instructions2}
        />
      );
    }
  }

  render() {
    return (
      <div
        style={this.props.inTopPane ? styles.inTopPane : styles.notInTopPane}
      >
        <ImmersiveReaderButton
          title={this.props.puzzleTitle || i18n.instructions()}
          text={this.props.longInstructions || this.props.shortInstructions}
        />
        {this.renderMainBody()}

        {this.props.inputOutputTable && (
          <InputOutputTable data={this.props.inputOutputTable} />
        )}

        {this.props.imgURL && !this.props.inTopPane && (
          <ExampleImage src={this.props.imgURL} />
        )}
        {this.props.imgURL && this.props.inTopPane && <AniGifPreview />}
        {this.props.authoredHints}
      </div>
    );
  }
}

const styles = {
  inTopPane: {
    overflow: 'hidden'
  },
  notInTopPane: {
    overflow: 'auto'
  }
};

module.exports = Instructions;
