// Data Kamar
const rooms = [
    {
        type: "superior",
        name: "Superior Room",
        price: 2500000,
        description: "Ruang istirahat nyaman dengan sentuhan modern, menghadirkan pengalaman menginap berkualitas dengan harga terjangkau.",
        features: [
            "Luas ruangan: 30 m²",
            "Untuk 2 orang",
            "Sarapan gratis",
            "WiFi gratis"
        ]
    },
    {
        type: "premium",
        name: "Premium Room",
        price: 4000000,
        description: "Kamar elegan dengan desain kontemporer dan panorama indah, sempurna untuk melepas penat bersama orang terdekat.",
        features: [
            "Luas ruangan: 45 m²",
            "Untuk 2 orang",
            "Sarapan gratis",
            "WiFi gratis",
            "Balkon pribadi"
        ]
    },
    {
        type: "royal",
        name: "Royal Suite",
        price: 7500000,
        description: "Didesain eksklusif dengan fasilitas premium dan view menawan, pilihan tepat bagi pebisnis maupun wisatawan bergaya.",
        features: [
            "Luas ruangan: 60 m²",
            "Untuk 4 orang",
            "Sarapan gratis",
            "WiFi gratis",
            "Balkon dengan pemandangan kota",
            "Akses ke lounge executive"
        ]
    },
    {
        type: "presidential",
        name: "Presidential Suite",
        price: 15000000,
        description: "Simbol kemewahan sejati, dilengkapi ruang tamu megah, balkon pribadi, dan layanan eksklusif untuk pengalaman menginap tak terlupakan.",
        features: [
            "Luas ruangan: 100 m²",
            "Untuk 4 orang",
            "Sarapan gratis",
            "WiFi gratis",
            "Balkon pribadi dengan pemandangan premium",
            "Akses ke lounge executive",
            "Layanan butler 24 jam",
            "Kamar mandi mewah dengan spa"
        ]
    }
];

// State (penyimpanan sementara) untuk data booking
const bookingState = {
    roomType: "superior",      // tipe kamar yang dipilih
    roomPrice: 2500000,        // harga kamar
    checkIn: null,             // tanggal check-in
    checkOut: null,            // tanggal check-out
    nights: 1,                 // jumlah malam
    adults: 2,                 // jumlah dewasa
    children: 0,               // jumlah anak
    discountAmount: 500000,    // diskon
    currentStep: 1,            // langkah saat ini di form booking
    isProcessing: false        // status proses pembayaran
};

// Ambil elemen dari HTML (form, input, tombol, dll)
const elements = {
    roomSelection: document.getElementById('room-selection'),
    checkin: document.getElementById('checkin'),
    checkout: document.getElementById('checkout'),
    adults: document.getElementById('adults'),
    children: document.getElementById('children'),
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    specialRequests: document.getElementById('specialRequests'),
    confirmButton: document.getElementById('next-to-step-4')
};

// Fungsi bantu 
// Format tanggal jadi YYYY-MM-DD (buat input form)
const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Ubah format tanggal biar lebih enak dibaca (contoh: 1 Januari 2025)
const formatDateDisplay = dateString => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Ubah angka jadi format Rupiah
const formatCurrency = amount => `Rp ${amount.toLocaleString('id-ID')}`;

// Hitung jumlah malam dari check-in dan check-out
const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const timeDiff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
};

// Simulasi proses pembayaran (pake delay 2-4 detik)
const processPayment = async (paymentMethod) => {
    const delay = Math.floor(Math.random() * 2000) + 2000;
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% kemungkinan berhasil
            const isSuccess = Math.random() > 0.1;
            
            if (isSuccess) {
                resolve({
                    success: true,
                    message: "Pembayaran berhasil diproses",
                    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                });
            } else {
                reject({
                    success: false,
                    message: "Pembayaran gagal. Silakan coba lagi atau gunakan metode pembayaran lain."
                });
            }
        }, delay);
    });
};

