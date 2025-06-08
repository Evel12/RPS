
// Ambil elemen audio
const bgMusic = document.getElementById("bgMusic");
const battleMusic = document.getElementById("battleMusic");
const attackSound = document.getElementById("attackSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

// Fungsi untuk memutar musik dan efek suara
function playMusic() {
    if (bgMusic.paused) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(error => {
            console.log("Musik gagal diputar:", error);
            document.body.addEventListener("click", playMusic, { once: true });
        });
    }
}

function playBattleMusic() {
    if (battleMusic.paused) {
        battleMusic.volume = 0.5;
        battleMusic.play().catch(error => {
            console.log("Musik battle gagal diputar:", error);
            document.body.addEventListener("click", playBattleMusic, { once: true });
        });
    }
}

function playSound(sound) {
    sound.currentTime = 0; // Reset ke awal
    sound.volume = 0.7; // Sesuaikan volume efek suara
    sound.play().catch(error => {
        console.log("Efek suara gagal diputar:", error);
    });
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    battleMusic.pause();
    battleMusic.currentTime = 0;
}

function submitScore(username, score) {
    fetch('http://localhost:5000/api/highscore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Skor dikirim:', data);
      })
      .catch(err => console.error('Gagal kirim skor:', err));
  }
  
  

// Variabel global
let isGameOver = false;
let score = 0; 
localStorage.setItem("gameScore", score);
let selectedHero = localStorage.getItem("selectedHero") || "Grok";
let heroHP = 100;
let opponentHP = 100;
let level = 1;
const heroes = [
    { name: "Grok", image: "grok.png" },
    { name: "Mud", image: "mud.png" },
    { name: "Royco", image: "royco.png" },
    { name: "Budd", image: "budd.png" }
];

// Tampilkan hero yang dipilih
document.getElementById("heroName").textContent = `${selectedHero}`;
const heroImage = document.getElementById("heroImage");
const selectedHeroData = heroes.find(hero => hero.name === selectedHero);
if (selectedHeroData) {
    heroImage.src = `assets/images/${selectedHeroData.image}`;
}
document.getElementById("heroHPValue").textContent = heroHP;
document.getElementById("opponentHPValue").textContent = opponentHP;

