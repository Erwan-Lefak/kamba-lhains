export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Check credentials against environment variables
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ 
      success: true, 
      message: 'Authentication successful' 
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
}