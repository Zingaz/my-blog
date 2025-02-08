// pages/api/posts/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // GET: Retrieve a single post
  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });
      if (!post) return res.status(404).json({ error: 'Post not found' });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving post' });
    }
  }

  // PUT: Update a post (authenticated users only)
  if (req.method === 'PUT') {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { title, content } = req.body;
    try {
      const updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: { title, content },
      });
      return res.status(200).json(updatedPost);
    } catch (error) {
      return res.status(500).json({ error: 'Error updating post' });
    }
  }

  // DELETE: Delete a post (authenticated users only)
  if (req.method === 'DELETE') {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      await prisma.post.delete({
        where: { id: Number(id) },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting post' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}