// Fungsi untuk memilih pilihan dalam permainan
let canPlay = true;
function selectGameChoice(choice) {
    if (!canPlay || isGameOver) return;
    canPlay = false;

    console.log("Pilihan dipilih:", choice);
    const choices = ['rock', 'paper', 'scissors'];
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    let result = '';

    // Animasi serangan
    const heroImage = document.getElementById("heroImage");
    const opponentImage = document.getElementById("opponentImage");

    heroImage.classList.add("attack");
    opponentImage.classList.add("defend");

    setTimeout(() => {
        heroImage.classList.remove("attack");
        opponentImage.classList.remove("defend");

        // Tampilkan pilihan gambar
        const playerChoiceImage = document.getElementById("playerChoiceImage");
        const aiChoiceImage = document.getElementById("aiChoiceImage");

        playerChoiceImage.src = `assets/images/${choice}.png`;
        aiChoiceImage.src = `assets/images/${aiChoice}2.png`;
        playerChoiceImage.style.display = 'block';
        aiChoiceImage.style.display = 'block';

        // Reset animation before applying new one
resetAnimation(playerChoiceImage);
resetAnimation(aiChoiceImage);

if (choice === aiChoice) {
    result = "Seri!";
    playerChoiceImage.classList.add('draw');
    aiChoiceImage.classList.add('draw');
} else if (
    (choice === 'rock' && aiChoice === 'scissors') ||
    (choice === 'paper' && aiChoice === 'rock') ||
    (choice === 'scissors' && aiChoice === 'paper')
) {
    result = "Kamu menang!";
    playSound(winSound);
    const damage = 10 + (level * 2);
    opponentHP -= damage;
    if (opponentHP < 0) opponentHP = 0;
    score += damage;
    opponentImage.classList.add("fall");
    setTimeout(() => opponentImage.classList.remove("fall"), 500);
    playerChoiceImage.classList.add('win');
    aiChoiceImage.classList.add('lose');

} else {
    result = "Kamu kalah!";
    playSound(loseSound);
    const damage = 10 + (level * 2);
    heroHP -= damage;
    if (heroHP < 0) heroHP = 0;
    playerChoiceImage.classList.add('lose');
    aiChoiceImage.classList.add('win');
}


const heroMaxHP = 100;
const opponentMaxHP = 100 + (level * 10);

if (result === "Kamu menang!") {
    updateHPBar("opponentHP", opponentHP, opponentMaxHP);
} else if (result === "Kamu kalah!") {
    updateHPBar("heroHP", heroHP, heroMaxHP);
}




        document.getElementById("heroHPValue").textContent = heroHP;
        document.getElementById("opponentHPValue").textContent = opponentHP;

        document.getElementById("score").textContent = `Score: ${score}`;
        document.getElementById("gameResult").textContent = `Kamu memilih ${choice}, AI memilih ${aiChoice}. ${result}`;
        
        // Simpan skor ke localStorage
        localStorage.setItem("gameScore", score);

function showNotification(message) {
    // Remove any existing alerts to avoid stacking
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create a Bootstrap success alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show custom-alert';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>Next Enemy!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Append to body
    document.body.appendChild(alertDiv);

    // Auto-dismiss after 3 seconds with fade-out animation
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('fade-out'); // Add fade-out animation
            setTimeout(() => alertDiv.remove(), 300); // Match animation duration
        }
    }, 3000);

    // Ensure manual close also triggers fade-out
    alertDiv.querySelector('.btn-close').addEventListener('click', () => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('fade-out');
        setTimeout(() => alertDiv.remove(), 300);
    });
}
        // Cek kondisi permainan
        if (heroHP <= 0) {
            defeated();
        } else if (opponentHP <= 0) {
            showNotification("");
            score += 50;
            level += 1;
            opponentHP = 100 + (level * 10);
            updateHPBar("opponentHP", opponentHP, opponentHP);
            document.getElementById("opponentHPValue").textContent = opponentHP;
            document.getElementById("score").textContent = `Score: ${score}`;
            localStorage.setItem("gameScore", score);
        }

        // Sembunyikan gambar pilihan setelah animasi selesai (opsional, sesuaikan durasi)
        setTimeout(() => {
        playerChoiceImage.style.animation = "none";
        aiChoiceImage.style.animation = "none";
        playerChoiceImage.classList.remove('win', 'lose', 'draw');
        aiChoiceImage.classList.remove('win', 'lose', 'draw');

        playerChoiceImage.style.display = 'none';
        aiChoiceImage.style.display = 'none';

            canPlay = true;
        }, 500);
        
    }, 300);
}

function defeated() {
    if (isGameOver) return;
    isGameOver = true;

    stopMusic();
    localStorage.setItem("gameScore", score);

    // Kirim skor ke server
    const username = localStorage.getItem("username");
    if (username) {
        submitScore(username, score);
    }
    document.getElementById("finalScore").textContent = `Your Score: ${score} points`;
    document.getElementById("defeatModal").style.display = "flex";
}

function endGame() {
    window.location.href = "home.html";    
}



// Mulai musik battle saat halaman dimuat
window.onload = function () {
    stopMusic(); // Always stop music first

    // Read settings
    const musicEnabled = localStorage.getItem("musicEnabled") === "true";
    const animationsEnabled = localStorage.getItem("animationsEnabled") !== "false";

    // 🔁 Correctly apply sound/music settings
    if (musicEnabled) {
        playBattleMusic();
    }

    if (!animationsEnabled) {
        document.body.classList.add("no-animations");
    } else {
        document.body.classList.remove("no-animations");
    }

    // Initialize game state
    score = 0;
    isGameOver = false;
    localStorage.setItem("gameScore", score);
    document.getElementById("score").textContent = `Score: ${score}`;
};


// Fungsi untuk memperbarui HP bar dan warnanya
function updateHPBar(hpElementId, currentHP, maxHP) {
    let normalizedMaxHP = 100; // Force normalization
    const hpPercentage = (currentHP / normalizedMaxHP) * 100;
    const healthBar = document.getElementById(hpElementId);
    const hpValueElement = document.getElementById(hpElementId.replace('HP', 'HPValue')); 
    healthBar.style.width = hpPercentage + '%';

    let color;
    if (hpPercentage >= 75) {
        color = '#15EA20'; 
    } else if (hpPercentage >= 50) {
        color = '#EFE70F'; 
    } else if (hpPercentage >= 25) {
        color = '#EF7F1A'; 
    } else {
        color = '#EF1313'; 
    }

    healthBar.style.background = color;
    hpValueElement.style.color = color;
}


function resetAnimation(el) {
    el.style.animation = 'none';
    el.offsetHeight; // Force reflow
    el.style.animation = '';
}

function retryGame() {
  window.location.reload();
}

