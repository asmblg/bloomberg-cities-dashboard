# Running Vite + React + Express Application

This guide provides instructions on how to set up and run a Vite + React + Express application.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- Node.js (version 22 or higher)
- npm (Node Package Manager)

## Steps

1. **Clone the repository:**
  ```sh
  git clone <repository-url>
  cd <repository-directory>
  ```

2. **Install dependencies:**
  ```sh
  npm install
  ```

3. **Start the development server:**
  - To start the Vite development server for the React frontend:
    ```sh
    npm run dev
    ```
  - To start the Express server for the backend:
    ```sh
    npm run server
    ```

4. **Access the application:**
  - Open your browser and navigate to `http://localhost:5173` for the React frontend.
  - The Express backend will be running on `http://localhost:3001`.

## Scripts

- `npm run dev`: Starts the Vite development server for the React frontend.
- `npm run server`: Starts the Express server for the backend.
- `npm run build`: Builds the React application for production.
- `npm start`: Serves the built React application using the Express server.

## Project Structure

- `src/`: Contains the React application source code.
- `server/`: Contains the Express server code.
- `public/`: Contains static assets.
- `dist/`: Contains the production build of the React application.

## Additional Notes

- Ensure that the ports used by Vite and Express do not conflict with other services running on your machine.
- You can customize the configuration files (`vite.config.js` and `server.js`) to suit your needs.

## Troubleshooting

- If you encounter issues with dependencies, try deleting the `node_modules` directory and running `npm install` again.
- Check the console output for any error messages and follow the suggested solutions.

By following these steps, you should be able to successfully set up and run a Vite + React + Express application.