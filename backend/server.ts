import express from 'express'
import { createClient } from '@libsql/client'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const CLE_API = process.env.CLE_API
const PLAYLIST_ID = 'UUEwyFdi6rV3iOV7Pi4u58TQ';
const app = express()

app.get('/test', (req, res) => {
  res.json({ message: 'Le backend répond !' })
})

await db.execute(`
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
  const videos = []
  let pageToken = ''

  do {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${CLE_API}&pageToken=${pageToken}`)
    const data = await response.json()
    videos.push(...data.items.map((item: any) => ({
      titre: item.snippet.title,
      IdVideo: item.snippet.resourceId.videoId,
      thumbnails: item.snippet.thumbnails.medium.url,
      short: item.snippet.description.includes('#short'),
      description: item.snippet.description
    })))
    pageToken = data.nextPageToken ?? ''
  } while (pageToken)

  res.json(videos)
})

app.get('/api/avis' , async (req, res) => {
  const result = await db.execute('SELECT * FROM avis ORDER BY id DESC')
  res.json(result.rows)
})

app.use(express.json()) 

app.post('/api/avis', async (req, res) => {
  const { pseudo, url, note, message } = req.body

  if (!pseudo || !url || !note || !message) {
    return res.status(400).json({ erreur: 'Champs manquants' })
  }

  let nom = null, logo = null, abonnes = null

  try {
    const parsedUrl = new URL(url)
    const handle = parsedUrl.pathname.match(/@([^/]+)/)?.[1]
    if (!handle) {
      throw new Error('Handle YouTube introuvable dans l\'URL')
    }

    const reponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=%40${encodeURIComponent(handle)}&key=${CLE_API}`
    )
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

  const result = await db.execute({
    sql: 'INSERT INTO avis (pseudo, url, note, message, chaine_nom, chaine_logo, chaine_abonnes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [pseudo, url, note, message, nom, logo, abonnes],
  })
  res.status(201).json({ id: String(result.lastInsertRowid) })
})

app.get('/api/avis/:pseudo', async (req, res) => {
  if (req.query.secret !== process.env.ADMIN_SECRET) {
    return res.status(401).send('Non autorisé')
  }
  const result = await db.execute({
    sql: 'DELETE FROM avis WHERE pseudo = ?',
    args: [req.params.pseudo],
  })
  res.json({ supprimes: result.rowsAffected })
})

export default app