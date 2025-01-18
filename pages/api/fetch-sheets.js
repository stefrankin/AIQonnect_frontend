import { google } from "googleapis";

// Replace this with your private API key
const API_KEY = "AIzaSyCQff8ftx7yJij6dBg4rk37gXUWPZxSUrc";

async function fetchGoogleSheetData(spreadsheetId, range) {
	const sheets = google.sheets({ version: "v4" });

	const response = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range,
		key: API_KEY, // Include the API key in the request
	});

	return response.data.values;
}

export default async function handler(req, res) {
	const spreadsheetId = "1nWC6xB58F1WtA38ph4nEv7L5ToIhkjhxyFnmLCXv2XY"; // Replace with your spreadsheet ID
	const range = "Sheet1!A1:P18"; // Define the range to fetch

	try {
		const data = await fetchGoogleSheetData(spreadsheetId, range);
		res.status(200).json({ data });
	} catch (error) {
		res.status(500).json({ error: error });
	}
}
