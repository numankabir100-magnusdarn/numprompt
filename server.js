const express = require('express');
const groq = require('@sanity/groq');
const sanityClient = require('@sanity/client');
const app = express();
const port = process.env.PORT || 3000;

// Initialize Sanity client
const client = sanityClient({
  projectId: 'your_project_id', // replace with your project ID
  dataset: 'your_dataset_name', // replace with your dataset name
  useCdn: true,
});

// Middleware
app.use(express.json());

// Routes
app.get('/api/data', async (req, res) => {
  try {
    const query = groq`*[_type == "your_document_type"]`; // Adjust the GROQ query as per your schema
    const data = await client.fetch(query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});