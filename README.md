# Deploying 3D Representation of Telecom Paris Building to GitHub Pages

This guide explains how to deploy the 3D representation of the Telecom Paris building project to GitHub Pages using `npx vite build` and `gh-pages`.

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js and npm
- Vite
- `gh-pages` npm package

## Steps to Deploy

1. **Clone the Repository:**
   If you haven't already, clone the repository to your local machine.
   ```bash
   git clone https://github.com/saarzhanova/Navigation-Telecom.git
   cd Navigation-Telecom
2. **Install Dependencies:**
Navigate to your project directory and install the necessary dependencies.
```bash
npm install
```
3. **Build the Project:**
Use Vite to build your project. This will create a dist directory containing the production-ready files.
```bash
npx vite build
```
4. **Deploy to GitHub Pages:**
Use the gh-pages package to deploy the contents of the dist directory to the gh-pages branch.
```bash
npx gh-pages -d dist -b gh-pages
```
5. **Post-Deployment**
Once the deployment is complete, your project will be accessible via GitHub Pages.

## Accessing Your Project
To access your deployed project, use the following link format:

```arduino
https://saarzhanova.github.io/Navigation-Telecom/
```

## Additional Information
For more detailed information on deploying to [GitHub Pages](https://docs.github.com/en/pages), refer to the GitHub Pages documentation.
If you encounter any issues during the deployment process, please check the [gh-pages documentation](https://www.npmjs.com/package/gh-pages) or open an issue in the repository.
