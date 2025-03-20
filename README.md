# GitHub Stats

Web application that provides comprehensive statistics and insights for GitHub users.

## Overview

GitHub Stats gives you a quick and insightful view of any GitHub user's activity. Simply visit `github-stats.ssaxel03.com/<username>` to see detailed statistics about any GitHub user, including yourself.

## Features

- **Recent Activity**: View a user's 15 most recent commits
- **Star Count**: See how many stars a user has received across all repositories
- **Contribution Metrics**:
  - Total contributions and commits since joining GitHub (for private commits see [Deploy it on your own](#deploy-it-on-your-own))
  - Contributions and commits in the current year (for private commits see [Deploy it on your own](#deploy-it-on-your-own))
- **Language Analysis**: Visualizes all programming languages used, ranked from most to least used
- **Single Dashboard**: Access all important GitHub statistics in one convenient place
- **Private Repository Support**: When deploying your own instance with your personal GitHub token, you can view statistics for both public and private repositories

## Roadmap

- **Card Image Generation**: Create embeddable cards that can be added to GitHub profiles and READMEs to showcase real-time GitHub statistics

## Live demo

Check it out live at [github-stats.ssaxel03.com](https://github-stats.ssaxel03.com)

## Tech stack

- Next.js
- React.js
- Tailwind CSS
- GitHub APIs:
  - GitHub REST API
  - GitHub GraphQL API
- Deployed on Vercel

## Deploy it on your own

### Prerequisites

- Node.js
- npm
- GitHub Personal Access Token

### Deployment

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/ssaxel03/github-stats.git

# Navigate to the project directory
cd github-stats

# Install dependencies
npm install
```

Create a `.env` file in the root directory with your GitHub token:

```
GITHUB_TOKEN=your_github_personal_access_token
```

**Note**: Using your own GitHub token will provide better API rate limits. Additionally, to view statistics for private repositories, you must deploy your own instance with your personal GitHub token.

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser to see the application running locally.

For production deployment:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GitHub for providing the APIs
