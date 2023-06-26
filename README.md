# altitude-air
Meta repo for easy setup of client and API

## Project Setup
⚠️ Before getting started, please ensure you have Node.js LTS (Long-Term Support) installed on your system. You can download it from the official Node.js website: https://nodejs.org

👉 Follow the steps below to set up and run the project:

1. Open your preferred terminal or command prompt.

2. Navigate to the root directory of the project.

3. Make the setup script executable by running the following command:

```bash
chmod +x setup.sh
```

4. Execute the setup script to install dependencies and configure the project:
```bash
./setup.sh
```
🔄 The script will automatically install the required dependencies for the client and server, set up the environment variables, and build the client application.

5. Once the setup script completes successfully, start the development server by running:
```bash
./start.sh
```

🚀 This will concurrently run the client and server, and you'll see the project running in your terminal.

🎨 The client will be accessible at `http://localhost:5173`, 
📦 The server API endpoints will be available at `http://localhost:3001`.
