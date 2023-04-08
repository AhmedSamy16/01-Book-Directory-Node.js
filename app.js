const express = require("express")
const books = require("./books")
const PORT = 3000

const app = express()

app.use(express.json())
app.use('/api/v1/books', books)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})