const learnButton = document.getElementById('learn-button');
const playButton = document.getElementById('play-button');

learnButton.addEventListener('click', () => {
  window.location.href = './pages/list.html';
});

playButton.addEventListener('click', () => {
  window.location.href = './pages/game.html';
});
