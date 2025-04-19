# AI Chat Interface

A Claude-like chat interface built with React that connects to your AI API endpoint.

## Features

- Clean, modern UI similar to claude.ai
- Conversation history with multiple chat sessions
- Markdown support for assistant responses (including code highlighting)
- Real-time typing indicators
- Responsive design for mobile and desktop
- Session management with unique session IDs

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone this repository:
```
git clone <your-repo-url>
cd ai-chat-interface
```

2. Install dependencies:
```
npm install
```
or
```
yarn
```

## Configuration

The application is configured to connect to your API endpoint at `http://127.0.0.1:7860/api/v1/run/6f17d4f7-284b-40e3-9b81-213baf319f2c`. If you need to modify this:

1. Open `EnhancedApp.js`
2. Find the `sendMessage` function
3. Update the fetch URL to your API endpoint

## Running the Application

To start the development server:

```
npm start
```
or
```
yarn start
```

Your application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```
npm run build
```
or
```
yarn build
```

This will create optimized files in the `build` folder that you can deploy to your hosting provider.

## Project Structure

- `src/App.js` - Basic chat interface component
- `src/EnhancedApp.js` - Advanced chat interface with conversation history
- `src/App.css` - Styles for the basic interface
- `src/EnhancedApp.css` - Styles for the enhanced interface
- `src/index.js` - Entry point for the React application

## How It Works

The application sends messages to your API endpoint with this payload structure:

```json
{
  "input_value": "Your message here",
  "output_type": "chat",
  "input_type": "chat",
  "session_id": "unique_session_id"
}
```

The response is expected to have an `output` field containing the AI's response.

## Customization

### Styling

You can customize the appearance by modifying the CSS files:
- `App.css` - For the basic interface
- `EnhancedApp.css` - For the enhanced interface

### Adding Features

Some potential enhancements you might want to implement:
- File uploads
- Voice input/output
- API key management
- Custom themes
- Export conversation history

## License

MIT
