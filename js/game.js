let currentWord = "";
let displayedWord = [];
let wrongGuesses = 0;
const maxWrong = 6;

let jeepPosition = 0;
const stepSize = 150;

document.addEventListener("DOMContentLoaded", () => {
  const carImage = document.getElementById("car-image");
  const wordDisplay = document.getElementById("word-display");
  const wrongCount = document.getElementById("wrong-count");
  const messageEl = document.getElementById("message");

  const endScreen = document.getElementById("end-screen");
  const endMessage = document.getElementById("end-message");
  const restartBtn = document.getElementById("end-restart");

  function loadWord() {
    fetch("data/words.json")
      .then(res => res.json())
      .then(data => {
        const random = data[Math.floor(Math.random() * data.length)];
        currentWord = random.word.toLowerCase();
        document.getElementById("hint").innerHTML = `<strong>Hint:</strong> ${random.hint}`;
        displayedWord = Array(currentWord.length).fill("_");
        updateDisplay();
        createKeyboard();
        carImage.classList.add("jeep-driving");
      });
  }

  function updateDisplay() {
    wordDisplay.textContent = displayedWord.join(" ");
    wrongCount.textContent = wrongGuesses;
  }

  function updateCarImage() {
    carImage.src = `img/car${Math.min(wrongGuesses, 6)}.png`;
  }

  function checkGameOver() {
    if (wrongGuesses >= maxWrong) {
      carImage.classList.remove("jeep-driving");
      carImage.classList.add("jeep-stopped");
      updateCarImage();
      showEndScreen(false);
    } else if (!displayedWord.includes("_")) {
      showWinScene();
      showEndScreen(true);
    }
  }

  function showWinScene() {
    carImage.src = "img/escaped.png";
    carImage.classList.remove("jeep-stopped");
    carImage.classList.add("jeep-driving");
    carImage.style.transition = "left 2s ease";
    carImage.style.left = "100%";
  }

  function showEndScreen(won) {
    if (won) {
      endMessage.textContent = "🏁 You escaped the wasteland!";
      endScreen.classList.add("active");
    } else {
      endMessage.textContent = `💥 You crashed! The word was: ${currentWord}`;
      setTimeout(() => {
        endScreen.classList.add("active");
      }, 1500);
    }
    disableAllKeys();
  }

  function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    letters.split("").forEach(letter => {
      const button = document.createElement("button");
      button.textContent = letter;
      button.classList.add("key");
      button.dataset.letter = letter.toLowerCase();
      button.addEventListener("click", handleGuess);
      keyboard.appendChild(button);
    });
  }

  function handleGuess(e) {
    const button = e.target;
    const letter = button.dataset.letter;

    if (button.disabled) return;

    button.disabled = true;
    button.classList.add("used");

    if (currentWord.includes(letter)) {
      button.classList.add("correct");
      currentWord.split("").forEach((l, i) => {
        if (l === letter) displayedWord[i] = letter;
      });

      jeepPosition += stepSize;
      carImage.style.left = `${jeepPosition}px`;
    } else {
      wrongGuesses++;
      button.classList.add("wrong");
      updateCarImage();
    }

    updateDisplay();
    checkGameOver();
  }

  function disableAllKeys() {
    document.querySelectorAll(".key").forEach(btn => btn.disabled = true);
  }

  function resetGame() {
    wrongGuesses = 0;
    jeepPosition = 0;
    displayedWord = [];
    carImage.src = "img/car0.png";
    carImage.style.left = "0";
    carImage.className = "jeep jeep-driving";
    endScreen.classList.remove("active");
    messageEl.textContent = "";
    loadWord();
  }

  restartBtn.addEventListener("click", resetGame);
  loadWord();
});
