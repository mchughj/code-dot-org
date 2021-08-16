import CoreLibrary from './CoreLibrary';
import {commands as backgroundEffects} from '../commands/poembot/backgroundEffects';
import {commands as foregroundEffects} from '../commands/poembot/foregroundEffects';

const OUTER_MARGIN = 50;
const LINE_HEIGHT = 50;
const FONT_SIZE = 25;
const PLAYSPACE_SIZE = 400;

export default class PoemBotLibrary extends CoreLibrary {
  constructor(p5) {
    super(p5);
    this.animationSpeed = 100; // time in frames
    this.currentLine = 0;
    this.poem = {
      title: '',
      author: '',
      lines: []
    };
    this.isVisible = false;
    this.backgroundEffect = () => this.p5.background('white');
    this.foregroundEffect = () => {};
    this.lineEvents = {};
    this.p5.noStroke();
    this.p5.fill('black');
    this.layoutInfo = []; // list of objects capturing drawing state

    this.commands = {
      // Keep everything from Core Sprite Lab
      ...this.commands,

      // Override the draw loop
      executeDrawLoopAndCallbacks() {
        if (
          this.p5.World.frameCount % this.animationSpeed === 0 &&
          this.poem.lines.length > this.currentLine
        ) {
          this.currentLine++;

          // Call callbacks for any line events at the current line
          this.lineEvents[this.currentLine]?.forEach(callback => callback());
        }
        this.backgroundEffect();
        this.runBehaviors();
        this.runEvents();
        this.p5.drawSprites();
        this.drawPoem();
        this.foregroundEffect();
      },

      // And add custom Poem Bot commands
      textConcat(text1, text2) {
        return [text1, text2].join('');
      },

      randomWord() {
        // TODO: get curated random word list from Curriculum
        const words = ['cat', 'dog', 'fish'];
        const index = this.randomNumber(0, words.length - 1);
        return words[index];
      },

      addLine(line) {
        this.poem.lines.push(line || '');
        this.layoutPoem();
      },

      setFontColor(color) {
        this.p5.fill(color);
      },

      setFont(font) {
        this.p5.textFont(font);
      },

      setTitle(title) {
        if (title) {
          this.poem.title = title;
        }
        this.layoutPoem();
      },

      setAuthor(author) {
        if (author) {
          this.poem.author = author;
        }
        this.layoutPoem();
      },

      showPoem() {
        this.isVisible = true;
      },

      hidePoem() {
        this.isVisible = false;
      },

      setPoem(key) {
        if (key === 'wordsworth') {
          this.poem = {
            title: 'I Wandered Lonely as a Cloud',
            author: 'William Wordsworth',
            lines: [
              'I wandered lonely as a cloud',
              "That floats on high o'er vales and hills,",
              'When all at once I saw a crowd,',
              'A host, of golden daffodils;',
              'Beside the lake, beneath the trees,',
              'Fluttering and dancing in the breeze.'
            ]
          };
        } else if (key === 'dickinson') {
          this.poem = {
            title: 'If I can Stop one Heart from Breaking',
            author: 'Emily Dickinson',
            lines: [
              'If I can stop one heart from breaking,',
              'I shall not live in vain;',
              'If I can ease one life the aching,',
              'Or cool one pain,',
              'Or help one fainting robin',
              'Unto his nest again,',
              'I shall not live in vain.'
            ]
          };
        } else if (key === 'silverstein') {
          this.poem = {
            title: 'Batty',
            author: 'Shel Silverstein',
            lines: [
              'The baby bat',
              'Screamed out in fright',
              "'Turn on the dark;",
              "I'm afraid of the light.'"
            ]
          };
        }
        this.layoutPoem();
      },

      setTextEffect(effect) {
        console.log(effect);
      },

      whenLineShows(lineNum, callback) {
        if (!this.lineEvents[lineNum]) {
          this.lineEvents[lineNum] = [];
        }
        this.lineEvents[lineNum].push(callback);
      },

      ...backgroundEffects,
      ...foregroundEffects
    };
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getScaledFontSize(text, desiredSize) {
    this.p5.push();
    this.p5.textSize(desiredSize);
    const fullWidth = this.p5.textWidth(text);
    const scaledSize = Math.min(
      desiredSize,
      (desiredSize * (PLAYSPACE_SIZE - OUTER_MARGIN)) / fullWidth
    );

    this.p5.pop();
    return scaledSize;
  }

  drawPoem() {
    console.log('drawPoem');
    this.layoutInfo.forEach(item => {
      this.p5.textSize(item.size);
      this.p5.text(item.text, item.x, item.y);
    });
  }

  layoutPoem() {
    console.log('layoutPoem');
    this.layoutInfo = [];
    let yCursor = OUTER_MARGIN;
    this.p5.textSize(FONT_SIZE);
    this.p5.textAlign(this.p5.CENTER);
    if (this.poem.title) {
      this.layoutInfo.push({
        text: this.poem.title,
        x: PLAYSPACE_SIZE / 2,
        y: yCursor,
        size: this.getScaledFontSize(this.poem.title, FONT_SIZE * 2)
      });
      yCursor += LINE_HEIGHT;
    }
    if (this.poem.author) {
      yCursor -= LINE_HEIGHT / 2;
      this.layoutInfo.push({
        text: this.poem.author,
        x: PLAYSPACE_SIZE / 2,
        y: yCursor,
        size: FONT_SIZE
      });
      yCursor += LINE_HEIGHT;
    }
    const lineHeight = (PLAYSPACE_SIZE - yCursor) / this.poem.lines.length;
    this.poem.lines.forEach(line => {
      this.layoutInfo.push({
        text: line,
        x: PLAYSPACE_SIZE / 2,
        y: yCursor,
        size: this.getScaledFontSize(line, FONT_SIZE)
      });
      yCursor += lineHeight;
    });
  }
}
