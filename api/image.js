const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
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
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

const db = admin.database();

export default async function handler(req, res) {
  console.log('Received request:', req.method, req.url);

  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.query;
  console.log('Received code:', code);

  if (!code) {
    console.log('No code provided');
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    console.log('Querying Firebase for code:', code);
    const snapshot = await db.ref(`imageCodes/${code}`).once('value');
    const data = snapshot.val();
    console.log('Firebase response:', data);

    if (data && data.url) {
      console.log('Redirecting to:', data.url);
      res.writeHead(302, { Location: data.url });
      res.end();
    } else {
      console.log('Image not found for code:', code);
      res.status(404).json({ message: 'Image not found.' });
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ message: 'Error retrieving image.', error: error.message });
  }
}
