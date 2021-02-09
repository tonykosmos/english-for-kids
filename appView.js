import { cards } from './cards';
import {
  BURGER_MENU_ITEMS, CATEGORIES_QUANTITY, CATEGORY_WORDS_QUANTITY, STATISTIC_DATA_TYPES_QUANTITY,
  FULL_WORDS_LIST, STATISTIC_PAGE_NUMBER, MAIN_PAGE_NUMBER,
} from './constants';

let currentPage = 0;

export default class AppView {
  constructor(pageNumber) {
    this.pageNumber = pageNumber;
  }

  renderCardsPage() {
    const cardWordEnglish = document.querySelectorAll('.front .card-word p');
    const cardWordRus = document.querySelectorAll('.back .card-word p');
    const cardFrontImg = document.querySelectorAll('.front .card-img');
    const cardBackImg = document.querySelectorAll('.back .card-img');
    const onOffSwitchInner = document.querySelector('.onoffswitch-inner');
    const onOffSwitch = document.querySelector('.onoffswitch-switch');
    const wordRecordsList = document.querySelectorAll('.word-recording');

    for (let i = 0; i < CATEGORY_WORDS_QUANTITY; i += 1) {
      cardWordEnglish[i].innerHTML = cards[this.pageNumber][i].word;
      cardWordRus[i].innerHTML = cards[this.pageNumber][i].translation;
      cardFrontImg[i].src = cards[this.pageNumber][i].image;
      cardBackImg[i].src = cards[this.pageNumber][i].image;
      wordRecordsList[i].src = cards[this.pageNumber][i].audioSrc;
    }

    setTimeout(() => {
      onOffSwitch.style.transition = '0.3s';
      onOffSwitchInner.style.transition = '0.3s';
    }, 200);
  }

  renderStatisticPage() {
    const statisticTable = document.querySelector('.statistic');

    while (statisticTable.children.length !== 1) {
      statisticTable.removeChild(statisticTable.lastChild);
    }
    for (let i = 1; i < cards.length; i += 1) {
      for (let j = 0; j < cards[i].length; j += 1) {
        const wordStatistic = document.createElement('tr');
        wordStatistic.className = 'word-statistic';
        for (let k = 0; k < STATISTIC_DATA_TYPES_QUANTITY; k += 1) {
          const wordData = document.createElement('td');
          wordData.className = 'statistic-data';
          const currentWordStatistic = JSON.parse(localStorage[`${cards[i][j].word}`]);

          switch (k) {
            case 0:
              wordData.innerHTML = `${cards[0][i - 1]}`;
              break;
            case 1:
              wordData.innerHTML = `${cards[i][j].word}`;
              break;
            case 2:
              wordData.innerHTML = `${cards[i][j].translation}`;
              break;
            case 3:
              wordData.innerHTML = currentWordStatistic.trainClicked;
              break;
            case 4:
              wordData.innerHTML = currentWordStatistic.correct;
              break;
            case 5:
              wordData.innerHTML = currentWordStatistic.wrong;
              break;
            case 6:
              wordData.innerHTML = currentWordStatistic.accuracy;
              break;
            default:
          }
          wordStatistic.appendChild(wordData);
        }
        statisticTable.appendChild(wordStatistic);
      }
    }
  }

  openBurgerMenu() {
    const body = document.querySelector('body');
    const bodyShadow = document.querySelector('.shadow');
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerMenuIcon = document.querySelector('.burger-menu-icon');

    burgerMenu.classList.add('burger-menu-opened');
    body.classList.add('no-scroll');
    bodyShadow.classList.add('visible');
    burgerMenuIcon.style.transform = 'rotate(90deg)';
  }

  closeBurgerMenu() {
    const body = document.querySelector('body');
    const bodyShadow = document.querySelector('.shadow');
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerMenuIcon = document.querySelector('.burger-menu-icon');

    burgerMenu.classList.remove('burger-menu-opened');
    body.classList.remove('no-scroll');
    bodyShadow.classList.remove('visible');
    burgerMenuIcon.style.transform = '';
  }

  addAnswerResult(result) {
    const answers = document.querySelector('.answers');
    const answerResult = document.createElement('img');

    answerResult.src = `./assets/images/${result}.png`;
    answerResult.className = 'answers__img';
    answers.prepend(answerResult);
  }

  writeStartWordsData() {
    for (let i = 1; i < cards.length; i += 1) {
      for (let j = 0; j < cards[i].length; j += 1) {
        const wordData = {
          trainClicked: 0,
          correct: 0,
          wrong: 0,
          accuracy: 0,
        };
        localStorage[`${cards[i][j].word}`] = JSON.stringify(wordData);
      }
    }
  }

  openCategoryPage() {
    const categoriesLinks = document.querySelectorAll('.categories__item');
    const mainPage = document.querySelector('.categories');
    const cardsPage = document.querySelector('.cards-list');
    const startGameBlock = document.querySelector('.start-game');
    const modeSwitch = document.querySelector('.onoffswitch-checkbox');
    const burgerMenuPageLinks = document.querySelectorAll('.nav-link');

    for (let i = 0; i < CATEGORIES_QUANTITY; i += 1) {
      categoriesLinks[i].addEventListener('click', () => {
        burgerMenuPageLinks[currentPage].classList.remove('nav-link_active');
        currentPage = i + 1;
        burgerMenuPageLinks[currentPage].classList.add('nav-link_active');
        mainPage.classList.add('hidden');
        cardsPage.classList.remove('hidden');

        if (modeSwitch.checked) {
          startGameBlock.classList.add('visible');
        }

        const currentCategoryPage = new AppView(currentPage);
        currentCategoryPage.renderCardsPage();
      });
    }
  }

  openPageFromBurgerMenuLinks() {
    const mainPage = document.querySelector('.categories');
    const cardsPage = document.querySelector('.cards-list');
    const statisticPage = document.querySelector('.statistic-page');
    const burgerMenuPageLinks = document.querySelectorAll('.nav-link');
    const startGameBlock = document.querySelector('.start-game');
    const modeSwitch = document.querySelector('.onoffswitch-checkbox');

    for (let i = 0; i < BURGER_MENU_ITEMS; i += 1) {
      burgerMenuPageLinks[i].addEventListener('click', () => {
        burgerMenuPageLinks[currentPage].classList.remove('nav-link_active');
        currentPage = i;
        burgerMenuPageLinks[currentPage].classList.add('nav-link_active');
        this.closeBurgerMenu();

        if (currentPage === MAIN_PAGE_NUMBER) {
          cardsPage.classList.add('hidden');
          mainPage.classList.remove('hidden');
          statisticPage.classList.add('hidden');
          startGameBlock.classList.remove('visible');
        } else if (currentPage === STATISTIC_PAGE_NUMBER) {
          statisticPage.classList.remove('hidden');
          mainPage.classList.add('hidden');
          cardsPage.classList.add('hidden');
          startGameBlock.classList.remove('visible');
          const currentCategoryPage = new AppView(currentPage);
          currentCategoryPage.renderStatisticPage();
        } else {
          mainPage.classList.add('hidden');
          cardsPage.classList.remove('hidden');
          statisticPage.classList.add('hidden');
          const currentCategoryPage = new AppView(currentPage);
          currentCategoryPage.renderCardsPage();

          if (modeSwitch.checked) {
            startGameBlock.classList.add('visible');
          }
        }
      });
    }
  }
}

AppView.prototype.openCategoryPage();
AppView.prototype.openPageFromBurgerMenuLinks();

if (localStorage.length !== FULL_WORDS_LIST - 1 && !localStorage.pie) {
  AppView.prototype.writeStartWordsData();
}
