import AppModel from './appModel';
import AppView from './appView';
import { CATEGORY_WORDS_QUANTITY } from './constants';

let cardClicked = false;
let playMode = false;
let gameStarted = false;
let wordNumbers = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class AppController {
  cancelGame() {
    gameStarted = false;
  }

  showWordTranslation() {
    const frontSide = document.querySelectorAll('.front');
    const backSide = document.querySelectorAll('.back');
    const showTranslationButtons = document.querySelectorAll('.rotate-icon');

    showTranslationButtons.forEach((elem, number) => {
      elem.addEventListener('click', () => {
        cardClicked = true;
        frontSide[number].style.transform = 'rotateY(180deg)';
        backSide[number].style.transform = 'rotateY(360deg)';
      });
    });
  }

  hideWordTranslation() {
    const cardList = document.querySelectorAll('.card');
    const frontSide = document.querySelectorAll('.front');
    const backSide = document.querySelectorAll('.back');

    cardList.forEach((elem, number) => {
      elem.addEventListener('click', () => {
        frontSide[number].style.transform = '';
        backSide[number].style.transform = '';
        cardClicked = false;
      });
    });
  }

  playWordAudioRecording() {
    const wordRecordsList = document.querySelectorAll('.word-recording');
    const cardWord = document.querySelectorAll('.front .card-word-text');
    const frontSide = document.querySelectorAll('.front');

    frontSide.forEach((elem, number) => {
      elem.addEventListener('click', () => {
        if (cardClicked || playMode) {
          return;
        }
        wordRecordsList[number].play();
        const wordData = JSON.parse(localStorage[`${cardWord[number].innerHTML}`]);
        wordData.trainClicked += 1;
        localStorage[`${cardWord[number].innerHTML}`] = JSON.stringify(wordData);
      });
    });
  }

  turnOffPlayMode() {
    const startGameBlock = document.querySelector('.start-game');
    const startGameButton = document.querySelector('.start-game__btn');
    const cardWordEnglish = document.querySelectorAll('.front .card-word');
    const cardFrontImg = document.querySelectorAll('.front .card-img');
    const answers = document.querySelector('.answers');
    const showTranslationButtons = document.querySelectorAll('.rotate-icon');
    const cardList = document.querySelectorAll('.card');
    startGameBlock.classList.remove('visible');
    gameStarted = false;
    playMode = false;

    while (answers.firstChild) {
      answers.removeChild(answers.firstChild);
    }

    cardList.forEach((element) => {
      element.style.opacity = '';
      element.classList.remove('unactive');
    });

    showTranslationButtons.forEach((element) => {
      element.classList.remove('hidden');
    });

    cardWordEnglish.forEach((element) => {
      element.classList.remove('hidden');
    });

    cardFrontImg.forEach((element) => {
      element.classList.remove('full-card-img');
    });

    startGameButton.classList.remove('replay-record__btn');
  }

  turnOnPlayMode() {
    const cardWordEnglish = document.querySelectorAll('.front .card-word');
    const cardFrontImg = document.querySelectorAll('.front .card-img');
    const startGameBlock = document.querySelector('.start-game');
    const showTranslationButtons = document.querySelectorAll('.rotate-icon');
    const startGameButton = document.querySelector('.start-game__btn');
    const cardsPage = document.querySelector('.cards-list');

    playMode = true;

    showTranslationButtons.forEach((element) => {
      element.classList.add('hidden');
    });

    cardWordEnglish.forEach((element) => {
      element.classList.add('hidden');
    });

    cardFrontImg.forEach((element) => {
      element.classList.add('full-card-img');
    });

    startGameButton.innerHTML = 'Start game';

    if (!cardsPage.classList.contains('hidden')) {
      startGameBlock.classList.add('visible');
    }
  }

  startGame() {
    const startGameButton = document.querySelector('.start-game__btn');
    const wordRecordsList = document.querySelectorAll('.word-recording');
    const correctAnswersQuantity = document.querySelectorAll('.unactive');
    const correctAnswersCounter = CATEGORY_WORDS_QUANTITY - (wordRecordsList.length - correctAnswersQuantity.length);

    if (!gameStarted) {
      gameStarted = true;
      const set = new Set();

      while (set.size < CATEGORY_WORDS_QUANTITY) {
        set.add(getRandomInt(0, 7));
      }

      wordNumbers = Array.from(set);

      const game = new AppModel(gameStarted, playMode, wordNumbers);
      game.checkIsAnswerCorrect();
      wordRecordsList[wordNumbers[0]].play();
      startGameButton.innerHTML = '<i class="material-icons">replay</i>';
      startGameButton.classList.add('replay-record__btn');
    } else {
      wordRecordsList[wordNumbers[correctAnswersCounter]].play();
    }
  }

  addButtonEventListeners() {
    const modeSwitch = document.querySelector('.onoffswitch-checkbox');
    const startGameButton = document.querySelector('.start-game__btn');
    const resetStatisticButton = document.querySelector('.reset-statistic__btn');
    const burgerMenuPageLinks = document.querySelectorAll('.nav-link');
    const answers = document.querySelector('.answers');
    const cardList = document.querySelectorAll('.card');

    burgerMenuPageLinks.forEach((elem) => {
      elem.addEventListener('click', () => {
        startGameButton.classList.remove('replay-record__btn');
        startGameButton.innerHTML = 'Start game';
        gameStarted = false;
        while (answers.firstChild) {
          answers.removeChild(answers.firstChild);
        }
        cardList.forEach((element) => {
          element.style.opacity = '';
        });
      });
    });

    modeSwitch.addEventListener('click', () => {
      if (!playMode) {
        this.turnOnPlayMode();
      } else {
        this.turnOffPlayMode();
      }
    });

    resetStatisticButton.addEventListener('click', () => {
      AppView.prototype.writeStartWordsData();
      AppView.prototype.renderStatisticPage();
    });

    startGameButton.addEventListener('click', this.startGame);
  }

  addBurgerMenuEventListeners() {
    const burgerMenuIcon = document.querySelector('.burger-menu-icon');
    const bodyShadow = document.querySelector('.shadow');

    burgerMenuIcon.addEventListener('click', () => {
      const burgerMenu = document.querySelector('.burger-menu');

      if (!burgerMenu.classList.contains('burger-menu-opened')) {
        AppView.prototype.openBurgerMenu();
      } else {
        AppView.prototype.closeBurgerMenu();
      }
    });

    bodyShadow.addEventListener('click', () => {
      const burgerMenu = document.querySelector('.burger-menu');

      if (!burgerMenu.classList.contains('burger-menu-opened')) {
        AppView.prototype.openBurgerMenu();
      } else {
        AppView.prototype.closeBurgerMenu();
      }
    });
  }
}

const controller = new AppController();
controller.showWordTranslation();
controller.hideWordTranslation();
controller.playWordAudioRecording();
controller.addBurgerMenuEventListeners();
controller.addButtonEventListeners();

