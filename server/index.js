// import express from 'express';
// import cors from 'cors';
// import sqlite3 from 'sqlite3';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3001;
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database setup
// const dbPath = join(__dirname, 'database.sqlite');
// const db = new sqlite3.Database(dbPath);

// // Initialize database tables
// db.serialize(() => {
//   // Users table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT UNIQUE NOT NULL,
//       email TEXT UNIQUE NOT NULL,
//       password_hash TEXT NOT NULL,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `);

//   // Test results table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS test_results (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id INTEGER NOT NULL,
//       config TEXT NOT NULL,
//       wpm INTEGER NOT NULL,
//       accuracy INTEGER NOT NULL,
//       correct_chars INTEGER NOT NULL,
//       incorrect_chars INTEGER NOT NULL,
//       total_chars INTEGER NOT NULL,
//       time_spent REAL NOT NULL,
//       test_text TEXT NOT NULL,
//       completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (user_id) REFERENCES users (id)
//     )
//   `);

//   // User preferences table
//   db.run(`
//     CREATE TABLE IF NOT EXISTS user_preferences (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id INTEGER UNIQUE NOT NULL,
//       theme TEXT DEFAULT 'light',
//       font_size TEXT DEFAULT 'medium',
//       sound_effects BOOLEAN DEFAULT 0,
//       goal_wpm INTEGER DEFAULT 60,
//       FOREIGN KEY (user_id) REFERENCES users (id)
//     )
//   `);
// });

// // Authentication middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Auth routes
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Check if user already exists
//     db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
//       if (err) {
//         return res.status(500).json({ error: 'Database error' });
//       }

//       if (row) {
//         return res.status(400).json({ error: 'User already exists' });
//       }

//       // Hash password
//       const passwordHash = await bcrypt.hash(password, 10);

//       // Create user
//       db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 
//         [username, email, passwordHash], 
//         function(err) {
//           if (err) {
//             return res.status(500).json({ error: 'Failed to create user' });
//           }

//           const userId = this.lastID;

//           // Create default preferences
//           db.run('INSERT INTO user_preferences (user_id) VALUES (?)', [userId]);

//           // Generate token
//           const token = jwt.sign({ userId, username, email }, JWT_SECRET, { expiresIn: '7d' });

//           res.status(201).json({
//             token,
//             user: { id: userId, username, email }
//           });
//         }
//       );
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
//       if (err) {
//         return res.status(500).json({ error: 'Database error' });
//       }

//       if (!user) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       // Check password
//       const isValidPassword = await bcrypt.compare(password, user.password_hash);
//       if (!isValidPassword) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       // Generate token
//       const token = jwt.sign(
//         { userId: user.id, username: user.username, email: user.email }, 
//         JWT_SECRET, 
//         { expiresIn: '7d' }
//       );

//       res.json({
//         token,
//         user: { id: user.id, username: user.username, email: user.email }
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Test results routes
// app.post('/api/results', authenticateToken, (req, res) => {
//   try {
//     const { config, wpm, accuracy, correctChars, incorrectChars, totalChars, timeSpent, text } = req.body;
//     const userId = req.user.userId;

//     db.run(`
//       INSERT INTO test_results 
//       (user_id, config, wpm, accuracy, correct_chars, incorrect_chars, total_chars, time_spent, test_text) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [userId, JSON.stringify(config), wpm, accuracy, correctChars, incorrectChars, totalChars, timeSpent, text], 
//     function(err) {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to save result' });
//       }

//       res.status(201).json({ 
//         id: this.lastID,
//         message: 'Result saved successfully' 
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/results', authenticateToken, (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { limit = 50, offset = 0 } = req.query;

//     db.all(`
//       SELECT id, config, wpm, accuracy, correct_chars, incorrect_chars, 
//              total_chars, time_spent, test_text, completed_at
//       FROM test_results 
//       WHERE user_id = ? 
//       ORDER BY completed_at DESC 
//       LIMIT ? OFFSET ?
//     `, [userId, parseInt(limit), parseInt(offset)], (err, rows) => {
//       if (err) {
//         return res.status(500).json({ error: 'Database error' });
//       }

