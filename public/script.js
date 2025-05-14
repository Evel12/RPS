// Transisi Loading ke Menu
window.onload = function() {
    const loadingScreen = document.getElementById("loading-screen");
    const menuScreen = document.getElementById("menuScreen");
    const rpsDisplay = document.getElementById("rpsDisplay");
    const characterSelection = document.getElementById("characterSelection");
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.volume = 0.5;
    
    // Tampilkan skor terakhir di highscore screen
    const yourScore = document.getElementById("yourScore");
    const savedScore = localStorage.getItem("gameScore");
    if (savedScore) yourScore.textContent = savedScore;

    // Mulai musik otomatis
    playMusic();

    setTimeout(() => {
        loadingScreen.classList.add("hidden");
        menuScreen.classList.add("visible");
        rpsDisplay.classList.add("visible");
        characterSelection.classList.add("visible");
    }, 3000);
};


// Ambil elemen audio
const bgMusic = document.getElementById("bgMusic");

// Variabel untuk melacak apakah hero sudah dipilih
let isHeroSelected = false;

// Fungsi untuk memulai musik
function playMusic() {
    if (bgMusic.paused && document.getElementById("musicToggle").checked) {
        console.log("Mencoba memutar musik menu..."); // Debug
        bgMusic.play().catch(error => {
            console.log("Auto-play diblokir oleh browser:", error);
            // Jika auto-play diblokir, coba putar lagi setelah interaksi pengguna
            document.body.addEventListener("click", () => {
                if (bgMusic.paused && document.getElementById("musicToggle").checked) {
                    console.log("Memutar musik setelah interaksi pengguna...");
                    bgMusic.play().catch(err => console.log("Gagal memutar setelah klik:", err));
                }
            }, { once: true });
        });
    }
}

// Fungsi untuk menghentikan musik
function stopMusic() {
    console.log("Menghentikan musik menu...");
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

// Fungsi untuk mengatur musik (hidup/mati)
function toggleMusic() {
    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle.checked) {
        console.log("Musik dihidupkan melalui toggle...");
        playMusic();
    } else {
        console.log("Musik dimatikan melalui toggle...");
        stopMusic();
    }
}

// Fungsi tombol menu
function startGame() {
    if (!isHeroSelected) {
        alert("Silakan pilih hero terlebih dahulu dengan menekan tombol Select!");
        return;
    }
    stopMusic();
    const selectedHero = heroes[currentHeroIndex];
    localStorage.setItem("selectedHero", selectedHero.name);
    window.location.href = "game.html";
}

function showHighscore() {
    stopMusic();
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("characterSelection").style.display = "none";
    document.getElementById("highscoreScreen").style.display = "block";

    // Ambil username dari localStorage (pastikan saat login disimpan)
    const username = localStorage.getItem("username");
    if (!username) {
        alert("Kamu belum login!");
        return;
    }

    // Fetch skor tertinggi dari server
    fetch(`http://localhost:5000/api/highscore/${username}`)
      .then(res => res.json())
      .then(data => {
          console.log("Skor tertinggi:", data);
          document.getElementById("yourScore").textContent = data.highscore;
      })
      .catch(err => {
          console.error("Gagal ambil highscore:", err);
          alert("Gagal ambil skor tertinggi.");
      });
}


function openOptions() {
    stopMusic();
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("characterSelection").style.display = "none";
    document.getElementById("optionsScreen").style.display = "block";
}

function exitGame() {
    stopMusic();
    window.location.href = "login.html";
}

function backToMenu() {
    document.getElementById("characterSelection").style.display = "block";
    document.getElementById("highscoreScreen").style.display = "none";
    document.getElementById("optionsScreen").style.display = "none";
    document.getElementById("menuScreen").style.display = "block";
    document.getElementById("rpsDisplay").style.display = "block";
    document.getElementById("rpsDisplay").classList.add("visible");
    playMusic();
}

// Daftar Hero dengan Gambar (4 Karakter)
const heroes = [
    { name: "Grok", image: "grok.png" },
    { name: "Mud", image: "mud.png" },
    { name: "Royco", image: "royco.png" },
    { name: "Budd", image: "budd.png" }
];
let currentHeroIndex = 0;

// Fungsi untuk mengganti hero
function prevHero() {
    currentHeroIndex = (currentHeroIndex - 1 + heroes.length) % heroes.length;
    updateCharacterDisplay();
}

function nextHero() {
    currentHeroIndex = (currentHeroIndex + 1) % heroes.length;
    updateCharacterDisplay();
}

function updateCharacterDisplay() {
    const hero = heroes[currentHeroIndex];
    document.getElementById("heroName").textContent = hero.name;
    document.getElementById("characterImage").src = `assets/images/${hero.image}?v=${new Date().getTime()}`;
}


function selectHero() {
    const selectedHero = heroes[currentHeroIndex];
    alert("You selected: " + selectedHero.name);
    localStorage.setItem("selectedHero", selectedHero.name);
    isHeroSelected = true;
}

function selectChoice(choice) {
    const description = document.getElementById("rpsDescription");
    switch (choice) {
        case 'rock':
            description.textContent = "Rock: Beats Scissors, loses to Paper. A solid choice for a strong defense!";
            break;
        case 'paper':
            description.textContent = "Paper: Beats Rock, loses to Scissors. Perfect for a clever strategy!";
            break;
        case 'scissors':
            description.textContent = "Scissors: Beats Paper, loses to Rock. Quick and decisive attack!";
            break;
    }
}

// Fungsi untuk animasi lompat saat klik (Hero)
function jumpAnimation() {
    const heroImage = document.getElementById("characterImage");
    heroImage.classList.add("jump-animation");
    setTimeout(() => {
        heroImage.classList.remove("jump-animation");
    }, 500);
}

// Fungsi untuk animasi goyang saat klik (RPS)
function shakeAnimation(element) {
    element.classList.add("shake-animation");
    setTimeout(() => {
        element.classList.remove("shake-animation");
    }, 300);
}

// Fungsi untuk menampilkan info saat ikon info diklik
function showInfo() {
    alert("Total Wins: 5\nTips: Pilih strategi berdasarkan lawan!");
}

// Fungsi untuk mengatur animasi (hidup/mati)
function toggleAnimations() {
    const animToggle = document.getElementById("animToggle");
    const elements = document.querySelectorAll(".hero-image, .rps-image");
    if (animToggle.checked) {
        elements.forEach(el => el.style.transition = "transform 0.3s ease");
    } else {
        elements.forEach(el => el.style.transition = "none");
    }
}