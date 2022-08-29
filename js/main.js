// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import {
  getRandomColorPairs,
  hidePlayAgainButton,
  showPlayAgainButton,
  showText,
  createTimer,
} from './utils.js'
import {
  getColorListElement,
  getColorElementList,
  getTimerElement,
  getPlayAgainButton,
  getColorBackground,
  getInActiveColorList,
} from './selectors.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onchange: handleTimeChange,
  onfinish: handleTimeFinish,
})

function handleTimeChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2)
  showText(`${fullSecond}s`)
}

function handleTimeFinish() {
  showText('GAME OVER! 😭')
  showPlayAgainButton()
  gameStatus = GAME_STATUS.FINISHED
}

function handleClickLiElement(liElement) {
  const stopClickElement = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || stopClickElement || isClicked) return
  liElement.classList.add('active')

  selections.push(liElement)
  if (selections.length < 2) return
  // check Match
  const firtColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firtColor === secondColor
  if (isMatch) {
    // check win
    const changeColor = (getColorBackground().style.backgroundColor = firtColor)
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      showText('YEAH! YOU WIN! 😍')
      showPlayAgainButton()
      gameStatus = GAME_STATUS.FINISHED
      timer.clear()
    }
    selections = []
    return
  }
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    selections = []
    // race-condition check with handleTimeFinish
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 300)
}

function resetGame() {
  gameStatus = GAME_STATUS.PLAYING
  selections = []
  showText('')
  hidePlayAgainButton()
  const changeColor = (getColorBackground().style.backgroundColor = '')
  const colorElementList = getColorElementList()
  for (const item of colorElementList) {
    item.classList.remove('active')
  }
  initColor()
  startTimer()
}

function handlePlayAgainButtonClick() {
  const isClick = getPlayAgainButton()
  if (!isClick) return
  isClick.addEventListener('click', resetGame)
}

function attachEventForColorList() {
  const getUlElement = getColorListElement()
  if (!getUlElement) return
  getUlElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleClickLiElement(event.target)
  })
}

function initColor() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  const liList = getColorElementList()
  if (!liList) return
  liList.forEach((item, index) => {
    item.dataset.color = colorList[index]
    const overlayElement = item.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

function startTimer() {
  timer.start()
}

;(() => {
  initColor()
  attachEventForColorList()
  handlePlayAgainButtonClick()
  startTimer()
})()
