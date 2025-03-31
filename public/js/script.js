document.getElementById('screenshot-btn').addEventListener('click', function () {
    // Show loading state
    this.textContent = 'Capturing...';
    this.disabled = true;

    // Get the HTML content to capture
    const element = document.getElementById('infographic');
    const htmlContent = element.outerHTML;

    // Send to backend for screenshot
    fetch('/capture-screenshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlContent })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pinterest-infographic.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Reset button
            this.textContent = 'Take Screenshot';
            this.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            this.textContent = 'Try Again';
            this.disabled = false;
        });
});