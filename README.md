# Learnosity Custom Question

A demo project for implementing custom questions with Learnosity APIs.

## Quick Start

### 1. Install Dependencies

```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Start Development Server

```bash
# Terminal 1: Start the backend server
cd server
npm start

# Terminal 2: Start the frontend dev server
npm start
```

### 3. Access the Application

- **Player**: http://localhost:8080/
- **Reports**: http://localhost:8080/report.html?sessionId=YOUR_SESSION_ID

## Configuration

### Environment Query Parameters

Control the environment via URL query parameters:

- `?env=prod` - Production (default)
- `?env=staging` - Staging
- `?env=dev` - Development

### Activity Configuration

- `?activityId=YOUR_ACTIVITY_ID` - Custom activity template ID
- `?ignore=1` - Ignore question attributes (valid_response)

### Example URLs

```
http://localhost:8080/?env=dev&activityId=MyActivity
http://localhost:8080/report.html?env=dev&sessionId=abc123&userId=user456
```

## Server Configuration

Configure the server using environment variables in `server/.env`:

```bash
PORT=3004
HOST=localhost
LEARNOSITY_CONSUMER_KEY=your_key
LEARNOSITY_SECRET=your_secret
```

See `server/.env.example` for all available options.

## Build for Production

```bash
npm run build
```

Output files will be in the `dist/` directory.

## Project Structure

```
├── src/
│   ├── index.js          # Player entry point
│   ├── report.js         # Reports entry point
│   ├── player.js         # Player functionality
│   ├── reporting.js      # Reporting functionality
│   ├── authoring.js      # Authoring functionality
│   ├── util.js           # Utility functions
│   └── questions/        # Custom question types
├── server/
│   └── src/
│       ├── index.js      # Express server
│       └── config.js     # Server configuration
└── dist/                 # Build output
```

## License

ISC
