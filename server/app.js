const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const blinder = require('color-blind')
const chroma = require('chroma-js')
const ColorThief = require('colorthief')
const puppeteer = require('puppeteer')

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', 3000)

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

    let problematicColors = testColors(colorList)
    res.json(problematicColors)
})

app.post('/link', async (req, res) => {
    let bParams = []
    for (let b in req.body) {
        bParams.push({"link": b, 'value': req.body[b]})
    }

    await getScreenshot(bParams[0].value)

    ColorThief.getPalette('screenshot.png', 10)
    .then(palette => { 
        let hexPalette = []
        palette.forEach(color => {
                        hexPalette.push(rgbToHex(color[0], color[1], color[2]))
                    })

        let problematicColors = testColors(hexPalette)
        res.json(problematicColors)
    })
    .catch(
        err => console.log(err)
    )
})

// Helper function to convert rgb values to hex values
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

// Puppeteer script to capture a screenshot of a webpage
const getScreenshot = async (link) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    })
    const page = await browser.newPage()

    await page.setViewport({
        width: 1280,
        height: 800
    })

    await page.goto(link)
    await page.screenshot({
        path: 'screenshot.png',
        fullPage: true
    })

    await browser.close()
}

// Returns an object with lists holdings color combinations that might
// cause issues for users with certain colorblind types. Lists are named
// after the type of colorblindness the colors conflict with
function testColors(colorList){
    // Convert the passed in list of colors to colorblind versions
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

    // Capture each possible pairing, and determine the distance of each
    // pair
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

    // Compare the differences between normal color distances and
    // colorblind distances by finding the ratio of the two
    let normalRatios = []
    let protanomalyRatios = []
    let protanopiaRatios = []
    let deuteranomalyRatios = []
    let deuteranopiaRatios = []
    let tritanomalyRatios = []
    let tritanopiaRatios = []

    for (let i = 0; i < normalDistances.length; i++){
        normalRatios.push(normalDistances[i]/normalDistances[i])
        protanomalyRatios.push(normalDistances[i]/protanomalyDistances[i])
        protanopiaRatios.push(normalDistances[i]/protanopiaDistances[i])
        deuteranomalyRatios.push(normalDistances[i]/deuteranomalyDistances[i])
        deuteranopiaRatios.push(normalDistances[i]/deuteranopiaDistances[i])
        tritanomalyRatios.push(normalDistances[i]/tritanomalyDistances[i])
        tritanopiaRatios.push(normalDistances[i]/tritanopiaDistances[i])
    }

    // Check the ratios for any pairing that might lose information for each
    // type of colorblindness
    let protanomalyIssues = checkForConflicts(protanomalyRatios)
    let protanopiaIssues = checkForConflicts(protanopiaRatios)
    let deuteranomalyIssues = checkForConflicts(deuteranomalyRatios)
    let deuteranopiaIssues = checkForConflicts(deuteranopiaRatios)
    let tritanomalyIssues = checkForConflicts(tritanomalyRatios)
    let tritanopiaIssues = checkForConflicts(tritanopiaRatios)

    // Build the return object
    let problematicColors = {
        protanomalyConflicts: [],
        protanopiaConflicts: [],
        deuteranomalyConflicts: [], 
        deuteranopiaConflicts: [],
        tritanomalyConflicts: [],
        tritanopiaConflicts: []
    }

    if (protanomalyIssues) {
        protanomalyIssues.forEach(index => {
            problematicColors.protanomalyConflicts.push(normalColorPairs[index])
        })
    }

    if (protanopiaIssues) {
        protanopiaIssues.forEach(index => {
            problematicColors.protanopiaConflicts.push(normalColorPairs[index])
        })
    }

    if (deuteranomalyIssues) {
        deuteranomalyIssues.forEach(index => {
            problematicColors.deuteranomalyConflicts.push(normalColorPairs[index])
        })
    }

    if (deuteranopiaIssues) {
        deuteranopiaIssues.forEach(index => {
            problematicColors.deuteranopiaConflicts.push(normalColorPairs[index])
        })
    }

    if (tritanomalyIssues) {
        tritanomalyIssues.forEach(index => {
            problematicColors.tritanomalyConflicts.push(normalColorPairs[index])
        })
    }

    if (tritanopiaIssues) {
        tritanopiaIssues.forEach(index => {
            problematicColors.tritanopiaConflicts.push(normalColorPairs[index])
        })
    }

    return problematicColors
}

// Returns a list of indexes for ratios that have issues
// A ratio greater than 1.9 signifies a loss of color information
// that might make it hard for a user to see the difference
// Ratio indexes correspond to color pair indexes
function checkForConflicts(ratios){
    let pairWithIssues = []
    for (let i = 0; i < ratios.length; i++){
        if (ratios[i] > 1.9) {
            pairWithIssues.push(i)
        }
    }
    return pairWithIssues
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

app.listen(process.env.PORT || app.get('port'), () => console.log(`App running at http://localhost:${app.get("port")}`))

