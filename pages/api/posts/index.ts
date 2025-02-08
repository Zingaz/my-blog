// pages/api/posts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: List all posts
  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching posts' });
    }
  }

  // POST: Create a new post (authenticated users only)
  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content } = req.body;
    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          author: { connect: { email: session.user?.email! } },
        },
      });
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Error creating post' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}