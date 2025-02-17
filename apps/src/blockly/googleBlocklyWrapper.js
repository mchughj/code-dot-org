import {BlocklyVersion} from '@cdo/apps/constants';
import styleConstants from '@cdo/apps/styleConstants';
import CdoBlockDragger from './addons/cdoBlockDragger';
import CdoBlockSvg from './addons/cdoBlockSvg';
import initializeCdoConstants from './addons/cdoConstants';
import CdoFieldDropdown from './addons/cdoFieldDropdown';
import {CdoFieldImageDropdown} from './addons/cdoFieldImageDropdown';
import FunctionEditor from './addons/functionEditor';
import initializeGenerator from './addons/cdoGenerator';
import CdoInput from './addons/cdoInput';
import CdoMetricsManager from './addons/cdoMetricsManager';
import CdoPathObject from './addons/cdoPathObject';
import CdoTheme from './addons/cdoTheme';
import initializeTouch from './addons/cdoTouch';
import CdoTrashcan from './addons/cdoTrashcan';
import initializeVariables from './addons/cdoVariables';
import CdoVariableMap from './addons/cdoVariableMap';
import CdoWorkspaceSvg from './addons/cdoWorkspaceSvg';
import initializeBlocklyXml from './addons/cdoXml';

/**
 * Wrapper class for https://github.com/google/blockly
 * This wrapper will facilitate migrating from CDO Blockly to Google Blockly
 * by allowing us to unify the APIs so that we can switch out the underlying Blockly
 * object without affecting apps code.
 * This wrapper will contain all of our customizations to Google Blockly.
 * See also ./cdoBlocklyWrapper.js
 */
const BlocklyWrapper = function(blocklyInstance) {
  this.version = BlocklyVersion.GOOGLE;
  this.blockly_ = blocklyInstance;

  /**
   * Google Blockly sets Block ids to randomly generated 20-character strings.
   * CDO Blockly set Block ids using a global counter. There are several places in our code and
   * tests that assume Block ids will be numbers, so we want to re-implement the global counter
   * and pass the id in the Block constructor, rather than leaving it to Google Blockly.
   */
  this.uidCounter_ = 0;

  this.wrapReadOnlyProperty = function(propertyName) {
    Object.defineProperty(this, propertyName, {
      get: function() {
        return this.blockly_[propertyName];
      }
    });
  };
  this.wrapSettableProperty = function(propertyName) {
    Object.defineProperty(this, propertyName, {
      get: function() {
        return this.blockly_[propertyName];
      },
      set: function(newValue) {
        this.blockly_[propertyName] = newValue;
      }
    });
  };
};

