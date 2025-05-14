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
        alert('Skor kamu berhasil disimpan!');
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
document.getElementById("heroName").textContent = `Selected Hero: ${selectedHero}`;
const heroImage = document.getElementById("heroImage");
const selectedHeroData = heroes.find(hero => hero.name === selectedHero);
if (selectedHeroData) {
    heroImage.src = `assets/images/${selectedHeroData.image}`;
}
document.getElementById("heroHPValue").textContent = heroHP;
document.getElementById("opponentHPValue").textContent = opponentHP;

// Fungsi untuk memilih pilihan dalam permainan
function selectGameChoice(choice) {
    if (isGameOver) return;

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

        if (choice === aiChoice) {
            result = "Seri!";
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
        } else {
            result = "Kamu kalah!";
            playSound(loseSound);
            const damage = 10 + (level * 2);
            heroHP -= damage;
            if (heroHP < 0) heroHP = 0;
        }

        // Update health bar
        document.getElementById("heroHP").style.width = `${(heroHP / 100) * 100}%`;
        document.getElementById("opponentHP").style.width = `${(opponentHP / 100) * 100}%`;
        document.getElementById("heroHPValue").textContent = heroHP;
        document.getElementById("opponentHPValue").textContent = opponentHP;

        document.getElementById("gameResult").textContent = `Kamu memilih ${choice}, AI memilih ${aiChoice}. ${result}`;
        document.getElementById("score").textContent = `Score: ${score}`;

        // Simpan skor ke localStorage
        localStorage.setItem("gameScore", score);

        // Cek kondisi permainan
        if (heroHP <= 0) {
            alert("Game Over! Kamu kalah!");
            endGame();
        } else if (opponentHP <= 0) {
            alert("Selamat! Kamu menang ronde ini!");
            score += 50; // Bonus poin untuk kemenangan
            level += 1;
            opponentHP = 100 + (level * 10);
            document.getElementById("opponentHP").style.width = "100%";
            document.getElementById("opponentHPValue").textContent = opponentHP;
            document.getElementById("score").textContent = `Score: ${score}`;
            localStorage.setItem("gameScore", score);
        }
    }, 500);
}

function endGame() {
    if (isGameOver) return; // Prevent multiple calls
    isGameOver = true;

    stopMusic();
    localStorage.setItem("gameScore", score);

    // Kirim skor ke server
    const username = localStorage.getItem("username");
    if (username) {
        submitScore(username, score);
    }

    window.location.href = "home.html";
}



// Mulai musik battle saat halaman dimuat
window.onload = function() {
    stopMusic();
    playBattleMusic();
    score = 0;
    isGameOver = false;
    localStorage.setItem("gameScore", score);
    document.getElementById("score").textContent = `Score: ${score}`;
    console.log("Game loaded, score reset, battle music playing");
};
