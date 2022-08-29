import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const colorHue = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']
  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: colorHue[i % colorHue.length],
    })
    colorList.push(color)
  }
  // double current colorList
  const fullColorList = [...colorList, ...colorList]
  // shuffle color in colorList
  shuffle(fullColorList)
  return fullColorList
}

export function showText(text) {
  const showText = getTimerElement()
  if (showText) showText.textContent = text
}

export function showPlayAgainButton() {
  const showButton = getPlayAgainButton()
  if (showButton) showButton.style.display = 'block'
}

export function hidePlayAgainButton() {
  const hideButton = getPlayAgainButton()
  if (hideButton) hideButton.style.display = ''
}

export function createTimer({ seconds, onchange, onfinish }) {
  let intervalId = null
  function start() {
    clear()
    let currentSeconds = seconds
    intervalId = setInterval(() => {
      // if (onchange) onchange(currentSeconds)
      onchange?.(currentSeconds)
      currentSeconds --
      if (currentSeconds < 0) {
        clear()
        // if (onfinish) onfinish()
        onfinish?.()
      }
    }, 1000)
  }
  function clear() {
    clearInterval(intervalId)
  }
  return {
    start,
    clear,
  }
}
