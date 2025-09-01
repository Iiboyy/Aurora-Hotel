// js/login.js

// Fungsi untuk validasi email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Fungsi untuk menampilkan alert
function showAlert(message, type) {
    // Hapus alert sebelumnya jika ada
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Buat elemen alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Tambahkan alert ke dalam form
    document.querySelector('.login-form').prepend(alertDiv);
}

// Fungsi untuk menangani submit form login
function handleLoginFormSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validasi sederhana
    if (!validateEmail(email)) {
        showAlert('Masukkan alamat email yang valid', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password harus minimal 6 karakter', 'error');
        return;
    }
    
    // Simulasi login berhasil
    showAlert('Login berhasil! Mengarahkan ke halaman utama...', 'success');
    
    // Simpan status login di localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    // Redirect ke halaman utama setelah 2 detik
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 2000);
}

// Fungsi untuk toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Fungsi untuk cek status login
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Jika sudah login, redirect ke halaman utama
        window.location.href = 'index.html';
    }
}

// Fungsi untuk inisialisasi event listeners
function initializeEventListeners() {
    // Toggle password visibility
    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
    }
}

// Fungsi untuk inisialisasi halaman login
function initializeLoginPage() {
    checkLoginStatus();
    initializeEventListeners();
}

// Jalankan inisialisasi ketika DOM sudah dimuat
document.addEventListener('DOMContentLoaded', initializeLoginPage);