//       const results = rows.map(row => ({
//         id: row.id,
//         config: JSON.parse(row.config),
//         wpm: row.wpm,
//         accuracy: row.accuracy,
//         correctChars: row.correct_chars,
//         incorrectChars: row.incorrect_chars,
//         totalChars: row.total_chars,
//         timeSpent: row.time_spent,
//         text: row.test_text,
//         completedAt: new Date(row.completed_at)
//       }));

//       res.json(results);
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Statistics routes
// app.get('/api/stats', authenticateToken, (req, res) => {
//   try {
//     const userId = req.user.userId;

//     // Get comprehensive statistics
//     db.all(`
//       SELECT 
//         COUNT(*) as total_tests,
//         AVG(wpm) as avg_wpm,
//         MAX(wpm) as best_wpm,
//         AVG(accuracy) as avg_accuracy,
//         MAX(accuracy) as best_accuracy,
//         SUM(time_spent) as total_time,
//         AVG(CASE WHEN completed_at >= datetime('now', '-7 days') THEN 1 ELSE 0 END) * COUNT(*) as tests_this_week
//       FROM test_results 
//       WHERE user_id = ?
//     `, [userId], (err, rows) => {
//       if (err) {
//         return res.status(500).json({ error: 'Database error' });
//       }

//       const stats = rows[0] || {};
      
//       // Get recent progress (last 10 tests)
//       db.all(`
//         SELECT wpm, accuracy, completed_at
//         FROM test_results 
//         WHERE user_id = ? 
//         ORDER BY completed_at DESC 
//         LIMIT 10
//       `, [userId], (err, progressRows) => {
//         if (err) {
//           return res.status(500).json({ error: 'Database error' });
//         }

//         res.json({
//           totalTests: stats.total_tests || 0,
//           avgWpm: Math.round(stats.avg_wpm || 0),
//           bestWpm: stats.best_wpm || 0,
//           avgAccuracy: Math.round(stats.avg_accuracy || 0),
//           bestAccuracy: stats.best_accuracy || 0,
//           totalTime: Math.round((stats.total_time || 0) / 60), // in minutes
//           testsThisWeek: Math.round(stats.tests_this_week || 0),
//           recentProgress: progressRows.reverse()
//         });
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // User preferences routes
// app.get('/api/preferences', authenticateToken, (req, res) => {
//   try {
//     const userId = req.user.userId;

//     db.get('SELECT * FROM user_preferences WHERE user_id = ?', [userId], (err, row) => {
//       if (err) {
//         return res.status(500).json({ error: 'Database error' });
//       }

//       if (!row) {
//         // Create default preferences if they don't exist
//         db.run('INSERT INTO user_preferences (user_id) VALUES (?)', [userId], function(err) {
//           if (err) {
//             return res.status(500).json({ error: 'Failed to create preferences' });
//           }
          
//           res.json({
//             theme: 'light',
//             fontSize: 'medium',
//             soundEffects: false,
//             goalWpm: 60
//           });
//         });
//       } else {
//         res.json({
//           theme: row.theme,
//           fontSize: row.font_size,
//           soundEffects: Boolean(row.sound_effects),
//           goalWpm: row.goal_wpm
//         });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.put('/api/preferences', authenticateToken, (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { theme, fontSize, soundEffects, goalWpm } = req.body;

//     db.run(`
//       UPDATE user_preferences 
//       SET theme = ?, font_size = ?, sound_effects = ?, goal_wpm = ?
//       WHERE user_id = ?
//     `, [theme, fontSize, soundEffects ? 1 : 0, goalWpm, userId], function(err) {
//       if (err) {
//         return res.status(500).json({ error: 'Failed to update preferences' });
//       }

//       res.json({ message: 'Preferences updated successfully' });
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Graceful shutdown
// process.on('SIGINT', () => {
//   console.log('Shutting down server...');
//   db.close((err) => {
//     if (err) {
//       console.error('Error closing database:', err);
//     } else {
//       console.log('Database connection closed.');
//     }
//     process.exit(0);
//   });
// });


