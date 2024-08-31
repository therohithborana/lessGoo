import admin from 'firebase-admin';
import multer from 'multer';
import { IncomingForm } from 'formidable';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const bucket = admin.storage().bucket();
const db = admin.database();

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).send('Error parsing form.');
      }

      const file = files.file[0];
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }

      try {
        const blob = bucket.file(file.originalFilename);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on('error', (error) => {
          console.error('Error uploading to Firebase Storage:', error);
          res.status(500).send('Error uploading file.');
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.originalFilename)}?alt=media`;

          const code = uuidv4().slice(0, 4);
          try {
            await db.ref(`imageCodes/${code}`).set({ url: publicUrl });
            res.json({ link: publicUrl, code: code });
          } catch (error) {
            res.status(500).send('Error storing data.');
          }
        });

        blobStream.end(file.buffer);
      } catch (error) {
        res.status(500).send('Error processing upload.');
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
