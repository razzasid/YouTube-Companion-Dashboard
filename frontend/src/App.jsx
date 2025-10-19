import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [videoId, setVideoId] = useState("");
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tokens, setTokens] = useState(null);

  // Form states
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [newNote, setNewNote] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // Auth
  const handleAuth = async () => {
    const response = await fetch(`${API_URL}/auth/url`);
    const { url } = await response.json();
    window.location.href = url;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code && !tokens) {
      // Exchange code for tokens
      fetch(`${API_URL}/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Auth failed");
          return res.json();
        })
        .then((data) => {
          setTokens(data.tokens);
          localStorage.setItem("tokens", JSON.stringify(data.tokens));
          // Clean URL
          window.history.replaceState({}, document.title, "/");
        })
        .catch((err) => {
          console.error("Auth error:", err);
          alert("Authentication failed. Please try again.");
        });
    } else {
      const saved = localStorage.getItem("tokens");
      if (saved) {
        try {
          setTokens(JSON.parse(saved));
        } catch (e) {
          localStorage.removeItem("tokens");
        }
      }
    }
  }, []);

  // Fetch video details
  const fetchVideo = async () => {
    if (!videoId) return;

    try {
      await fetch(`${API_URL}/auth/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens }),
      });

      const res = await fetch(`${API_URL}/video/${videoId}`);
      const data = await res.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
        return;
      }

      setVideo(data);
      setEditTitle(data.snippet.title);
      setEditDesc(data.snippet.description);

      fetchComments();
      fetchNotes();
    } catch (error) {
      console.error("Error fetching video:", error);
      alert("Failed to load video. Please check the video ID and try again.");
    }
  };

  const fetchComments = async () => {
    const res = await fetch(`${API_URL}/comments/${videoId}`);
    const data = await res.json();
    if (data.error) {
      console.error("Comments error:", data.error);
      setComments([]);
      alert(
        "Comments are disabled on this video. Please use a video with comments enabled."
      );
    } else {
      setComments(Array.isArray(data) ? data : []);
    }
  };

  const fetchNotes = async () => {
    const res = await fetch(`${API_URL}/notes/${videoId}`);
    const data = await res.json();
    setNotes(data);
  };

  // Update video
  const updateVideo = async () => {
    await fetch(`${API_URL}/video/${videoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDesc }),
    });
    setEditMode(false);
    fetchVideo();
  };

  // Post comment
  const postComment = async () => {
    await fetch(`${API_URL}/comments/${videoId}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment }),
    });
    setNewComment("");
    fetchComments();
  };

  // Reply to comment
  const replyToComment = async (commentId) => {
    await fetch(`${API_URL}/comments/${commentId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: replyText[commentId] }),
    });
    setReplyText({ ...replyText, [commentId]: "" });
    fetchComments();
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    await fetch(`${API_URL}/comments/${commentId}`, { method: "DELETE" });
    fetchComments();
  };

  // Add note
  const addNote = async () => {
    await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        content: newNote,
        tags: noteTags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      }),
    });
    setNewNote("");
    setNoteTags("");
    fetchNotes();
  };

  // Search notes
  const searchNotes = async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (searchTag) params.append("tag", searchTag);

    const res = await fetch(`${API_URL}/notes/${videoId}/search?${params}`);
    const data = await res.json();
    setNotes(data);
  };

  // Delete note
  const deleteNote = async (noteId) => {
    await fetch(`${API_URL}/notes/${noteId}`, { method: "DELETE" });
    fetchNotes();
  };

  if (!tokens) {
    return (
      <div className="container">
        <h1>YouTube Companion Dashboard</h1>
        <button onClick={handleAuth} className="btn-primary">
          Connect YouTube Account
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>YouTube Companion Dashboard</h1>

      {/* Video ID Input */}
      <div className="section">
        <h2>Load Video</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Video ID"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
          <button onClick={fetchVideo} className="btn-primary">
            Load Video
          </button>
        </div>
      </div>

      {video && (
        <>
          {/* Video Details */}
          <div className="section">
            <h2>Video Details</h2>
            {!editMode ? (
              <>
                <h3>{video.snippet.title}</h3>
                <p>{video.snippet.description}</p>
                <p>
                  Views: {video.statistics.viewCount} | Likes:{" "}
                  {video.statistics.likeCount}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-secondary"
                >
                  Edit Title & Description
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="full-width"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows="4"
                  className="full-width"
                />
                <button onClick={updateVideo} className="btn-primary">
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Comments */}
          <div className="section">
            <h2>Comments</h2>
            <div className="input-group">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="2"
              />
              <button onClick={postComment} className="btn-primary">
                Post Comment
              </button>
            </div>

            <div className="comments-list">
              {comments.map((thread) => (
                <div key={thread.id} className="comment">
                  <p>
                    <strong>
                      {thread.snippet.topLevelComment.snippet.authorDisplayName}
                    </strong>
                  </p>
                  <p>{thread.snippet.topLevelComment.snippet.textDisplay}</p>

                  {thread.snippet.topLevelComment.snippet.authorChannelId
                    ?.value === video.snippet.channelId && (
                    <button
                      onClick={() =>
                        deleteComment(thread.snippet.topLevelComment.id)
                      }
                      className="btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  )}

                  <div className="reply-section">
                    <input
                      type="text"
                      placeholder="Reply..."
                      value={replyText[thread.snippet.topLevelComment.id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [thread.snippet.topLevelComment.id]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        replyToComment(thread.snippet.topLevelComment.id)
                      }
                      className="btn-secondary btn-sm"
                    >
                      Reply
                    </button>
                  </div>

                  {thread.replies?.comments?.map((reply) => (
                    <div key={reply.id} className="reply">
                      <p>
                        <strong>{reply.snippet.authorDisplayName}</strong>
                      </p>
                      <p>{reply.snippet.textDisplay}</p>
                      {reply.snippet.authorChannelId?.value ===
                        video.snippet.channelId && (
                        <button
                          onClick={() => deleteComment(reply.id)}
                          className="btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="section">
            <h2>Notes</h2>
            <div className="input-group">
              <textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows="2"
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
              />
              <button onClick={addNote} className="btn-primary">
                Add Note
              </button>
            </div>

            <div className="search-section">
              <h3>Search Notes</h3>
              <input
                type="text"
                placeholder="Search text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter by tag..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
              />
              <button onClick={searchNotes} className="btn-secondary">
                Search
              </button>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchTag("");
                }}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>

            <div className="notes-list">
              {notes.map((note) => (
                <div key={note._id} className="note">
                  <p>{note.content}</p>
                  <div className="tags">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