// server.js
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase, ObjectId } from './database.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

let db;

connectToDatabase().then(collections => {
  db = collections;

  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const existingUser = await db.users.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.users.insertOne({ username, email, passwordHash, createdAt: new Date() });
    await db.preferences.insertOne({ userId: user.insertedId, theme: 'light', fontSize: 'medium', soundEffects: false, goalWpm: 60 });

    const token = jwt.sign({ userId: user.insertedId, username, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.insertedId, username, email } });
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  });

  // Middleware to protect routes
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // Save result
  app.post('/api/results', authenticateToken, async (req, res) => {
    const { config, wpm, accuracy, correctChars, incorrectChars, totalChars, timeSpent, text } = req.body;
    const result = await db.testResults.insertOne({
      userId: new ObjectId(req.user.userId),
      config,
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      timeSpent,
      testText: text,
      completedAt: new Date(),
    });
    res.status(201).json({ id: result.insertedId, message: 'Result saved successfully' });
  });

  // Get results
  app.get('/api/results', authenticateToken, async (req, res) => {
    const userId = new ObjectId(req.user.userId);
    const limit = parseInt(req.query.limit || 50);
    const offset = parseInt(req.query.offset || 0);

    const results = await db.testResults
      .find({ userId })
      .sort({ completedAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    res.json(results.map(r => ({
      id: r._id,
      config: r.config,
      wpm: r.wpm,
      accuracy: r.accuracy,
      correctChars: r.correctChars,
      incorrectChars: r.incorrectChars,
      totalChars: r.totalChars,
      timeSpent: r.timeSpent,
      text: r.testText,
      completedAt: r.completedAt,
    })));
  });

  // Get statistics
  app.get('/api/stats', authenticateToken, async (req, res) => {
    const userId = new ObjectId(req.user.userId);

    const aggStats = await db.testResults.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgWpm: { $avg: '$wpm' },
          bestWpm: { $max: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          bestAccuracy: { $max: '$accuracy' },
          totalTime: { $sum: '$timeSpent' },
        }
      }
    ]).toArray();

    const progress = await db.testResults.find({ userId }).sort({ completedAt: -1 }).limit(10).toArray();

    const stats = aggStats[0] || {};
    res.json({
      totalTests: stats.totalTests || 0,
      avgWpm: Math.round(stats.avgWpm || 0),
      bestWpm: stats.bestWpm || 0,
      avgAccuracy: Math.round(stats.avgAccuracy || 0),
      bestAccuracy: stats.bestAccuracy || 0,
      totalTime: Math.round((stats.totalTime || 0) / 60),
      recentProgress: progress.reverse().map(r => ({
        wpm: r.wpm,
        accuracy: r.accuracy,
        completedAt: r.completedAt
      }))
    });
  });

  // User preferences
  app.get('/api/preferences', authenticateToken, async (req, res) => {
    const userId = new ObjectId(req.user.userId);
    let prefs = await db.preferences.findOne({ userId });
    if (!prefs) {
      await db.preferences.insertOne({ userId, theme: 'light', fontSize: 'medium', soundEffects: false, goalWpm: 60 });
      prefs = await db.preferences.findOne({ userId });
    }
    res.json({
      theme: prefs.theme,
      fontSize: prefs.fontSize,
      soundEffects: prefs.soundEffects,
      goalWpm: prefs.goalWpm
    });
  });

  app.put('/api/preferences', authenticateToken, async (req, res) => {
    const userId = new ObjectId(req.user.userId);
    const { theme, fontSize, soundEffects, goalWpm } = req.body;
    await db.preferences.updateOne(
      { userId },
      { $set: { theme, fontSize, soundEffects, goalWpm } },
      { upsert: true }
    );
    res.json({ message: 'Preferences updated successfully' });
  });

  app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

  app.listen(PORT, () => console.log(`MongoDB-based server running on port ${PORT}`));
});
