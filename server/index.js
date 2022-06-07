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
	const rawData = req.body
	const data = {
		from_address: {
			name: rawData.from_address.name ? rawData.from_address.name : "",
			company: rawData.from_address.company ? rawData.from_address.company : "",
			street1: rawData.from_address.street1 ? rawData.from_address.street1 : "",
			street2: rawData.from_address.street2 ? rawData.from_address.street2 : "",
			city: rawData.from_address.city ? rawData.from_address.city : "",
			state: rawData.from_address.state ? rawData.from_address.state : "",
			zip: rawData.from_address.zip ? rawData.from_address.zip : "",
			country: rawData.from_address.country ? rawData.from_address.country : "",
			phone: rawData.from_address.phone ? rawData.from_address.phone : "",
			email: rawData.from_address.email ? rawData.from_address.email : "",
		},
		to_address: {
			name: rawData.to_address.name ? rawData.to_address.name : "",
			company: rawData.to_address.company ? rawData.to_address.company : "",
			street1: rawData.to_address.street1 ? rawData.to_address.street1 : "",
			street2: rawData.to_address.street2 ? rawData.to_address.street2 : "",
			city: rawData.to_address.city ? rawData.to_address.city : "",
			state: rawData.to_address.state ? rawData.to_address.state : "",
			zip: rawData.to_address.zip ? rawData.to_address.zip : "",
			country: rawData.to_address.country ? rawData.to_address.country : "",
			phone: rawData.to_address.phone ? rawData.to_address.phone : "",
			email: rawData.to_address.email ? rawData.to_address.email : "",
		},
		parcel: {
			length: rawData.parcel.length ? Number(rawData.parcel.length) : 0.0,
			width: rawData.parcel.width ? Number(rawData.parcel.width) : 0.0,
			height: rawData.parcel.height ? Number(rawData.parcel.height) : 0.0,
			weight: rawData.parcel.weight ? Number(rawData.parcel.weight) : 0.0
		},
	}

	let labelUrl = ""
	let trackingNumber = ""

	const shipment = new easyPost.Shipment(data);
	
	await shipment.save()
		.then((s) => s.buy(shipment.lowestRate()))
		.then(() => {
			labelUrl = shipment.postage_label.label_url
			trackingNumber= shipment.tracking_code
			res.write(JSON.stringify({ labelUrl, trackingNumber }))
		})
		.catch(err => res.write(JSON.stringify({ ...err })))

	res.end();
});

// all other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../roofstock-stessa-test-project-frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});