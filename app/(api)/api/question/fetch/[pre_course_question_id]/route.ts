import { updateQuestion, deleteQuestion } from '@/lib/actions/user.actions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    
    if (req.method === 'PUT') {
      const question = await updateQuestion(id, req.body);
      return res.status(200).json(question);
    } else if (req.method === 'DELETE') {
      await deleteQuestion(id);
      return res.status(204).end();
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}