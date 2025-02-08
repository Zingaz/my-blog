// pages/create.tsx
import { useState, FormEvent } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!session) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>You must be signed in to create a post.</p>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      router.push('/');
    } else {
      console.error('Failed to create post');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="content">Content:</label>
          <br />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
