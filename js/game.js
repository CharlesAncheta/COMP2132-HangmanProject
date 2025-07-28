let currentWord = "";
let displayedWord = [];
let wrongGuesses = 0;
let maxWrong = 6;

document.addEventListener("DOMContentLoaded", () => {
  const hintEl = document.getElementById("hint");
  const wordDisplay = document.getElementById("word-display");
  const input = document.getElementById("guess-input");
  const guessBtn = document.getElementById("guess-button");
  const messageEl = document.getElementById("message");
  const wrongCount = document.getElementById("wrong-count");
  const playAgainBtn = document.getElementById("play-again");

  let guessedLetters = [];

  function loadWord() {
    fetch("data/words.json")
      .then(response => response.json())
      .then(data => {
        const random = data[Math.floor(Math.random() * data.length)];
        currentWord = random.word.toLowerCase();
        hintEl.textContent = `Hint: ${random.hint}`;
        displayedWord = Array(currentWord.length).fill("_");
        wordDisplay.textContent = displayedWord.join(" ");
      });
  }

  function updateDisplay() {
    wordDisplay.textContent = displayedWord.join(" ");
    wrongCount.textContent = wrongGuesses;
  }

  function checkGameOver() {
    if (wrongGuesses >= maxWrong) {
      messageEl.textContent = `You lost! The word was: ${currentWord}`;
      guessBtn.disabled = true;
      input.disabled = true;
      playAgainBtn.style.display = "inline";
    } else if (!displayedWord.includes("_")) {
      messageEl.textContent = "You won!";
      guessBtn.disabled = true;
      input.disabled = true;
      playAgainBtn.style.display = "inline";
    }
  }

  guessBtn.addEventListener("click", () => {
    const letter = input.value.toLowerCase();
    input.value = "";

    if (letter && !guessedLetters.includes(letter)) {
      guessedLetters.push(letter);

      if (currentWord.includes(letter)) {
        for (let i = 0; i < currentWord.length; i++) {
          if (currentWord[i] === letter) {
            displayedWord[i] = letter;
          }
        }
      } else {
        wrongGuesses++;
      }

      updateDisplay();
      checkGameOver();
    }
  });

  playAgainBtn.addEventListener("click", () => {
    guessedLetters = [];
    wrongGuesses = 0;
    messageEl.textContent = "";
    guessBtn.disabled = false;
    input.disabled = false;
    playAgainBtn.style.display = "none";
    loadWord();
    updateDisplay();
  });

  loadWord();
});
