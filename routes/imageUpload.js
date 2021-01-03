const express = require('express')
const app = express()

app.get('/uploadImage', (req, res) => res.download("./public/uploads/keshavauser.jpg"))
app.listen(3000, () => console.log('Server ready'))

res.download("./public/uploads/keshavauser.jpg", 'user-facing-filename.pdf')

res.download("./public/uploads/keshavauser.jpg", 'user-facing-filename.pdf', (err) => {

});