import { getAllTemplates } from '../../../lib/emailTemplates.ts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const templates = getAllTemplates();
    res.status(200).json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des templates' });
  }
}
