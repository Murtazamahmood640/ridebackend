const express = require('express');
const axios = require('axios');  // Make HTTP requests to GitHub API
const router = express.Router();

// GitHub API URL base
const GITHUB_API_URL = process.env.GITHUB_API_URL;

// Function to get commits from GitHub repository
const getCommitsFromGitHubRepo = async (owner, repo) => {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.data;  // Return the list of commits
};

// Function to get branches from GitHub repository
const getBranchesFromGitHubRepo = async (owner, repo) => {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/branches`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.data;  // Return the list of branches
};

// Route to get commits from a specific repository
router.get('/commits/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  
  try {
    const commits = await getCommitsFromGitHubRepo(owner, repo);
    res.json(commits);  // Send commits data in response
  } catch (error) {
    console.error('Error fetching commits:', error);
    res.status(500).json({ message: 'Failed to fetch commits', error: error.message });
  }
});

// Route to get branches from a specific repository
router.get('/branches/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  
  try {
    const branches = await getBranchesFromGitHubRepo(owner, repo);
    res.json(branches);  // Send branches data in response
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Failed to fetch branches', error: error.message });
  }
});

module.exports = router;
