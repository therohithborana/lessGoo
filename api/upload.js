import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';

const upload = multer({ storage: multer.memoryStorage() });

const bucket = admin.storage().bucket();
const db = admin.database();

export default async (req, res) => {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Error processing file upload:', err);
        return res.status(500).send('Error processing file upload.');
      }

      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      try {
        const file = bucket.file(req.file.originalname);
        const blobStream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        blobStream.on('error', (error) => {
          console.error('Error uploading to Firebase Storage:', error);
          res.status(500).send('Error uploading file.');
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(req.file.originalname)}?alt=media`;

          const code = uuidv4().slice(0, 4);
          try {
            await db.ref(`imageCodes/${code}`).set({ url: publicUrl });
            res.json({ link: publicUrl, code: code });
          } catch (error) {
            console.error('Error storing data in Firebase Realtime Database:', error);
            res.status(500).send('Error storing data.');
          }
        });

        blobStream.end(req.file.buffer);
      } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).send('Error processing upload.');
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
