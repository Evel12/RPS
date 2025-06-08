function showAlert(message, type, redirectUrl, isLoginSuccess, username) {
    // Remove existing alerts
    document.querySelectorAll('.custom-alert').forEach(alert => alert.remove());

    // Create alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>${type === 'success' ? 'Selamat!' : 'Error!'}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('fade-out');
            setTimeout(() => {
                alertDiv.remove();
                if (isLoginSuccess) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username || '');
                } else if (type === 'danger') {
                    localStorage.removeItem('isLoggedIn');
                }
                window.location.href = redirectUrl;
            }, 300);
        }
    }, 3000);

    // Manual close
    alertDiv.querySelector('.btn-close').addEventListener('click', () => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('fade-out');
        setTimeout(() => {
            alertDiv.remove();
            if (isLoginSuccess) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username || '');
            } else if (type === 'danger') {
                localStorage.removeItem('isLoggedIn');
            }
            window.location.href = redirectUrl;
        }, 300);
    });
}