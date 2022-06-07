const path = require('path');
const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const EasyPost = require('@easypost/api');

const app = express();
// configuring express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../roofstock-stessa-test-project-frontend/build')));

const easyPost = new EasyPost(process.env.EASYPOST_API_KEY);

// handle POST request
app.post("/label", async (req, res) => {
	const data = req.body
	let labelUrl = ""
	let trackingNumber = ""

	const shipment = new easyPost.Shipment(data);
	
	await shipment.save()
		.then((s) => s.buy(shipment.lowestRate())
		.then(() => {
			labelUrl = shipment.postage_label.label_url
			trackingNumber= shipment.tracking_code
		})
		.catch(console.log));

	res.end(JSON.stringify({ labelUrl, trackingNumber }));
});

// all other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../roofstock-stessa-test-project-frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});