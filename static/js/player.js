// Получаем элементы управления
const playPauseBtn = document.getElementById("playPauseBtn");
const volumeBtn = document.getElementById("volumeBtn");
const volumeRange = document.getElementById("volumeRange");
const progress = document.getElementById("progress");
const currentTimeElem = document.getElementById("current-time");
const durationElem = document.getElementById("duration");
const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const authorName = document.getElementById("author-name");
const albumCover = document.getElementById("album-cover");
const albumArt = document.getElementById("album-art");

// Новые кнопки
const repeatBtn = document.getElementById("repeatBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// Флаги для цикличности, перемешивания и громкости
let isRepeat = false;
let isShuffle = false;

// Список песен
const songs = [
  "shining_stars",
  "neon_waves",
  "breaking_chains",
  "midnight_hustle",
  "electric_pulse",
  "skyline_rush",
  "ocean_vibes",
  "night_pulse"
];
let currentSongIndex = Math.floor(Math.random() * songs.length); // Случайная первая песня

// Элемент для сообщения
const startMessage = document.createElement("p");
startMessage.id = "start-message";
startMessage.className = "text-center text-slate-400 dark:text-slate-600 mb-8";
startMessage.textContent = "Нажмите кнопку воспроизведения, чтобы начать";

// Находим блок с id="information" и добавляем туда текстовое сообщение
const infoBlock = document.getElementById("information");
if (infoBlock) {
  infoBlock.appendChild(startMessage);
} else {
  console.error('Блок с id="information" не найден');
}

// Функция для получения информации о песне из файла
async function loadSongInfo(songPath) {
  try {
    const response = await fetch(`/music/${songPath}/info.txt`);
    const data = await response.text();
    const [title, author] = data.split("\n");

    if (title && author) {
      songTitle.textContent = title.trim();
      authorName.textContent = author.trim();
    } else {
      console.error("Ошибка: Файл info.txt имеет неверный формат.");
    }

    // Загружаем изображение и музыку
    albumCover.src = `/music/${songPath}/icon.jpg`;
    albumArt.src = `/music/${songPath}/icon.jpg`;
    audio.src = `/music/${songPath}/music.wav`;

    // Подключаем обработчики для аудио
    audio.addEventListener("loadedmetadata", () => {
      durationElem.textContent = formatTime(audio.duration);
      progress.max = audio.duration; // Устанавливаем max равным длине песни
      progress.value = 0; // Сбрасываем таймлайн
    });

    // Убираем автозапуск
    audio.addEventListener("canplaythrough", () => {
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      isPlaying = false; // Не воспроизводим автоматически
    });
  } catch (error) {
    console.error("Ошибка загрузки информации о песне:", error);
  }
}

// Форматирование времени (минуты:секунды)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

// Управление воспроизведением
let isPlaying = false;
playPauseBtn.addEventListener("click", () => {
  startMessage.style.display = "none"; // Скрываем сообщение при нажатии
  if (isPlaying) {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
  isPlaying = !isPlaying;
});

// Обновление времени и прогресса
audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime;
  currentTimeElem.textContent = formatTime(audio.currentTime);
});

// Управление громкостью
let isVolumeVisible = false;
volumeBtn.addEventListener("click", () => {
  isVolumeVisible = !isVolumeVisible;
  volumeRange.classList.toggle("hidden", !isVolumeVisible);
});

volumeRange.addEventListener("input", () => {
  audio.volume = volumeRange.value / 100;
});

// Перемотка по ползунку прогресса
progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

// Управление цикличностью
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("bg-green-500", isRepeat); // Меняем фон кнопки
  audio.loop = isRepeat; // Включаем или выключаем цикл
});

// Управление перемешиванием
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("bg-green-500", isShuffle); // Меняем фон кнопки
});

// Кнопки "Следующая" и "Предыдущая"
nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSongInfo(songs[currentSongIndex]);
});

prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSongInfo(songs[currentSongIndex]);
});

// Обработка окончания песни
audio.addEventListener("ended", () => {
  if (!isRepeat) {
    nextBtn.click();
  }
});

// Функция для смены темы
const themeToggleBtn = document.getElementById("theme-toggle");

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme");
  
  if (currentTheme === "dark") {
    document.documentElement.classList.remove("dark"); // Убираем класс 'dark' у <html>
    localStorage.setItem("theme", "light");
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    document.documentElement.classList.add("dark"); // Добавляем класс 'dark' у <html>
    localStorage.setItem("theme", "dark");
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

// Инициализация темы
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark"); // Применяем тему по умолчанию (если сохранено как 'dark')
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
});

// Привязка события к кнопке
themeToggleBtn.addEventListener("click", toggleTheme);


// Инициализация плеера с первой песней
loadSongInfo(songs[currentSongIndex]);
