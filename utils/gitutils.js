const axios = require('axios');

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

module.exports = {
  getCommitsFromGitHubRepo,
  getBranchesFromGitHubRepo
};
