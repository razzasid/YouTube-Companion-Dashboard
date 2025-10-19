# YouTube Companion Dashboard

A full-stack application for managing YouTube videos with features including video details viewing, commenting, replies, and note-taking capabilities.

## Features

- ✅ OAuth2 authentication with YouTube
- ✅ View video details (title, description, statistics)
- ✅ Edit video title and description
- ✅ Post comments on videos
- ✅ Reply to comments
- ✅ Delete comments
- ✅ Create and manage notes with tags
- ✅ Search notes by content or tags
- ✅ Complete event logging system
- ✅ MongoDB database integration

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Google YouTube Data API v3
- OAuth2 authentication

**Frontend:**
- React (Vite)
- Vanilla CSS

## Database Schema

### Notes Collection
```javascript
{
  _id: ObjectId,
  videoId: String,
  content: String,
  tags: [String],
  createdAt: Date (default: now)
}
```

### EventLogs Collection
```javascript
{
  _id: ObjectId,
  action: String,
  details: Object,
  timestamp: Date (default: now)
}
```

## API Endpoints

### Authentication

#### GET `/api/auth/url`
Get OAuth2 authorization URL
- **Response:** `{ url: string }`

#### POST `/api/auth/callback`
Exchange authorization code for tokens
- **Body:** `{ code: string }`
- **Response:** `{ tokens: object }`

#### POST `/api/auth/tokens`
Set OAuth2 tokens for subsequent requests
- **Body:** `{ tokens: object }`
- **Response:** `{ success: boolean }`

### Video Management

#### GET `/api/video/:videoId`
Get video details including snippet, statistics, and status
- **Params:** `videoId` (string)
- **Response:** YouTube video object
- **Event Log:** `VIDEO_FETCH`

#### PUT `/api/video/:videoId`
Update video title and description
- **Params:** `videoId` (string)
- **Body:** `{ title: string, description: string }`
- **Response:** Updated video object
- **Event Log:** `VIDEO_UPDATE`

### Comments Management

#### GET `/api/comments/:videoId`
Get all comment threads for a video
- **Params:** `videoId` (string)
- **Response:** Array of comment thread objects
- **Event Log:** `COMMENTS_FETCH`

#### POST `/api/comments/:videoId`
Post a new comment on a video
- **Params:** `videoId` (string)
- **Body:** `{ text: string }`
- **Response:** Created comment object
- **Event Log:** `COMMENT_POST`

#### POST `/api/comments/:commentId/reply`
Reply to a specific comment
- **Params:** `commentId` (string)
- **Body:** `{ text: string }`
- **Response:** Created reply object
- **Event Log:** `COMMENT_REPLY`

#### DELETE `/api/comments/:commentId`
Delete a comment (user must be comment owner)
- **Params:** `commentId` (string)
- **Response:** `{ success: boolean }`
- **Event Log:** `COMMENT_DELETE`

### Notes Management

#### POST `/api/notes`
Create a new note
- **Body:** 
  ```json
  {
    "videoId": "string",
    "content": "string",
    "tags": ["string"]
  }
  ```
- **Response:** Created note object
- **Event Log:** `NOTE_CREATE`

#### GET `/api/notes/:videoId`
Get all notes for a video
- **Params:** `videoId` (string)
- **Response:** Array of note objects
- **Event Log:** `NOTES_FETCH`

#### GET `/api/notes/:videoId/search`
Search notes by content or tags
- **Params:** `videoId` (string)
- **Query:** 
  - `q` (optional): Search text in content
  - `tag` (optional): Filter by specific tag
- **Response:** Array of matching note objects
- **Event Log:** `NOTES_SEARCH`

#### PUT `/api/notes/:noteId`
Update a note
- **Params:** `noteId` (string)
- **Body:** `{ content: string, tags: [string] }`
- **Response:** Updated note object
- **Event Log:** `NOTE_UPDATE`

#### DELETE `/api/notes/:noteId`
Delete a note
- **Params:** `noteId` (string)
- **Response:** `{ success: boolean }`
- **Event Log:** `NOTE_DELETE`

### Event Logs

#### GET `/api/logs`
Get recent event logs (last 100)
- **Response:** Array of event log objects sorted by timestamp (descending)

## Event Log Actions

All actions are automatically logged with timestamps:

- `AUTH` - User authentication
- `VIDEO_FETCH` - Video details retrieved
- `VIDEO_UPDATE` - Video title/description updated
- `COMMENTS_FETCH` - Comments retrieved
- `COMMENT_POST` - New comment posted
- `COMMENT_REPLY` - Reply to comment
- `COMMENT_DELETE` - Comment deleted
- `NOTE_CREATE` - Note created
- `NOTES_FETCH` - Notes retrieved
- `NOTES_SEARCH` - Notes searched
- `NOTE_UPDATE` - Note updated
- `NOTE_DELETE` - Note deleted

## Setup Instructions

### Backend Setup

1. Create a Google Cloud Project and enable YouTube Data API v3
2. Create OAuth2 credentials (Web application)
3. Clone the repository
4. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
5. Create `.env` file:
   ```
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   REDIRECT_URI=your_redirect_uri
   PORT=5000
   ```
6. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Upload Video to YouTube

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Select your video file
4. Set visibility to "Unlisted"
5. Publish and copy the video ID from the URL

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Vercel)

1. Import your project to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=your_backend_url`
5. Deploy

## Usage

1. Click "Connect YouTube Account" to authenticate
2. Enter your video ID and click "Load Video"
3. View and edit video details
4. Add comments and replies
5. Create notes with tags for video improvement ideas
6. Search notes by content or tags
7. All actions are logged in the database

## Error Handling

- All API endpoints include error handling
- Errors return appropriate HTTP status codes
- Error messages are returned in JSON format: `{ error: string }`

## Security Considerations

- OAuth2 tokens stored in localStorage (client-side)
- Backend validates all YouTube API requests
- Only video owner can delete their comments
- CORS enabled for specified origins

## License

MIT
