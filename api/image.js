const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const snapshot = await db.ref(`imageCodes/${code}`).once('value');
    const data = snapshot.val();
    if (data && data.url) {
      // Redirect to the image URL instead of returning JSON
      res.redirect(301, data.url);
    } else {
      res.status(404).json({ message: 'Image not found.' });
    }
  } catch (error) {
    console.error('Error retrieving image from Firebase Realtime Database:', error);
    res.status(500).json({ message: 'Error retrieving image.' });
  }
}
