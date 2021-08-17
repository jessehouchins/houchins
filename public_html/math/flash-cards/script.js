(function(){
  var numbers = []
  var rangeStrings = location.search.match(/(\d|-)+/g) || []
  var activeCard
  var remainingCards = []

  rangeStrings.forEach(rs => {
    var start = rs.match(/^\d+/) || []
    var end = rs.match(/\d+$/) || []
    var startNum = parseInt(start || end, 10)
    var endNum = parseInt(end || start, 10)

    if (startNum && endNum) {
      while (startNum <= endNum) {
        numbers.push(startNum++)
      }
    }
  })

  var grid = createDiv(document.body, 'grid')
  var cardEl = createDiv(document.body, 'cardEl')
  var closeEl = createDiv(cardEl, 'closeEl', '\u2715')
  var questionEl = createDiv(cardEl, 'questionEl')
  createDiv(cardEl, 'equalsEl', ' = ')
  var answerEl = createDiv(cardEl, 'answerEl')

  numbers.forEach(n => addColumn(n, grid))
  cardEl.addEventListener('click', () => toggleCard())
  closeEl.addEventListener('click', closeCard)
  document.addEventListener('keydown', keydown)

  function addColumn(c) {
    var col = createDiv(grid, 'col col-' + c)
    for (var r = 1; r <= 12; r++) {
      addRow(c, r, col)
    }
  }

  function addRow(c, r, col) {
    var card = {
      question: c + ' x ' + r,
      answer: c * r,
      row: createDiv(col, 'row row-' + r, c + ' x ' + r)
    }
    remainingCards.push(card)
    card.row.addEventListener('click', () => {
      card.row.classList.add('active')
      toggleCard(card)
    })
  }

  function createDiv(parent, classname, text) {
    var div = document.createElement('div')
    div.setAttribute('class', classname)
    div.innerText = text || ''
    parent.appendChild(div)
    return div
  }

  function toggleCard(card) {
    if (activeCard && cardEl.classList.contains('question')) {
      showAnswer()
    } else {
      setActiveCard(card)
      if (activeCard) showQuestion()
      else hideCard()
    }
  }

  function setActiveCard(card) {
    deactivateCard()
    if (!card) card = remainingCards[Math.round(Math.random() * (remainingCards.length - 1))]
    activeCard = card
  }

  function showQuestion() {
    questionEl.innerText = activeCard.question
    answerEl.innerText = activeCard.answer
    cardEl.classList.remove('answer')
    setTimeout(() => cardEl.classList.add('question'))
  }

  function showAnswer() {
    cardEl.classList.remove('question')
    setTimeout(() => cardEl.classList.add('answer'))
    var i = remainingCards.indexOf(activeCard)
    if (i !== -1) remainingCards.splice(i, 1)
    activeCard.row.classList.add('done')
  }

  function hideCard() {
    cardEl.classList.remove('question')
    cardEl.classList.remove('answer')
    deactivateCard()
  }

  function deactivateCard() {
    if (activeCard) {
      activeCard.row.classList.remove('active')
      activeCard = undefined
    }
  }

  function closeCard(e) {
    e.stopPropagation()
    hideCard()
  }

  function keydown(e) {
    switch (e.code) {
      case 'Enter':
      case 'Space': return toggleCard()
      case 'Escape': return hideCard()
    }
  }
})()
