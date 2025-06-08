// Transisi Loading ke Menu
window.onload = function() {
    // Logout otomatis saat browser di-refresh, atau saat pengguna tekan back/forward
window.addEventListener("pageshow", (event) => {
    const navType = performance.getEntriesByType("navigation")[0].type;
    if (event.persisted || navType === "back_forward") {
        logoutUser(); // Keluar jika user datang dari history navigation
    }
});

// Opsional: Logout juga jika halaman muncul kembali dari cache (popstate/history)
window.addEventListener("pageshow", (event) => {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        logoutUser(); // Panggil logout jika user kembali ke halaman ini
    }
});

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

    const savedMusicSetting = localStorage.getItem("musicEnabled");
    const musicToggle = document.getElementById("musicToggle");

    if (savedMusicSetting !== null) {
        musicToggle.checked = savedMusicSetting === "true";

        if (musicToggle.checked) {
            playMusic();
        } else {
            stopMusic();
        }
    }

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
    
    // Save preference to localStorage
    localStorage.setItem("musicEnabled", musicToggle.checked);

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
        showDangerAlert("Pilih hero dulu!");
        return;
    }
    stopMusic();
    const selectedHero = heroes[currentHeroIndex];
    localStorage.setItem("selectedHero", selectedHero.name);
    window.location.href = "game.html";
}


function showHighscore() {
    document.getElementById("menuScreen").style.display = "none";
    document.getElementById("characterSelection").style.display = "none";
    document.getElementById("highscoreScreen").style.display = "block";

    // Ambil username dari localStorage (pastikan saat login disimpan)
    const username = localStorage.getItem("username");
    if (!username) {
    showDangerAlert("Kamu belum login!");
    setTimeout(() => window.location.reload(), 1500); // Optional delay before reload
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
    localStorage.setItem("selectedHero", selectedHero.name);
    isHeroSelected = true;
    showSuccessAlert("You selected:", selectedHero.name);
}



function selectChoice(choice) {
    const description = document.getElementById("rpsDescription");
    switch (choice) {
        case 'rock':
            description.innerHTML = "Rock: Beats Scissors<br>Loses to Paper";
            break;
        case 'paper':
            description.innerHTML = "Paper: Beats Rock<br>Loses to Scissors";
            break;
        case 'scissors':
            description.innerHTML = "Scissors: Beats Paper<br>Loses to Rock";
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
// Called when checkbox is toggled
function toggleAnimations() {
    const animToggle = document.getElementById("animToggle");
    localStorage.setItem("animationsEnabled", animToggle.checked);
}

window.addEventListener("DOMContentLoaded", () => {
    const animToggle = document.getElementById("animToggle");
    const animationsEnabled = localStorage.getItem("animationsEnabled");

    if (animationsEnabled === "false") {
        animToggle.checked = false;
    } else {
        animToggle.checked = true;
    }
});



function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

function showDangerAlert(message) {
    const alertContainer = document.getElementById('alertContainer');

    // Create the alert element
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger custom-alert';
    alert.innerHTML = `
        <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.remove()"></button>
        ${message}
    `;

    alertContainer.appendChild(alert);

    // Automatically fade out after 3 seconds
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 300); // Remove after fade-out
    }, 3000);
}

function showSuccessAlert(message, boldText = "") {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = 'alert alert-success custom-alert';
    alert.innerHTML = `
        <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.remove()"></button>
        ${message} <strong>${boldText}</strong>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

