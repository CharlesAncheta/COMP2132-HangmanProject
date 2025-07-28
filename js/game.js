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
  const carImage = document.getElementById("car-image");

  let guessedLetters = [];

  function loadWord() {
    fetch("data/words.json")
      .then(res => res.json())
      .then(data => {
        const random = data[Math.floor(Math.random() * data.length)];
        currentWord = random.word.toLowerCase();
        hintEl.innerHTML = `<strong>Hint:</strong> ${random.hint}`;
        displayedWord = Array(currentWord.length).fill("_");
        updateDisplay();
      });
  }

  function updateDisplay() {
    wordDisplay.textContent = displayedWord.join(" ");
    wrongCount.textContent = wrongGuesses;
  }

  function updateCarImage() {
    carImage.className = "jeep"; // reset class
    carImage.src = `images/car${wrongGuesses}.png`;

    if (wrongGuesses === 1 || wrongGuesses === 2) {
      carImage.classList.add("flame");
    } else if (wrongGuesses === 3 || wrongGuesses === 4) {
      carImage.classList.add("shake");
    } else if (wrongGuesses === 5) {
      carImage.classList.add("smoke");
    } else if (wrongGuesses >= maxWrong) {
      carImage.classList.add("destroyed");
      document.body.classList.add("crash");
    }
  }

  function checkGameOver() {
    if (wrongGuesses >= maxWrong) {
      messageEl.textContent = `You crashed! The word was: ${currentWord}`;
      endGame();
    } else if (!displayedWord.includes("_")) {
      showWinScene();
      endGame();
    }
  }

  function showWinScene() {
    carImage.src = "images/escaped.png";
    carImage.className = "jeep escaped";
    messageEl.textContent = "You escaped the wasteland!";
  }

  function endGame() {
    guessBtn.disabled = true;
    input.disabled = true;
    playAgainBtn.classList.remove("hidden");
  }

  function resetGame() {
    guessedLetters = [];
    wrongGuesses = 0;
    messageEl.textContent = "";
    input.disabled = false;
    guessBtn.disabled = false;
    playAgainBtn.classList.add("hidden");
    document.body.classList.remove("crash");
    carImage.className = "jeep";
    carImage.src = "images/car0.png";
    input.value = "";
    loadWord();
  }

  guessBtn.addEventListener("click", () => {
    const letter = input.value.toLowerCase();
    input.value = "";

    if (letter && /^[a-z]$/.test(letter) && !guessedLetters.includes(letter)) {
      guessedLetters.push(letter);

      if (currentWord.includes(letter)) {
        for (let i = 0; i < currentWord.length; i++) {
          if (currentWord[i] === letter) {
            displayedWord[i] = letter;
          }
        }
      } else {
        wrongGuesses++;
        updateCarImage();
      }

      updateDisplay();
      checkGameOver();
    }
  });

  playAgainBtn.addEventListener("click", resetGame);

  loadWord();
});
