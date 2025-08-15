import { useEffect, useState } from "react";
import { getMongoCollection } from "./mongoClient";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch posts from MongoDB
  async function fetchPosts() {
    const collection = await getMongoCollection();
    const docs = await collection.find();
    setPosts(docs);
  }

  // Add new post
  async function handleAddPost() {
    if (!title.trim() || !content.trim()) return;
    const collection = await getMongoCollection();
    await collection.insertOne({ title, content });
    setTitle("");
    setContent("");
    fetchPosts();
  }

  // Edit button click
  function handleEdit(post) {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  }

  // Save updated post
  async function handleUpdate() {
    const collection = await getMongoCollection();
    await collection.updateOne(
      { _id: editingPost._id },
      { $set: { title: editTitle, content: editContent } }
    );
    setEditingPost(null);
    fetchPosts();
  }

  // Delete post
  async function handleDelete(id) {
    const collection = await getMongoCollection();
    await collection.deleteOne({ _id: id });
    fetchPosts();
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>
        <strong>Realm</strong> → MongoDB: Posts
      </h1>

      {/* Add New Post */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
        <button onClick={handleAddPost}>➕ Add Post</button>
      </div>

      {/* Edit Post Form */}
      {editingPost && (
        <div style={{ marginBottom: "20px", border: "1px solid red", padding: "10px" }}>
          <h3>Editing Post</h3>
          <input
            type="text"
            placeholder="Post title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <textarea
            placeholder="Post content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <button onClick={handleUpdate}>💾 Save</button>
          <button onClick={() => setEditingPost(null)}>❌ Cancel</button>
        </div>
      )}

      {/* Posts List */}
      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => handleEdit(post)}>✏ Edit</button>
          <button onClick={() => handleDelete(post._id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}
