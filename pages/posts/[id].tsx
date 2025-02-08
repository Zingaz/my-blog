// pages/posts/[id].tsx
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import Link from 'next/link';

type PostProps = {
  post: {
    id: number;
    title: string;
    content: string;
  } | null;
};

export default function PostPage({ post }: PostProps) {
  if (!post) return <p>Post not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/">
        <a>← Back to Home</a>
      </Link>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(params?.id) },
  });

  return {
    props: { post },
  };
};