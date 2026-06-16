import express from 'express'

const CLE_API = process.env.CLE_API
const PLAYLIST_ID = 'UUEwyFdi6rV3iOV7Pi4u58TQ';
const app = express()
const PORT = 3000

app.get('/test', (req, res) => {
  res.json({ message: 'Le backend répond !' })
})

app.listen(PORT, () => {
  console.log(`Backend démarré sur le port ${PORT}`)
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
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