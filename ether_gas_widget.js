const widget = new ListWidget()

const gas = await fetchGasFees()

await createWidget()

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
	await widget.presentSmall()
}

widget.setPadding(10, 10, 10, 10)
widget.url = 'https://etherscan.io/'

Script.setWidget(widget)
Script.complete()

// build the content of the widget
async function createWidget() {

	let line1, line2, line3
	let icon = widget.addStack()

	const coin = await getImage('ethereum')
	const coinImg = icon.addImage(coin)
	coinImg.imageSize = new Size(30, 30)

	icon.layoutHorizontally()
	icon.addSpacer(8)

	let iconRow = icon.addStack()
	iconRow.layoutVertically()

	let iconText = iconRow.addStack()
	line1 = iconText.addText("Ethereum Gas Fee")
	line1.font = Font.mediumRoundedSystemFont(13)

	widget.addSpacer(10)

	let row = widget.addStack()
	row.layoutHorizontally()

	let gasFeesText = row.addText("Gas Fee: ")
	gasFeesText.font = Font.mediumRoundedSystemFont(18)
	
	
	let gasFeesValue = row.addText(gas.toString())
	gasFeesValue.textColor = new Color('#'+gasFeesColouring(gas.toString()))
	gasFeesValue.font = Font.regularMonospacedSystemFont(18)

	widget.addSpacer(10)
}

// Get coloring dependant on the fng value
function gasFeesColouring(indexValue) {
	let colorCode = ''
	if (indexValue >= 100) { colorCode = 'b74d34'}
	if (indexValue <  100) { colorCode = '65c64c'}

	return colorCode
}

// fetches the fng value
async function fetchGasFees() {

	let url = "https://api.etherscan.io/api?module=gastracker&action=gasoracle&&apikey=" + "YOUR_API_KEY"
	const req = new Request(url)
	const apiResult = await req.loadJSON()
	let indexValue = apiResult.result.ProposeGasPrice


	return indexValue
}

// get images from local filestore or download them once
async function getImage(image) {
	let fm = FileManager.local()
	let dir = fm.documentsDirectory()
	let path = fm.joinPath(dir, image)
	if (fm.fileExists(path)) {
		return fm.readImage(path)
	} else {
		// download once
		let imageUrl
		switch (image) {
			case 'ethereum':
				imageUrl = "/images/coin_icons/ethereum.jpg"
				break
			default:
				console.log(`Sorry, couldn't find ${image}.`);
		}
		let iconImage = await loadImage("https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/31987/eth-diamond-purple.png")
		fm.writeImage(path, iconImage)
		return iconImage
	}
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
	const req = new Request(imgUrl)
	return await req.loadImage()
}

// end of script