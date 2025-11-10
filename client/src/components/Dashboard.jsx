import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/AxiosInstance";
import PostCard from "./PostCard";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch posts on load
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axiosInstance.post("/posts", { text });
    
      setPosts((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      alert("Could not create post");
    }
  };

  
  const updatePostLocally = (updatedPost) => {
    setPosts((prev) => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Create Post</h2>
          <form onSubmit={handleCreate}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="3"
              className="w-full border rounded p-2 mb-3"
              placeholder={user ? `What's on your mind, ${user.name}?` : "What's on your mind?"}
            />
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Post</button>
            </div>
          </form>
        </div>

        {/* Posts list */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-center text-gray-500">No posts yet. Start by creating one!</p>
          )}
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={updatePostLocally} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
