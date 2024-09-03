# LessGoo

LessGoo is a Vercel-compatible version of the [ImageGoo](https://github.com/yourusername/imagegoo) project. It provides the same functionality for uploading, sharing, and accessing images using unique 4-character codes, but is structured to work with Vercel's serverless deployment model.

![image](https://github.com/user-attachments/assets/17be8e55-53a3-4449-ad55-85f60fb59361)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Overview

LessGoo is a modified version of ImageGoo, designed specifically for deployment on Vercel. The core functionality remains the same, but the backend is implemented using serverless functions located in the `app` directory.

## Features

- Image upload functionality
- Generation of shareable links for uploaded images
- Unique 4-character code assignment for each uploaded image
- Image lookup using 4-character codes
- Optimized for Vercel deployment

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lessgoo.git
   cd lessgoo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   FIREBASE_TYPE=
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_CLIENT_ID=
   FIREBASE_AUTH_URI=
   FIREBASE_TOKEN_URI=
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
   FIREBASE_CLIENT_X509_CERT_URL=
   FIREBASE_UNIVERSE_DOMAIN=
   FIREBASE_DATABASE_URL=
   FIREBASE_STORAGE_BUCKET=
   ```
   Replace the empty values with your Firebase project details.

## Usage

The usage of LessGoo is similar to ImageGoo. Users can upload images and receive a unique 4-character code for accessing the image later.

## Deployment

To deploy LessGoo on Vercel:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to your Vercel account:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

Follow the prompts to complete the deployment process. Make sure to set up your environment variables in the Vercel dashboard.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Vercel Serverless Functions
- Database and Storage: Firebase (Realtime Database and Storage)
- Additional libraries: Multer, UUID

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
