import express from 'express'
import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync('avis.db')
const CLE_API = process.env.CLE_API
const PLAYLIST_ID = 'UUEwyFdi6rV3iOV7Pi4u58TQ';
const app = express()
const PORT = 3000

app.get('/test', (req, res) => {
  res.json({ message: 'Le backend répond !' })
})

db.exec(`
    CREATE TABLE IF NOT EXISTS avis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL,
    note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    url TEXT NOT NULL,
    chaine_nom TEXT,
    chaine_logo TEXT,
    chaine_abonnes TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

app.listen(PORT, () => {
  console.log(`Backend démarré sur le port ${PORT}`)
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')   // 👈 autorise ton en-tête
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)   // répond direct au préflight
  }
  next()
})

app.get('/api/videos', async (req, res) => {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${PLAYLIST_ID}&key=${CLE_API}`)
  const data = await response.json()
  const video = data.items.map(item => ({
    titre: item.snippet.title,
    IdVideo: item.snippet.resourceId.videoId,
    thumbnails: item.snippet.thumbnails.medium.url,
    short: item.snippet.description.includes('#short')
  }))
  res.json(video)
})

app.get('/api/avis' , async (req, res) => {
  const avis = db.prepare('SELECT * FROM avis ORDER BY id DESC').all()
  res.json(avis)
})

app.use(express.json()) 

app.post('/api/avis', async (req, res) => {
  const { pseudo, url, note, message } = req.body

  if (!pseudo || !url || !note || !message) {
    return res.status(400).json({ erreur: 'Champs manquants' })
  }

  let nom = null, logo = null, abonnes = null

  try {
    const handle = url.split('@')[1]
    const reponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=@${handle}&key=${CLE_API}`)
    const data = await reponse.json()
    if (data.items && data.items.length > 0) {
      const chaine = data.items[0]
      nom = chaine.snippet.title
      logo = chaine.snippet.thumbnails.high.url
      abonnes = chaine.statistics.subscriberCount
    }
  } catch (e) {
    console.log('YouTube KO, on enregistre sans la chaîne:', e)
  }

  const stmt = db.prepare(
    'INSERT INTO avis (pseudo, url, note, message, chaine_nom, chaine_logo, chaine_abonnes) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  const result = stmt.run(pseudo, url, note, message, nom, logo, abonnes)
  res.status(201).json({ id: result.lastInsertRowid })
})

app.get('/api/avis/:pseudo', (req, res) => {
  if (req.query.secret !== process.env.ADMIN_SECRET) {
    return res.status(401).send('Non autorisé')
  }
  const result = db.prepare('DELETE FROM avis WHERE pseudo = ?').run(req.params.pseudo)
  console.log(result)
  res.json({ supprimes: result.changes })
})