// Fungsi untuk menampilkan pilihan kamar
const generateRoomOptions = () => {
    elements.roomSelection.innerHTML = '';
    
    rooms.forEach((room, index) => {
        const isSelected = index === 0 ? 'selected' : '';
        const featuresList = room.features.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('');
        
        const roomOption = document.createElement('div');
        roomOption.className = `room-option ${isSelected}`;
        roomOption.dataset.roomType = room.type;
        roomOption.dataset.roomPrice = room.price;
        
        roomOption.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="room-type">${room.name}</h4>
                <div class="room-price">${formatCurrency(room.price)} <small>/malam</small></div>
            </div>
            <p class="room-description">${room.description}</p>
            <ul class="room-features">${featuresList}</ul>
            <button type="button" class="btn btn-outline-primary btn-sm">Pilih Kamar</button>
        `;
        
        elements.roomSelection.appendChild(roomOption);
    });

    // Saat user klik kamar, update pilihan
    document.querySelectorAll('.room-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.room-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            const roomType = option.dataset.roomType;
            const room = rooms.find(r => r.type === roomType);
            
            if (room) {
                bookingState.roomType = room.type;
                bookingState.roomPrice = room.price;
                updateBookingSummary();
            }
        });
    });
};

// Fungsi untuk update ringkasan booking (total harga, pajak, dll)
const updateBookingSummary = () => {
    bookingState.nights = calculateNights(elements.checkin.value, elements.checkout.value);
    
    const subtotal = bookingState.roomPrice * bookingState.nights;
    const tax = subtotal * 0.1;
    const total = subtotal + tax - bookingState.discountAmount;
    
    const room = rooms.find(r => r.type === bookingState.roomType);
    
    document.getElementById('summary-room-type').textContent = room.name;
    document.getElementById('summary-room-price').textContent = formatCurrency(bookingState.roomPrice);
    document.getElementById('summary-nights').textContent = `${bookingState.nights} Malam`;
    document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summary-tax').textContent = formatCurrency(tax);
    document.getElementById('summary-discount').textContent = `- ${formatCurrency(bookingState.discountAmount)}`;
    document.getElementById('summary-total').textContent = formatCurrency(total);
};

// Fungsi untuk update detail konfirmasi sebelum bayar
const updateConfirmationDetails = () => {
    const room = rooms.find(r => r.type === bookingState.roomType);
    
    document.getElementById('confirm-room-type').textContent = room.name;
    document.getElementById('confirm-nights').textContent = `${bookingState.nights} Malam`;
    document.getElementById('confirm-checkin').textContent = formatDateDisplay(bookingState.checkIn);
    document.getElementById('confirm-checkout').textContent = formatDateDisplay(bookingState.checkOut);
    document.getElementById('confirm-guests').textContent = `${bookingState.adults} Dewasa, ${bookingState.children} Anak`;
    
    document.getElementById('confirm-name').textContent = `${elements.firstName.value} ${elements.lastName.value}`;
    document.getElementById('confirm-email').textContent = elements.email.value;
    document.getElementById('confirm-phone').textContent = elements.phone.value;
    
    const specialRequests = elements.specialRequests.value;
    document.getElementById('confirm-requests').textContent = specialRequests || 'Tidak ada';
    
    const subtotal = bookingState.roomPrice * bookingState.nights;
    const tax = subtotal * 0.1;
    const total = subtotal + tax - bookingState.discountAmount;
    
    document.getElementById('confirm-total').textContent = formatCurrency(total);
};

// Fungsi untuk update tampilan setelah booking berhasil
const updateSuccessScreen = () => {
    const room = rooms.find(r => r.type === bookingState.roomType);
    
    document.getElementById('success-room-type').textContent = room.name;
    document.getElementById('success-checkin').textContent = formatDateDisplay(bookingState.checkIn);
    document.getElementById('success-checkout').textContent = formatDateDisplay(bookingState.checkOut);
    
    const subtotal = bookingState.roomPrice * bookingState.nights;
    const tax = subtotal * 0.1;
    const total = subtotal + tax - bookingState.discountAmount;
    
    document.getElementById('success-total').textContent = formatCurrency(total);
    
    // Buat kode booking random
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('booking-code').textContent = `AUR-${new Date().getFullYear()}-${randomNum}`;
};

// Fungsi navigasi antar langkah (step form booking)
const goToStep = stepNumber => {
    // Sembunyikan semua step
    document.querySelectorAll('.step-content').forEach(step => step.classList.remove('active'));
    
    // Tampilkan step saat ini
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update indikator step
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) step.classList.add('active');
        else if (stepNum < stepNumber) step.classList.add('completed');
    });
    
    bookingState.currentStep = stepNumber;
    
    if (stepNumber === 3) updateConfirmationDetails();
    if (stepNumber === 4) updateSuccessScreen();
};

// Validasi form (cek field kosong, validasi email)
const validateForm = () => {
    const requiredFields = [elements.firstName, elements.lastName, elements.email, elements.phone];
    
    for (const field of requiredFields) {
        if (!field.value.trim()) {
            alert('Harap isi semua field yang wajib diisi!');
            field.focus();
            return false;
        }
    }
    
    if (!elements.email.value.includes('@') || !elements.email.value.includes('.')) {
        alert('Format email tidak valid!');
        elements.email.focus();
        return false;
    }
    
    return true;
};

// Fungsi async untuk konfirmasi & proses pembayaran
const handlePaymentConfirmation = async () => {
    if (bookingState.isProcessing) return;
    
    try {
        // Tampilkan loading
        bookingState.isProcessing = true;
        elements.confirmButton.disabled = true;
        elements.confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        
        // Ambil metode pembayaran yang dipilih
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
        
        // Tunggu hasil pembayaran
        const paymentResult = await processPayment(paymentMethod);
        
        if (paymentResult.success) {
            goToStep(4); // lanjut ke step sukses
        } else {
            throw new Error(paymentResult.message);
        }
    } catch (error) {
        alert(error.message);
    } finally {
        // Reset loading
        bookingState.isProcessing = false;
        elements.confirmButton.disabled = false;
        elements.confirmButton.textContent = 'Konfirmasi & Bayar';
    }
};

// Fungsi untuk reset form booking setelah selesai
const resetForm = () => {
    // Reset input data tamu
    elements.firstName.value = '';
    elements.lastName.value = '';
    elements.email.value = '';
    elements.phone.value = '';
    elements.specialRequests.value = '';
    
    // Reset pilihan kamar
    document.querySelectorAll('.room-option').forEach((option, index) => {
        option.classList.toggle('selected', index === 0);
    });
    
    // Reset state
    bookingState.roomType = "superior";
    bookingState.roomPrice = 2500000;
    bookingState.adults = 2;
    bookingState.children = 0;
    bookingState.isProcessing = false;
    
    // Reset tanggal
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    elements.checkin.value = formatDate(today);
    elements.checkout.value = formatDate(tomorrow);
    bookingState.checkIn = formatDate(today);
    bookingState.checkOut = formatDate(tomorrow);
    
    // Reset jumlah tamu
    elements.adults.value = 2;
    elements.children.value = 0;
    
    // Update ringkasan booking
    updateBookingSummary();
};

// Event Listener (aksi user di web)
const setupEventListeners = () => {
    // Saat user ganti tanggal check-in/check-out
    elements.checkin.addEventListener('change', () => {
        bookingState.checkIn = elements.checkin.value;
        updateBookingSummary();
    });
    
    elements.checkout.addEventListener('change', () => {
        bookingState.checkOut = elements.checkout.value;
        updateBookingSummary();
    });
    
    // Saat user ubah jumlah tamu
    elements.adults.addEventListener('change', () => {
        bookingState.adults = parseInt(elements.adults.value);
    });
    
    elements.children.addEventListener('change', () => {
        bookingState.children = parseInt(elements.children.value);
    });
    
    // Navigasi antar step
    document.getElementById('next-to-step-2').addEventListener('click', () => goToStep(2));
    document.getElementById('back-to-step-1').addEventListener('click', () => goToStep(1));
    document.getElementById('next-to-step-3').addEventListener('click', () => validateForm() && goToStep(3));
    document.getElementById('back-to-step-2').addEventListener('click', () => goToStep(2));
    
    // Konfirmasi & bayar
    elements.confirmButton.addEventListener('click', handlePaymentConfirmation);
    
    // Tombol setelah booking berhasil
    document.getElementById('print-receipt').addEventListener('click', () => window.print());
    document.getElementById('new-booking').addEventListener('click', () => {
        resetForm();
        goToStep(1);
    });
};

// Inisialisasi halaman saat pertama kali dibuka
const initPage = () => {
    // Set tanggal default: hari ini & besok
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    elements.checkin.value = formatDate(today);
    elements.checkout.value = formatDate(tomorrow);
    bookingState.checkIn = formatDate(today);
    bookingState.checkOut = formatDate(tomorrow);
    
    generateRoomOptions();
    setupEventListeners();
    updateBookingSummary();
};

// Menjalankan Halaman Saat Udah Siap
document.addEventListener('DOMContentLoaded', initPage);
