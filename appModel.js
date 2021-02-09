import AppView from './appView';
import { CATEGORY_WORDS_QUANTITY } from './constants';
import AppController from './appController';

const correctAnswerSound = document.querySelector('.correct-answer-sound');
const wrongAnswerSound = document.querySelector('.wrong-answer-sound');
const wordRecordsList = document.querySelectorAll('.word-recording');
const cardList = document.querySelectorAll('.card');
const modeSwitch = document.querySelector('.onoffswitch-checkbox');
const cardWord = document.querySelectorAll('.front .card-word-text');
const burgerMenuPageLinks = document.querySelectorAll('.nav-link');
const correctResult = 'right';
const wrongResult = 'wrong';

let correctWordsCounter = 0;
let mistakes = 0;

export default class AppModel {
  constructor(gameStarted, playMode, wordNumbers) {
    this.gameStarted = gameStarted;
    this.playMode = playMode;
    this.wordNumbers = wordNumbers;
  }

  checkIsAnswerCorrect() {
    correctWordsCounter = 0;
    mistakes = 0;
    for (let i = 0; i < CATEGORY_WORDS_QUANTITY; i += 1) {
      cardList[i].setAttribute('card-number', `${i}`);
    }
    const addButtonClickListeners = (e) => {
      const cardNumber = +e.currentTarget.getAttribute('card-number');

      if (!this.gameStarted || !this.playMode) {
        return;
      }

      if (cardNumber === this.wordNumbers[correctWordsCounter]) {
        this.countCorrectAnswers(cardNumber);
        this.countAnswersAccuracy(cardNumber);
        correctAnswerSound.play();
        AppView.prototype.addAnswerResult(correctResult);
        cardList[cardNumber].style.opacity = 0.5;
        cardList[cardNumber].classList.add('unactive');

        if (correctWordsCounter < CATEGORY_WORDS_QUANTITY - 1) {
          correctWordsCounter += 1;
          setTimeout(() => {
            wordRecordsList[this.wordNumbers[correctWordsCounter]].play();
          }, 1500);
        } else {
          cardList.forEach((elem) => {
            elem.removeEventListener('click', addButtonClickListeners);
          });

          setTimeout(() => {
            this.showEndGameWindow();
          }, 1000);
        }
      } else if (!cardList[cardNumber].classList.contains('unactive')) {
        this.countWrongAnswers(cardNumber);
        this.countAnswersAccuracy(cardNumber);
        wrongAnswerSound.play();
        mistakes += 1;
        AppView.prototype.addAnswerResult(wrongResult);
      }
    };

    const removeButtonClickListeners = () => {
      if (!this.playMode) {
        return;
      }
      this.playMode = false;
      cardList.forEach((elem) => {
        elem.removeEventListener('click', addButtonClickListeners);
      });
    };

    cardList.forEach((elem) => {
      elem.addEventListener('click', addButtonClickListeners);
    });

    modeSwitch.addEventListener('click', removeButtonClickListeners);
    burgerMenuPageLinks.forEach((elem) => {
      elem.addEventListener('click', removeButtonClickListeners);
    });
  }

  countCorrectAnswers(cardNumber) {
    const wordData = JSON.parse(localStorage[`${cardWord[cardNumber].innerHTML}`]);
    wordData.correct += 1;
    localStorage[`${cardWord[cardNumber].innerHTML}`] = JSON.stringify(wordData);
  }

  countWrongAnswers(cardNumber) {
    const wordData = JSON.parse(localStorage[`${cardWord[cardNumber].innerHTML}`]);
    wordData.wrong += 1;
    localStorage[`${cardWord[cardNumber].innerHTML}`] = JSON.stringify(wordData);
  }

  countAnswersAccuracy(cardNumber) {
    const wordData = JSON.parse(localStorage[`${cardWord[cardNumber].innerHTML}`]); // cardWord[cardNumber].innerHTML is the text of clicked card
    if (wordData.wrong !== 0) {
      wordData.accuracy = ((wordData.correct / (wordData.wrong + wordData.correct)) * 100).toFixed(1); // multiply on 100%
    } else if (wordData.correct === 0) {
      wordData.accuracy = 0;
    } else {
      wordData.accuracy = 100; // it means 100%
    }
    localStorage[`${cardWord[cardNumber].innerHTML}`] = JSON.stringify(wordData);
  }

  showEndGameWindow() {
    const successResultSound = document.querySelector('.success-result');
    const faliResultSound = document.querySelector('.failure-result');
    const endGameModal = document.querySelector('.end-game-modal');
    const endGameMessage = document.querySelector('.end-game-message');
    const modalImg = document.querySelector('.modal-img');
    const body = document.querySelector('body');

    endGameModal.classList.add('end-game-modal_visible');
    body.classList.add('no-scroll');

    if (mistakes !== 0) {
      faliResultSound.play();
      modalImg.src = './assets/images/failure.jpg';
      endGameMessage.innerHTML = `You've got ${mistakes} mistakes`;
      mistakes = 0;
      correctWordsCounter = 0;
    } else {
      successResultSound.play();
      modalImg.src = './assets/images/success.jpg';
      endGameMessage.innerHTML = 'You are win!';
      mistakes = 0;
      correctWordsCounter = 0;
    }
    this.endCurrentGame();
  }

  endCurrentGame() {
    const body = document.querySelector('body');
    const mainPage = document.querySelector('.categories');
    const cardsPage = document.querySelector('.cards-list');
    const answers = document.querySelector('.answers');
    const endGameModal = document.querySelector('.end-game-modal');
    const startGameBlock = document.querySelector('.start-game');
    const startGameButton = document.querySelector('.start-game__btn');

    cardList.forEach((elem) => {
      elem.style.opacity = '';
      elem.classList.remove('unactive');
    });

    this.gameStarted = false;
    AppController.prototype.cancelGame();

    setTimeout(() => {
      mainPage.classList.remove('hidden');
      cardsPage.classList.add('hidden');
      endGameModal.classList.remove('end-game-modal_visible');
      body.classList.remove('no-scroll');
      startGameBlock.classList.remove('visible');
      startGameButton.innerHTML = 'Start game';
      startGameButton.classList.remove('replay-record__btn');

      while (answers.firstChild) {
        answers.removeChild(answers.firstChild);
      }
    }, 2500);
  }
}
