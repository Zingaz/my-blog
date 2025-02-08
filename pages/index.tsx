// pages/index.tsx
import { GetServerSideProps } from 'next';
import prisma from '../lib/prisma';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

type Post = {
  id: number;
  title: string;
};

type HomeProps = {
  posts: Post[];
};

export default function Home({ posts }: HomeProps) {
  const { data: session } = useSession();

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        {session ? (
          <>
            <span>Signed in as {session.user?.email}</span>
            <button onClick={() => signOut()} style={{ marginLeft: '1rem' }}>
              Sign out
            </button>
            <Link href="/create">
              <a style={{ marginLeft: '1rem' }}>Create Post</a>
            </Link>
          </>
        ) : (
          <button onClick={() => signIn('github')}>Sign in with GitHub</button>
        )}
      </header>

      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1rem' }}>
            <Link href={`/posts/${post.id}`}>
              <a style={{ fontSize: '1.2rem' }}>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return {
    props: { posts },
  };
};