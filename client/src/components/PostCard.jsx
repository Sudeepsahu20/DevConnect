import { useState, useContext } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { AuthContext } from "../context/AuthContext";

const PostCard = ({ post, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const isLiked = () => {
    if (!post.likes) return false;
    return post.likes.some(l => l.user === (user?._id || user?.id)); 
  };

  const handleLike = async () => {
    if (!user) return alert("Please login to like posts");
    setLoadingLike(true);
    try {
      const res = await axiosInstance.put(`/posts/like/${post._id}`);
      
      const updatedPost = { ...post, likes: res.data }; 
      onUpdate(updatedPost);
    } catch (err) {
      console.error("Like error", err);
      alert(err.response?.data?.msg || "Could not like");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!commentText.trim()) return;
    setLoadingComment(true);
    try {
      const res = await axiosInstance.post(`/posts/comment/${post._id}`, { text: commentText });
    
      const updatedPost = { ...post, comments: res.data };
      onUpdate(updatedPost);
      setCommentText("");
    } catch (err) {
      console.error("Comment error", err);
      alert("Could not add comment");
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold">{post.user?.name || "Unknown"}</p>
          <p className="text-xs text-gray-500">{new Date(post.date).toLocaleString()}</p>
        </div>
        <div className="text-sm text-gray-500">{post.likes?.length || 0} likes</div>
      </div>

      <p className="mb-3 text-gray-800">{post.text}</p>

      <div className="flex items-center space-x-3 mb-3">
        <button
          onClick={handleLike}
          disabled={loadingLike}
          className={`px-3 py-1 rounded ${isLiked() ? "bg-blue-600 text-white" : "bg-gray-100"} hover:opacity-90`}
        >
          {isLiked() ? "Liked" : "Like"}
        </button>

        <button className="px-3 py-1 rounded bg-gray-100">Comment</button>
      </div>

      {/* Comments */}
      <div className="space-y-2 mb-2">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((c, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-semibold">{c.user?.name || "User"}: </span>
              <span>{c.text}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No comments yet</p>
        )}
      </div>

      {/* Add comment */}
      <form onSubmit={handleComment} className="flex space-x-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" disabled={loadingComment} className="bg-blue-600 text-white px-3 rounded">
          {loadingComment ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default PostCard;
