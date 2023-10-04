import React from "react";
import "./style.css";

export default function App() {
  return (
    <div>
      <PostList/>
    </div>
  );
}
import React, { useEffect, useState } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setEditPost(post);
    setEditedContent(post.body); // Initialize edited content with the current post's body
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${editPost.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ ...editPost, body: editedContent }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      const updatedPost = { ...editPost, body: editedContent };
      const updatedPosts = posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      );
      setPosts(updatedPosts);
      setEditPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editPost === post ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={handleUpdate}>Update</button>
              </div>
            ) : (
              <div>
                <p>{post.title}</p>
                <p>{post.body}</p>
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

