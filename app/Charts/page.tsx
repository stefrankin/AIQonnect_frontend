"use client";
import React, { useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { google } from "googleapis"; // Use Google Sheets API if needed.

const Charts = () => {
	const [result, setResult] = useState(null);
	const chartRef = useRef(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formData, setFormData] = useState({});

	const handleInputChange = (e) => {
		const { name, value, type, multiple, options } = e.target;
		if (type === "select-multiple") {
			const selectedValues = Array.from(options)
				.filter((option) => option.selected)
				.map((option) => option.value);
			setFormData({ ...formData, [name]: selectedValues });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	function parseFollowers(followerString) {
		if (typeof followerString !== "string")
			return parseFloat(followerString) || 0;

		// Remove 'M' or 'K' and convert to a number
		if (followerString.endsWith("M")) {
			return parseFloat(followerString.replace("M", "")) * 1_000_000;
		} else if (followerString.endsWith("K")) {
			return parseFloat(followerString.replace("K", "")) * 1_000;
		}

		// Default to parsing as a number if no suffix is present
		return parseFloat(followerString) || 0;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		// URL to fetch the CSV data
		const csvURL =
			"https://docs.google.com/spreadsheets/d/e/2PACX-1vQzjAfUp94xu3fbu0gUB8Az2TsnyqV-kbM_CMctF-1YDnE-3jtUA96yJIOwhN4qvBUBPQOKmeoq3DlY/pub?output=csv";

		try {
			// Fetch CSV data
			const response = await axios.get(csvURL);
			const csvData = response.data;

			// Parse the CSV into a usable array
			const rows = csvData
				.split("\n")
				.map((row) => row.split(",").map((cell) => cell.trim()));

			// Assume the first row contains headers
			const headers = rows[0];
			const artistData = rows.slice(1);

			// Process the artist data
			const artistScores = artistData.map((artist) => {
				const artistName = artist[0];
				const instagramFollowersScore = parseFollowers(artist[2]);
				const artistMusicGenre = artist[1]?.toLowerCase() || "";

				const score =
					calculateStreamingScore(instagramFollowersScore) +
					calculateMusicGenreMatch(artistMusicGenre, [
						"pop",
						"hip hop",
					]);

				return { name: artistName, score };
			});

			// Sort artists by score and get the top 3
			const topArtists = artistScores
				.sort((a, b) => b.score - a.score)
				.slice(0, 3);

			// Prepare data for the chart
			const chartData = topArtists.map((artist) => ({
				name: artist.name,
				score: artist.score,
			}));

			let artistFinalArray = [];

			for (let i = 0; i < artistScores.length; i++) {
				let artistScore = artistScores[i];
				artistFinalArray.push({
					name: artistScore.name,
					score: artistScore.score,
				});
			}

			const mockResponser = {
				text: "Campaign successfully submitted!",
				trendAnalysis:
					"The target audience prefers Pop and Hip Hop genres.",
				chartData: artistFinalArray,
			};

			const mockResponse = {
				text: "Campaign successfully submitted!",
				trendAnalysis:
					"The target audience prefers Pop and Hip Hop genres.",
				chartData: [
					{ name: "Pop", score: 85 },
					{ name: "Hip Hop", score: 75 },
					{ name: "Rock", score: 55 },
					{ name: "Electronic", score: 60 },
					{ name: "Country", score: 40 },
				],
			};
			// Set form submission state
			setIsSubmitted(true);

			// Delay the chart rendering to ensure the canvas is available
			setTimeout(() => {
				updateUIWithResults(mockResponser);
			}, 100); // A 100ms delay ensures the canvas is fully mounted
		} catch (error) {
			console.error("Error processing the data:", error);
			alert("There was an error processing the data. Please try again.");
		}
	};

	// Helper Functions
	const calculateStreamingScore = (monthlyListeners) => {
		if (monthlyListeners > 220000000) return 15;
		if (monthlyListeners > 100000000) return 10;
		if (monthlyListeners > 10000000) return 5;
		return 0;
	};

	const calculateMusicGenreMatch = (artistMusicGenre, formDataMusic) => {
		return formDataMusic.some((genre) =>
			artistMusicGenre.includes(genre.toLowerCase())
		)
			? 20
			: 0;
	};
	const updateUIWithResults = (data) => {
		// Ensure the canvas and chartRef are properly initialized
		if (!chartRef.current) {
			console.error("Canvas element is not available.");
			return;
		}

		const ctx = chartRef.current.getContext("2d");

		// Destroy the existing chart instance if it exists
		if (window.myChart) {
			window.myChart.destroy();
		}

		// Create a new chart instance and store it globally
		window.myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: data.chartData.map((item) => item.name),
				datasets: [
					{
						label: "Audience Preference Scores",
						data: data.chartData.map((item) => item.score),
						backgroundColor: "rgba(75, 192, 192, 0.6)",
					},
				],
			},
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
			<h1 className="text-2xl font-bold mb-4 text-center">
				Music Artist Campaign Form
			</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Brand Name */}
				<div>
					<label htmlFor="brandName" className="block font-medium">
						Brand Name:
					</label>
					<input
						type="text"
						id="brandName"
						name="brandName"
						onChange={handleInputChange}
						required
						className="w-full p-2 border rounded"
					/>
				</div>

				{/* Age Range */}
				<div>
					<label htmlFor="ageRange" className="block font-medium">
						Target Age Range:
					</label>
					<select
						id="ageRange"
						name="ageRange"
						onChange={handleInputChange}
						required
						className="w-full p-2 border rounded"
					>
						<option value="13-17">13-17</option>
						<option value="18-24">18-24</option>
						<option value="25-34">25-34</option>
						<option value="35-44">35-44</option>
						<option value="45+">45+</option>
					</select>
				</div>

				{/* Location */}
				<div>
					<label htmlFor="location" className="block font-medium">
						Location:
					</label>
					<select
						id="location"
						name="location"
						onChange={handleInputChange}
						required
						className="w-full p-2 border rounded"
					>
						<option value="US">United States</option>
						<option value="Global">Global</option>
					</select>
				</div>

				{/* Industries */}
				<div>
					<label htmlFor="industries" className="block font-medium">
						Industries (select multiple):
					</label>
					<select
						id="industries"
						name="industries"
						onChange={handleInputChange}
						multiple
						required
						className="w-full p-2 border rounded"
					>
						<option value="Fashion">Fashion</option>
						<option value="Technology">Technology</option>
						<option value="Food & Beverage">Food & Beverage</option>
						<option value="Entertainment">Entertainment</option>
						<option value="Sports">Sports</option>
					</select>
				</div>

				{/* Audience Interests */}
				<div>
					<label
						htmlFor="audienceInterests"
						className="block font-medium"
					>
						Audience Interests (select multiple):
					</label>
					<select
						id="audienceInterests"
						name="audienceInterests"
						onChange={handleInputChange}
						multiple
						required
						className="w-full p-2 border rounded"
					>
						<option value="Music">Music</option>
						<option value="Fashion">Fashion</option>
						<option value="Technology">Technology</option>
						<option value="Sports">Sports</option>
						<option value="Travel">Travel</option>
					</select>
				</div>

				{/* Music Genres */}
				<div>
					<label htmlFor="music" className="block font-medium">
						Music Genres (select multiple):
					</label>
					<select
						id="music"
						name="music"
						onChange={handleInputChange}
						multiple
						required
						className="w-full p-2 border rounded"
					>
						<option value="Pop">Pop</option>
						<option value="Hip Hop">Hip Hop</option>
						<option value="Rock">Rock</option>
						<option value="Electronic">Electronic</option>
						<option value="Country">Country</option>
					</select>
				</div>

				{/* Campaign Goal */}
				<div>
					<label htmlFor="campaignGoal" className="block font-medium">
						Campaign Goal:
					</label>
					<select
						id="campaignGoal"
						name="campaignGoal"
						onChange={handleInputChange}
						required
						className="w-full p-2 border rounded"
					>
						<option value="awareness">Brand Awareness</option>
						<option value="engagement">Engagement</option>
						<option value="sales">Sales</option>
					</select>
				</div>

				{/* Campaign Budget */}
				<div>
					<label
						htmlFor="campaignBudget"
						className="block font-medium"
					>
						Campaign Budget:
					</label>
					<input
						type="number"
						id="campaignBudget"
						name="campaignBudget"
						onChange={handleInputChange}
						required
						className="w-full p-2 border rounded"
					/>
				</div>

				{/* Additional Notes */}
				<div>
					<label
						htmlFor="additionalNotes"
						className="block font-medium"
					>
						Additional Notes:
					</label>
					<textarea
						id="additionalNotes"
						name="additionalNotes"
						rows="4"
						onChange={handleInputChange}
						className="w-full p-2 border rounded"
					></textarea>
				</div>

				<button
					type="submit"
					className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
				>
					Submit
				</button>
			</form>
			{isSubmitted && (
				<div className="mt-6">
					<h2 className="text-xl font-bold mb-4 text-center">
						Audience Analysis
					</h2>
					<canvas ref={chartRef} className="w-full h-64"></canvas>
				</div>
			)}
		</div>
	);
};

export default Charts;
