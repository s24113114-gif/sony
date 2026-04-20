const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const lenses = require('./data/lens.json');


app.use((req, res, next) => {
    const now = new Date().toLocaleString();
    const log = `[${now}] ${req.method} ${req.url}\n`;
    fs.appendFileSync('access.log', log);
    console.log(`Log saved: ${req.method} ${req.url}`);
    next();
});

app.use(express.static('public'));


app.get('/product/:model.html', (req, res) => {
    const modelId = req.params.model;
    const product = lenses.find(p => p.id === modelId);

    if (product) {
        res.send(`
            <h1>${product.name}</h1>
            <img src="/images/${product.imageUrl}" alt="${product.name}" style="width:300px;">
            <br><br><a href="/">回首頁</a>
        `);
    } else {
        res.status(404).send('<h1>404 找不到型號</h1>');
    }
});


app.get('/admin', (req, res) => {
    if (req.query.code === '521') {
        res.status(200).send('<h1>Welcome to Admin (歡迎進入後台)</h1>');
    } else {
        res.status(403).send('<h1>Access Denied (暗號錯誤)</h1>');
    }
});


app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found (抱歉，路徑不存在)</h1>');
});



app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});