document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("image-upload");
  const uploadButton = document.getElementById("upload-button");
  const downloadButton = document.getElementById("download-button");
  const copyLinkButton = document.getElementById("copy-link-button");
  const selectedFileAlert = document.getElementById("selected-file-alert");
  const selectedFileName = document.getElementById("selected-file-name");
  const shareableLinkSection = document.getElementById("shareable-link-section");
  const shareableLinkElement = document.getElementById("shareable-link");
  const imageCodeElement = document.getElementById("image-code");
  const qrCodeImg = document.getElementById("qr-code");

  let selectedFile = null;
  let fileURL = '';
  let fileCode = '';

  fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      selectedFile = file;
      selectedFileName.textContent = file.name;
      selectedFileAlert.style.display = "block";
      shareableLinkSection.style.display = "none";
      uploadButton.disabled = false;
    }
  });

  uploadButton.addEventListener("click", async function() {
    if (selectedFile) {
      uploadButton.disabled = true;

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        console.log('Upload response data:', data); // Debugging statement

        if (data.link) {
          fileURL = data.link;
          fileCode = data.code;
          shareableLinkElement.innerHTML = `<a href="${fileURL}" target="_blank">${fileURL}</a>`;
          imageCodeElement.textContent = fileCode;
          shareableLinkSection.style.display = "block";

          // Generate QR code using the API
          qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fileURL)}`;
        } else {
          throw new Error('No link returned');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading file.');
      }
    }
  });

  copyLinkButton.addEventListener("click", function() {
    const url = window.getImageURL ? window.getImageURL() : fileURL; // Use URL from lookup if available
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard!');
      }).catch((err) => {
        console.error('Failed to copy URL:', err);
        alert('Failed to copy URL.');
      });
    }
  });

  downloadButton.addEventListener("click", function() {
    const url = window.getImageURL ? window.getImageURL() : fileURL; // Use URL from lookup if available
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image'; // Default filename; you may need to update this based on your use case
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });

  // Initially hide download and copy link buttons
  downloadButton.style.display = 'none';
  copyLinkButton.style.display = 'none';

  // Show download and copy link buttons after a successful lookup
  window.showDownloadAndCopyButtons = function(imageURL) {
    downloadButton.style.display = 'inline-block';
    copyLinkButton.style.display = 'inline-block';
    // Set the imageURL for download and copy functions
    window.getImageURL = function() {
      return imageURL;
    };
  };
});
