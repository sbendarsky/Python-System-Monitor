


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    let shouldSubmit = true; // Flag to determine whether the form should be submitted.

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!shouldSubmit) {
            return; // If shouldSubmit is false, prevent form submission.
        }

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Perform your server-side validation here using fetch API.
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            // Successful login, redirect to the dashboard or homepage.
            window.location.href = '/';
        } else {
            // Show error message for invalid credentials.
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'block';
        }
    });
});
