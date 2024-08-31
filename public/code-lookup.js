document.addEventListener("DOMContentLoaded", function () {
    const codeInput = document.getElementById("code-input");
    const lookupButton = document.getElementById("lookup-button");
    const lookupResult = document.getElementById("lookup-result");
    const resultMessage = document.getElementById("result-message");

    lookupButton.addEventListener("click", async function () {
        const code = codeInput.value.trim();

        if (code.length === 4) {
            try {
                const response = await fetch(`/api/image?code=${code}`);
                const data = await response.json();

                if (response.ok) {
                    // Display the URL to the user
                    resultMessage.innerHTML = `Image URL: <a href="${data.url}" target="_blank">${data.url}</a>`;
                } else {
                    resultMessage.textContent = data.message || 'Invalid code or code expired. Please check and try again.';
                }
                lookupResult.style.display = 'block';
            } catch (error) {
                console.error('Error looking up code:', error);
                resultMessage.textContent = 'An error occurred. Please try again later.';
                lookupResult.style.display = 'block';
            }
        } else {
            resultMessage.textContent = 'Please enter a valid 4-character code.';
            lookupResult.style.display = 'block';
        }
    });
});
