const express = require("express")
const router = express.Router()
const fs = require("fs").promises
const path = require("path")
const location = path.join(__dirname, 'books.json')

router.get("/", async (req, res) => {
    try {
        const data = await fs.readFile(location, 'utf-8')
        const books = JSON.parse(data)
        res.status(200).json({
            status: "success",
            count: books.length,
            data: { books }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            data: 'Not Found',
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        let data = await fs.readFile(location, 'utf-8')
        data = JSON.parse(data)
        const { id } = req.params
        const book = data.filter(item => item.id === +id)[0]
        if (!book) {
            throw new Error()
        }
        res.status(200).json({
            status: "success",
            data: { book }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            data: 'Not Found'
        })
    }
})

router.post('/', async (req, res) => {
    const body = req.body
    body.id = new Date().getTime()
    try {
        let allBooks = await fs.readFile(location, 'utf-8')
        allBooks = JSON.parse(allBooks)
        allBooks.push(body)
        await fs.writeFile(location, JSON.stringify(allBooks))
        res.status(201).json({
            status: 'success',
            data: 'The book has been added'
        })
    } catch(err) {
        console.log(err.message)
        res.status(500).json({
            status: 'failed',
            data: 'Bad Request'
        })
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const body = req.body
    try {
        let index = null
        let books = await fs.readFile(location, 'utf-8')
        books = JSON.parse(books)
        let newBooks = books.map((item, i) => {
            if (item.id === +id) {
                index = i
                return body
            } else {
                return item
            }
        })
        if (index === null) {
            throw new Error()
        }
        await fs.writeFile(location, JSON.stringify(newBooks))
        res.status(200).json({
            status: 'success',
            data: {
                book: newBooks[index]
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "failed",
            data: "Not Found"
        })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    try {
        let books = await fs.readFile(location, 'utf-8')
        books = JSON.parse(books)
        let newBooks = books.filter(item => item.id !== +id)
        if (newBooks.length === books.length) {
            throw new Error()
        }
        await fs.writeFile(location, JSON.stringify(newBooks))
        res.status(204).json({
            status: 'success',
            data: 'The book has been deleted'
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            data: 'Not Found'
        })
    }
})

module.exports = router