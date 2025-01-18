'use client'; // Use the client-side runtime
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse'; // Import PapaParse to parse CSV data
import { Chart } from 'chart.js/auto'; // Import Chart.js for creating charts
import axios from "axios";
import { google } from "googleapis"; // Use Google Sheets API if needed.
// Type definitions for form data and results

const ArtistCampaignForm: React.FC = () => {
	const [result, setResult] = useState<string>('');
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [formData, setFormData] = useState<FormData>({
	  brandName: '',
	  ageRange: '',
	  location: '',
	  industries: '',
	  audienceInterests: '',
	  music: '',
	  campaignGoal: '',
	  campaignType: '',
	  campaignBudget: '',
	  brandFocus: '',
	  additionalNotes: '',
	});
	const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
	  const { name, value, type } = e.target as HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement;
	  const options = (e.target as HTMLSelectElement).options;
	  const multiple = (e.target as HTMLSelectElement).multiple;
	  if (type === "select-multiple") {
		const selectedValues = Array.from(options)
		  .filter((option) => option.selected)
		  .map((option) => option.value);
		setFormData((prevFormData: FormData) => ({ ...prevFormData, [name]: selectedValues }));
	  } else {
		setFormData((prevFormData: FormData) => ({ ...prevFormData, [name]: value }));
	  }
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();	
	}

interface FormData {
  brandName: string;
  ageRange: string;
  location: string;
  industries: string | string[];
  audienceInterests: string | string[];
  music: string | string[];
  campaignGoal: string;
  campaignType: string | string[];
  campaignBudget: string;
  brandFocus: string | string[];
  additionalNotes: string;
}

interface ArtistScore {
  name: string;
  score: number;
  breakdown: Record<string, number>;
}

interface ChartData {
  name: string;
  score: number;
}


  const [results, setResults] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<string>('');
  const [artistData, setArtistData] = useState<any[]>([]); // State to store artist data fetched from CSV

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch CSV data using the provided URL
  useEffect(() => {
    const fetchCSVData = async () => {
      const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzjAfUp94xu3fbu0gUB8Az2TsnyqV-kbM_CMctF-1YDnE-3jtUA96yJIOwhN4qvBUBPQOKmeoq3DlY/pub?output=csv";
      
      try {
        const response = await fetch(csvURL);
        const csvText = await response.text();
        
        // Use PapaParse to parse the CSV data into JSON format
        Papa.parse(csvText, {
          complete: (result) => {
            setArtistData(result.data); // Store the parsed data into state
          },
          header: true, // Assuming CSV has headers
        });
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchCSVData();
  }, []); // Run only once on mount

  // Fetch data from the Google Script URL using useEffect
  useEffect(() => {
    const fetchGoogleScriptData = async () => {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbynIk4m3dHQ3Qa-q4meJx-67FX6Pt8kzw20cWravg32hcCImN8zCM8x4qysJpQ4sxhu/exec';

      try {
        const response = await fetch(scriptURL);
        const jsonData = await response.json();

        // Check if jsonData is valid before processing
        if (jsonData && typeof jsonData === 'object') {
          console.log('Fetched Google Script Data:', jsonData);
          // Process jsonData if needed
        } else {
          console.error('Received invalid data from Google Script:', jsonData);
        }
      } catch (error) {
        console.error('Error fetching Google Script data:', error);
      }
    };

    fetchGoogleScriptData();
  }, []); // Run only once on mount

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const mockFormData: FormData = formData;

      // Use artist data fetched earlier
      const mockArtistData: ArtistScore[] = await processArtistData(mockFormData);

      const topArtists = mockArtistData.sort((a, b) => b.score - a.score).slice(0, 3);

      const detailedResults = formatDetailedResults(topArtists);
      const chartData = createChartData(topArtists);
      const trendAnalysis = analyzeTrends(topArtists);

      setResults(detailedResults);
      setChartData(chartData);
      setTrendAnalysis(trendAnalysis);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error processing form submission:', error);
      setResults('An error occurred while processing your request.');
    }
  };

  // Simulate artist data processing and scoring
  const processArtistData = async (formData: FormData): Promise<ArtistScore[]> => {
    // Using the artistData fetched from CSV (which is stored in the state)
    return artistData.map((artist) => {
      const score = calculateScore(artist, formData);
      return { name: artist.name, score, breakdown: calculateBreakdown(artist, formData) };
    });
  };

  // Simulate the calculation of an artist's score
  const calculateScore = (artist: any, formData: FormData): number => {
	return Object.values(artist.breakdown).reduce((acc: number, value) => {
		return acc + (value as number);
	}, 0);
  };

  // Simulate calculating a breakdown for each artist
  const calculateBreakdown = (artist: any, formData: FormData): Record<string, number> => {
    return {
      audienceOverlap: 20,
      brandAlignment: 15,
      campaignFit: 10,
      followerScore: 5,
      engagementScore: 10,
      compensationMatch: 10,
      musicGenreMatch: 5,
      streamingPopularity: 10,
      musicCampaignFit: 5,
    };
  };

  // Helper to format detailed results of top artists
  const formatDetailedResults = (topArtists: ArtistScore[]): string => {
    return topArtists
      .map((artist, index) => {
        return `${index + 1}. ${artist.name} (Total Score: ${artist.score.toFixed(2)})\n` +
               `   - Audience Overlap: ${artist.breakdown.audienceOverlap} points\n` +
               `   - Brand Alignment: ${artist.breakdown.brandAlignment} points\n` +
               `   - Campaign Fit: ${artist.breakdown.campaignFit} points\n` +
               `   - Followers: ${artist.breakdown.followerScore.toFixed(2)} points\n` +
               `   - Engagement: ${artist.breakdown.engagementScore} points\n` +
               `   - Compensation: ${artist.breakdown.compensationMatch} points\n` +
               `   - Music Genre Match: ${artist.breakdown.musicGenreMatch} points\n` +
               `   - Streaming Popularity: ${artist.breakdown.streamingPopularity} points\n` +
               `   - Music Campaign Fit: ${artist.breakdown.musicCampaignFit} points`;
      })
      .join("\n\n");
  };

  // Helper to generate chart data
  const createChartData = (topArtists: ArtistScore[]): ChartData[] => {
    return topArtists.map((artist) => ({
      name: artist.name,
      score: artist.score,
    }));
  };

  // Helper to simulate analyzing trends
  const analyzeTrends = (topArtists: ArtistScore[]): string => {
    return topArtists
      .map((artist) => {
        return `Trend analysis for ${artist.name}: \n` +
               `- Follower count is increasing\n` +
               `- Engagement rate is improving`;
      })
      .join("\n\n");
  };

  // Handle input changes
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
						rows={4}
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


export default ArtistCampaignForm;
