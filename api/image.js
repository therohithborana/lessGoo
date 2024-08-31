import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

export default async function handler(req, res) {
  const { code } = req.query;
  if (req.method === 'GET') {
    try {
      const snapshot = await db.ref(`imageCodes/${code}`).once('value');
      const data = snapshot.val();
      if (data && data.url) {
        res.json({ url: data.url });
      } else {
        res.status(404).json({ message: 'Image not found.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving image.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
