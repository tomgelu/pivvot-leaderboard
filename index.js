// nodemon -r esm index.js
import express from 'express'
import fs from 'fs'
import util from 'util'
const readFile = async path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
}

const PORT = 3000
const app = express()

const addScore = (score, name) => {
    fs.readFile('scores.json', (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        let json = JSON.parse(data)
        let currentScore = json[name]
        json[name] = score
        fs.writeFile('scores.json', JSON.stringify(json), err => {
            if (err) {
                console.log(err)
                return
            }
        })
    })
}

const getOwnPosition = async name => {
    let data = await readFile('scores.json')
    let json = JSON.parse(data)
    let ordered = Object.entries(json).sort((a, b) => {
        return a[1] > b[1]
    })
    return ordered.findIndex(el => el[0] === name)
}

const getTenFirst = async () => {
    let data = await readFile('scores.json')
    let json = JSON.parse(data)
    let ordered = Object.entries(json).sort((a, b) => {
        return a[1] > b[1]
    }).slice(0, 9).map(el => {
        return { name: el[0], score: el[1] }
    })
    return ordered
}

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.get('/add', (req, res) => {
    if (!req.query.name || !req.query.score) {
        res.sendStatus(400)
        return
    }
    addScore(req.query.score, req.query.name)
    res.sendStatus(200)
})

app.get('/getOwnPosition', async (req, res) => {
    let name = req.query.name
    let pos = await getOwnPosition(name)
    res.send(pos.toString())
})

app.get('/getTenFirst', async (req, res) => {
    let tenFirst = await getTenFirst()
    res.send(JSON.stringify(tenFirst))
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})