function initializeBlocklyWrapper(blocklyInstance) {
  const blocklyWrapper = new BlocklyWrapper(blocklyInstance);

  blocklyWrapper.setInfiniteLoopTrap = function() {}; // TODO
  blocklyWrapper.clearInfiniteLoopTrap = function() {}; // TODO
  blocklyWrapper.getInfiniteLoopTrap = function() {}; // TODO
  blocklyWrapper.loopHighlight = function() {}; // TODO
  blocklyWrapper.getWorkspaceCode = function() {
    return Blockly.JavaScript.workspaceToCode(Blockly.mainBlockSpace);
  };

  blocklyWrapper.wrapReadOnlyProperty('ALIGN_CENTRE');
  blocklyWrapper.wrapReadOnlyProperty('ALIGN_LEFT');
  blocklyWrapper.wrapReadOnlyProperty('ALIGN_RIGHT');
  blocklyWrapper.wrapReadOnlyProperty('applab_locale');
  blocklyWrapper.wrapReadOnlyProperty('bindEvent_');
  blocklyWrapper.wrapReadOnlyProperty('blockRendering');
  blocklyWrapper.wrapReadOnlyProperty('Block');
  blocklyWrapper.wrapReadOnlyProperty('BlockFieldHelper');
  blocklyWrapper.wrapReadOnlyProperty('Blocks');
  blocklyWrapper.wrapReadOnlyProperty('BlockSvg');
  blocklyWrapper.wrapReadOnlyProperty('common_locale');
  blocklyWrapper.wrapReadOnlyProperty('Connection');
  blocklyWrapper.wrapReadOnlyProperty('ContextMenu');
  blocklyWrapper.wrapReadOnlyProperty('contractEditor');
  blocklyWrapper.wrapReadOnlyProperty('createSvgElement');
  blocklyWrapper.wrapReadOnlyProperty('Css');
  blocklyWrapper.wrapReadOnlyProperty('disableVariableEditing');
  blocklyWrapper.wrapReadOnlyProperty('Events');
  blocklyWrapper.wrapReadOnlyProperty('FieldAngleDropdown');
  blocklyWrapper.wrapReadOnlyProperty('FieldAngleInput');
  blocklyWrapper.wrapReadOnlyProperty('FieldAngleTextInput');
  blocklyWrapper.wrapReadOnlyProperty('FieldButton');
  blocklyWrapper.wrapReadOnlyProperty('FieldColour');
  blocklyWrapper.wrapReadOnlyProperty('FieldColourDropdown');
  blocklyWrapper.wrapReadOnlyProperty('FieldDropdown');
  blocklyWrapper.wrapReadOnlyProperty('FieldIcon');
  blocklyWrapper.wrapReadOnlyProperty('FieldImage');
  blocklyWrapper.wrapReadOnlyProperty('FieldImageDropdown');
  blocklyWrapper.wrapReadOnlyProperty('FieldLabel');
  blocklyWrapper.wrapReadOnlyProperty('FieldParameter');
  blocklyWrapper.wrapReadOnlyProperty('FieldRectangularDropdown');
  blocklyWrapper.wrapReadOnlyProperty('FieldTextInput');
  blocklyWrapper.wrapReadOnlyProperty('FieldVariable');
  blocklyWrapper.wrapReadOnlyProperty('fish_locale');
  blocklyWrapper.wrapReadOnlyProperty('Flyout');
  blocklyWrapper.wrapReadOnlyProperty('FunctionalBlockUtils');
  blocklyWrapper.wrapReadOnlyProperty('FunctionalTypeColors');
  blocklyWrapper.wrapReadOnlyProperty('FunctionEditor');
  blocklyWrapper.wrapReadOnlyProperty('functionEditor');
  blocklyWrapper.wrapReadOnlyProperty('gamelab_locale');
  blocklyWrapper.wrapReadOnlyProperty('getMainWorkspace');
  blocklyWrapper.wrapReadOnlyProperty('Generator');
  blocklyWrapper.wrapReadOnlyProperty('geras');
  blocklyWrapper.wrapReadOnlyProperty('getRelativeXY');
  blocklyWrapper.wrapReadOnlyProperty('googlecode');
  blocklyWrapper.wrapReadOnlyProperty('hasCategories');
  blocklyWrapper.wrapReadOnlyProperty('html');
  blocklyWrapper.wrapReadOnlyProperty('Input');
  blocklyWrapper.wrapReadOnlyProperty('INPUT_VALUE');
  blocklyWrapper.wrapReadOnlyProperty('js');
  blocklyWrapper.wrapReadOnlyProperty('MetricsManager');
  blocklyWrapper.wrapReadOnlyProperty('modalBlockSpace');
  blocklyWrapper.wrapReadOnlyProperty('Msg');
  blocklyWrapper.wrapReadOnlyProperty('Names');
  blocklyWrapper.wrapReadOnlyProperty('netsim_locale');
  blocklyWrapper.wrapReadOnlyProperty('Procedures');
  blocklyWrapper.wrapReadOnlyProperty('registry');
  blocklyWrapper.wrapReadOnlyProperty('removeChangeListener');
  blocklyWrapper.wrapReadOnlyProperty('RTL');
  blocklyWrapper.wrapReadOnlyProperty('Scrollbar');
  blocklyWrapper.wrapReadOnlyProperty('selected');
  blocklyWrapper.wrapReadOnlyProperty('svgResize');
  blocklyWrapper.wrapReadOnlyProperty('tutorialExplorer_locale');
  blocklyWrapper.wrapReadOnlyProperty('useContractEditor');
  blocklyWrapper.wrapReadOnlyProperty('useModalFunctionEditor');
  blocklyWrapper.wrapReadOnlyProperty('utils');
  blocklyWrapper.wrapReadOnlyProperty('Touch');
  blocklyWrapper.wrapReadOnlyProperty('Trashcan');
  blocklyWrapper.wrapReadOnlyProperty('Variables');
  blocklyWrapper.wrapReadOnlyProperty('VariableMap');
  blocklyWrapper.wrapReadOnlyProperty('weblab_locale');
  blocklyWrapper.wrapReadOnlyProperty('WidgetDiv');
  blocklyWrapper.wrapReadOnlyProperty('Workspace');
  blocklyWrapper.wrapReadOnlyProperty('WorkspaceSvg');
  blocklyWrapper.wrapReadOnlyProperty('Xml');

  blocklyWrapper.blockly_.BlockDragger = CdoBlockDragger;
  blocklyWrapper.blockly_.BlockSvg = CdoBlockSvg;
  blocklyWrapper.blockly_.FieldDropdown = CdoFieldDropdown;
  blocklyWrapper.blockly_.FieldImageDropdown = CdoFieldImageDropdown;
  blocklyWrapper.blockly_.FunctionEditor = FunctionEditor;
  blocklyWrapper.blockly_.Input = CdoInput;
  blocklyWrapper.blockly_.MetricsManager = CdoMetricsManager;
  blocklyWrapper.geras.PathObject = CdoPathObject;
  blocklyWrapper.blockly_.Trashcan = CdoTrashcan;
  blocklyWrapper.blockly_.VariableMap = CdoVariableMap;
  blocklyWrapper.blockly_.WorkspaceSvg = CdoWorkspaceSvg;

  blocklyWrapper.blockly_.registry.register(
    blocklyWrapper.blockly_.registry.Type.METRICS_MANAGER,
    blocklyWrapper.blockly_.registry.DEFAULT,
    CdoMetricsManager,
    true /* opt_allowOverrides */
  );

  blocklyWrapper.blockly_.registry.register(
    blocklyWrapper.blockly_.registry.Type.BLOCK_DRAGGER,
    blocklyWrapper.blockly_.registry.DEFAULT,
    CdoBlockDragger,
    true /* opt_allowOverrides */
  );

  // These are also wrapping read only properties, but can't use wrapReadOnlyProperty
  // because the alias name is not the same as the underlying property name.
  Object.defineProperty(blocklyWrapper, 'mainBlockSpace', {
    get: function() {
      return this.blockly_.mainWorkspace;
    }
  });
  Object.defineProperty(blocklyWrapper, 'mainBlockSpaceEditor', {
    get: function() {
      return this.blockly_.mainWorkspace;
    }
  });
  Object.defineProperty(blocklyWrapper, 'SVG_NS', {
    get: function() {
      return this.blockly_.utils.dom.SVG_NS;
    }
  });

  blocklyWrapper.wrapSettableProperty('assetUrl');
  blocklyWrapper.wrapSettableProperty('behaviorEditor');
  blocklyWrapper.wrapSettableProperty('BROKEN_CONTROL_POINTS');
  blocklyWrapper.wrapSettableProperty('BUMP_UNCONNECTED');
  blocklyWrapper.wrapSettableProperty('HSV_SATURATION');
  blocklyWrapper.wrapSettableProperty('JavaScript');
  blocklyWrapper.wrapSettableProperty('readOnly');
  blocklyWrapper.wrapSettableProperty('showUnusedBlocks');
  blocklyWrapper.wrapSettableProperty('typeHints');
  blocklyWrapper.wrapSettableProperty('valueTypeTabShapeMap');

  // Wrap SNAP_RADIUS property, and in the setter make sure we keep SNAP_RADIUS and CONNECTING_SNAP_RADIUS in sync.
  // See https://github.com/google/blockly/issues/2217
  Object.defineProperty(blocklyWrapper, 'SNAP_RADIUS', {
    get: function() {
      return this.blockly_.SNAP_RADIUS;
    },
    set: function(snapRadius) {
      this.blockly_.SNAP_RADIUS = snapRadius;
      this.blockly_.CONNECTING_SNAP_RADIUS = snapRadius;
    }
  });

  blocklyWrapper.addChangeListener = function(blockspace, handler) {
    blockspace.addChangeListener(handler);
  };

  blocklyWrapper.getWorkspaceCode = function() {
    return Blockly.JavaScript.workspaceToCode(Blockly.mainBlockSpace);
  };

  // TODO - used for spritelab behavior blocks
  blocklyWrapper.Block.createProcedureDefinitionBlock = function(config) {};

  // TODO - used to add "create a behavior" button to the toolbox
  blocklyWrapper.Flyout.configure = function(type, config) {};

  blocklyWrapper.getGenerator = function() {
    return this.JavaScript;
  };

  // TODO - used for validation in CS in Algebra.
  blocklyWrapper.findEmptyContainerBlock = function() {};
  blocklyWrapper.BlockSpace = {
    EVENTS: {
      MAIN_BLOCK_SPACE_CREATED: 'mainBlockSpaceCreated',
      EVENT_BLOCKS_IMPORTED: 'blocksImported',
      BLOCK_SPACE_CHANGE: 'blockSpaceChange',
      BLOCK_SPACE_SCROLLED: 'blockSpaceScrolled',
      RUN_BUTTON_CLICKED: 'runButtonClicked'
    },
    onMainBlockSpaceCreated: () => {}, // TODO
    createReadOnlyBlockSpace: (container, xml, options) => {
      const workspace = new Blockly.WorkspaceSvg({
        readOnly: true,
        theme: CdoTheme,
        plugins: {}
      });
      const svg = Blockly.utils.dom.createSvgElement(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:html': 'http://www.w3.org/1999/xhtml',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          version: '1.1',
          class: 'geras-renderer modern-theme readOnlyBlockSpace'
        },
        null
      );
      container.appendChild(svg);
      svg.appendChild(workspace.createDom());
      Blockly.Xml.domToBlockSpace(workspace, xml);
      // Shrink SVG to size of the block
      const bbox = svg.getBBox();
      svg.setAttribute('height', bbox.height + bbox.y);
      svg.setAttribute('width', bbox.width + bbox.x);
      return workspace;
    }
  };

  blocklyWrapper.inject = function(container, opt_options, opt_audioPlayer) {
    const options = {
      ...opt_options,
      theme: CdoTheme,
      trashcan: true,
      move: {
        wheel: true,
        drag: true,
        scrollbars: {
          vertical: true,
          horizontal: false
        }
      }
    };

    // CDO Blockly takes assetUrl as an inject option, and it's used throughout
    // apps, so we should also set it here.
    blocklyWrapper.assetUrl = opt_options.assetUrl || (path => `./${path}`);

    // Shrink container to make room for the workspace header
    container.style.height = `calc(100% - ${
      styleConstants['workspace-headers-height']
    }px)`;
    blocklyWrapper.editBlocks = opt_options.editBlocks;
    return blocklyWrapper.blockly_.inject(container, options);
  };

  // Used by StudioApp to tell Blockly to resize for Mobile Safari.
  blocklyWrapper.fireUiEvent = function(element, eventName, opt_properties) {
    if (eventName === 'resize') {
      blocklyWrapper.svgResize(blocklyWrapper.getMainWorkspace());
    }
  };

  initializeBlocklyXml(blocklyWrapper);
  initializeGenerator(blocklyWrapper);
  initializeTouch(blocklyWrapper);
  initializeVariables(blocklyWrapper);
  initializeCdoConstants(blocklyWrapper);

  return blocklyWrapper;
}

module.exports = initializeBlocklyWrapper;
