
// server.js
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase, ObjectId } from './database.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:process.env.FRONTEND_URL,
		credentials:true,
	})
)

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

  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
  })
});
