const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const blinder = require('color-blind');
const chroma = require('chroma-js')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/app.html'))
})

app.post('/colors', (req, res) => {
    let bParams = []
    for (let b in req.body) {
        bParams.push({"color": b, 'value': req.body[b]})
    }

    let colorList = []
    bParams.forEach(color => {
        colorList.push(color.value)
    })

    testColors(colorList)
    res.json(bParams)
})

app.post('/link', (req, res) => {
    let bParams = []
    for (let b in req.body) {
        bParams.push({"color": b, 'value': req.body[b]})
    }

    console.log(bParams)
    res.json(bParams)
})

function testColors(colorList){
    let protanomalyColors = []
    let protanopiaColors = []
    let deuteranomalyColors = []
    let deuteranopiaColors = []
    let tritanomalyColors = []
    let tritanopiaColors = []

    colorList.forEach(color => {
        protanomalyColors.push(blinder.protanomaly(color))
        protanopiaColors.push(blinder.protanopia(color))
        deuteranomalyColors.push(blinder.deuteranomaly(color))
        deuteranopiaColors.push(blinder.deuteranopia(color))
        tritanomalyColors.push(blinder.tritanomaly(color))
        tritanopiaColors.push(blinder.tritanopia(color))
    })

    let normalColorPairs = pairwise(colorList)
    let normalDistances = getDistances(normalColorPairs)
    
    let protanomalyPairs = pairwise(protanomalyColors)
    let protanomalyDistances = getDistances(protanomalyPairs)

    let protanopiaPairs = pairwise(protanopiaColors)
    let protanopiaDistances = getDistances(protanopiaPairs)

    let deuteranomalyPairs = pairwise(deuteranomalyColors)
    let deuteranomalyDistances = getDistances(deuteranomalyPairs)

    let deuteranopiaPairs = pairwise(deuteranopiaColors)
    let deuteranopiaDistances = getDistances(deuteranopiaPairs)

    let tritanomalyPairs = pairwise(tritanomalyColors)
    let tritanomalyDistances = getDistances(tritanomalyPairs)

    let tritanopiaPairs = pairwise(tritanopiaColors)
    let tritanopiaDistances = getDistances(tritanopiaPairs)

    
}

// Returns a list of every pairwise combination from an input list
// Taken from https://codereview.stackexchange.com/questions/75658/pairwise-combinations-of-an-array-in-javascript
function pairwise(list) {
    if (list.length < 2) { return []; }
    var first = list[0],
        rest  = list.slice(1),
        pairs = rest.map(function (x) { return [first, x]; });
    return pairs.concat(pairwise(rest));
}

// Returns a list of the computed distance between the colors for
// each pair in the colorPairs list
function getDistances(colorPairs){
    let distances = []
    colorPairs.forEach(pair => {
        distances.push(
            (chroma.deltaE(pair[0], pair[1]) + chroma.deltaE(pair[1], pair[0])) / 2
        )
    })
    return distances
}

app.listen(port, () => console.log(`App running at http://localhost:${port}`))

