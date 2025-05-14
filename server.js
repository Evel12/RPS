const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');


const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Menangani permintaan ke root dengan mengirimkan 'index.html'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ubah jika perlu
  database: 'hha',
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Simpan ke DB (plain text)
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.send('<script>alert("Username sudah dipakai!"); window.location.href="register.html";</script>');
        }
        res.send('<script>alert("Register sukses! Silakan login."); window.location.href="login.html";</script>');
    });
});

// Route Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          res.send(`
            <script>
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('username', '${username}');
              window.location.href = '/home.html';
            </script>
          `);
      } else {
            res.send('<script>localStorage.removeItem("isLoggedIn"); alert("Username atau Password salah!"); window.location.href="login.html";</script>');
        }
    });
});





// Endpoint kirim highscore
app.post('/api/highscore', (req, res) => {
  const { username, score } = req.body;
  if (!username || score == null) return res.status(400).json({ error: 'Data tidak lengkap' });

  db.query('SELECT id FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length > 0) {
      const userId = result[0].id;

      // Check if this score is higher than existing
      db.query('SELECT MAX(score) AS highscore FROM score WHERE user_id = ?', [userId], (err, scoreResult) => {
        if (err) return res.status(500).json(err);
        const currentHigh = scoreResult[0].highscore || 0;

        if (score > currentHigh) {
          // Save new highscore
          db.query('INSERT INTO score (user_id, score) VALUES (?, ?)', [userId, score], err => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Highscore berhasil disimpan!' });
          });
        } else {
          res.json({ message: 'Skor lebih rendah dari highscore. Tidak disimpan.' });
        }
      });

    } else {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
  });
});

// Endpoint untuk ambil skor tertinggi user
app.get('/api/highscore/:username', (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT MAX(score) AS highscore 
    FROM score 
    WHERE user_id = (SELECT id FROM users WHERE username = ?)
  `;

  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({ highscore: results[0].highscore || 0 });
    } else {
      res.json({ highscore: 0 });
    }
  });
});


// Menjalankan server
app.listen(5000, () => {
  console.log('Server berjalan di http://localhost:5000');
});
