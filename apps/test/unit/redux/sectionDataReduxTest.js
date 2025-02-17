import {assert} from '../../util/reconfiguredChai';
import sectionData, {setSection} from '@cdo/apps/redux/sectionDataRedux';

const fakeSectionData = {
  id: 123,
  students: [
    {
      id: 1,
      name: 'studentb'
    },
    {
      id: 2,
      name: 'studenta'
    }
  ],
  script: {
    id: 300,
    name: 'csp2'
  },
  lesson_extras: false,
  tts_autoplay_enabled: false,
  code_review_enabled: true
};

const sortedFakeSectionData = {
  id: 123,
  students: [
    {
      id: 2,
      name: 'studenta'
    },
    {
      id: 1,
      name: 'studentb'
    }
  ],
  script: {
    id: 300,
    name: 'csp2'
  },
  codeReviewEnabled: true,
  lessonExtras: false,
  ttsAutoplayEnabled: false
};

describe('sectionDataRedux', () => {
  const initialState = sectionData(undefined, {});

  describe('setSection', () => {
    it('sets the section data', () => {
      const action = setSection(fakeSectionData);
      const nextState = sectionData(initialState, action);
      assert.deepEqual(nextState.section, sortedFakeSectionData);
    });
  });
});
