/*
 * Create a list that holds all of your cards
 */
const cardSingleValues = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb'
];
const CardValues = [...cardSingleValues, ...cardSingleValues];
const initStarsHtml = document.getElementsByClassName('stars')[0].innerHTML;
let timeInterval = '';
let moveCount = 0;
let scoreCount = 0; //won when score reaches 8
let starCount = 3;
let matchingCardCount = 0;
let firstCardClass = '';
let firstCardId = '';

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = array => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const removeOpenClass = (id1, id2) => {
  document.getElementById(id1).classList.remove('open');
  document.getElementById(id2).classList.remove('open');
};

const addWrongCardColor = (id1, id2) => {
  document.getElementById(id1).classList.add('wrong');
  document.getElementById(id2).classList.add('wrong');
};

const removeWrongCardColor = (id1, id2) => {
  document.getElementById(id1).classList.remove('wrong');
  document.getElementById(id2).classList.remove('wrong');
};

const reduceStar = starIndex => {
  const starList = document.getElementsByClassName('stars')[0].children;
  starList[starIndex].children[0].classList.remove('fa-star');
  starList[starIndex].children[0].classList.add('fa-star-o');
};

const resetStar = () => {
  document.getElementsByClassName('stars')[0].innerHTML = initStarsHtml;
};

const updateTimePassed = startTime => {
  const now = new Date();
  const secPassed = Math.floor((now - startTime) / 1000);
  const min = Math.floor(secPassed / 60);
  const sec = secPassed % 60 < 10 ? '0' + (secPassed % 60) : secPassed % 60;
  document.getElementById('timer').innerText = min + ':' + sec;
};

const timerStart = () => {
  const startTime = new Date();
  return setInterval(updateTimePassed, 1000, startTime);
};

const cardClicked = e => {
  if (e.target.nodeName === 'LI') {
    if (moveCount === 0) {
      timeInterval = timerStart();
    }
    moveCount++;
    document.getElementById('moves').innerText = moveCount;
    if (moveCount === 20 || moveCount === 30) {
      starCount--;
      reduceStar(starCount);
    }

    const cardId = e.target.id;
    const cardElement = document.getElementById(cardId);

    // if the card is unclicked && matching card count is 0 or 1 --> open
    if (
      !cardElement.classList.contains('match') &&
      !cardElement.classList.contains('open') &&
      matchingCardCount < 2
    ) {
      matchingCardCount++;
      cardElement.classList.add('open');

      //if it is the first card, store in firstCardClass
      if (matchingCardCount === 1) {
        firstCardClass = cardElement.childNodes[0].classList[1];
        firstCardId = cardId;
      }

      //if it is the second card, check match and restore matchingCardCount to 0
      if (matchingCardCount === 2) {
        if (firstCardClass === cardElement.childNodes[0].classList[1]) {
          //if match
          removeOpenClass(cardId, firstCardId);
          cardElement.classList.add('match');
          document.getElementById(firstCardId).classList.add('match');
          scoreCount++;
          if (scoreCount === 8) {
            document.getElementById(
              'time-used'
            ).innerText = document.getElementById('timer').innerText;
            document.getElementById('star-rating').innerText = starCount;
            document.getElementsByClassName('modal')[0].classList.add('active');
          }
        } else {
          //not match
          addWrongCardColor(firstCardId, cardId);
          setTimeout(removeWrongCardColor, 1000, firstCardId, cardId);
          setTimeout(removeOpenClass, 1000, firstCardId, cardId);
        }

        matchingCardCount = 0;
        firstCardClass = '';
        firstCardId = '';
      }
    }
  }
};

const initNewGame = () => {
  const shuffledCards = shuffle(CardValues);
  console.log(shuffledCards);
  let shuffledHTMLCards = '';
  let cardNum = 0;
  shuffledCards.map(cardValue => {
    shuffledHTMLCards +=
      '<li class="card" id="' +
      cardNum +
      '"><i class="fa ' +
      cardValue +
      '"></i></li>';
    cardNum++;
  });
  const deckElement = document.getElementsByClassName('deck')[0];
  deckElement.innerHTML = shuffledHTMLCards;
  deckElement.addEventListener('click', cardClicked);
  moveCount = 0;
  starCount = 3;

  resetStar();
  clearInterval(timeInterval);
  document.getElementById('timer').innerText = '0:00';
  document.getElementById('moves').innerText = moveCount;
};

const playAgain = () => {
  initNewGame();
  document.getElementsByClassName('modal')[0].classList.remove('active');
};

initNewGame();

// Restart button
document
  .getElementsByClassName('restart')[0]
  .addEventListener('click', () => initNewGame());

//play again button
document
  .getElementById('play-again')
  .addEventListener('click', () => playAgain());

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
