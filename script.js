// Pencarian online
const searchInput = document.getElementById('searchInput');
const accountList = document.getElementById('accountList');

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  if (query.length === 0) {
    accountList.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Gagal fetch data');

    const results = await response.json();

    if (results.length === 0) {
      accountList.innerHTML = '<li>Tidak ada hasil ditemukan</li>';
      return;
    }

    accountList.innerHTML = results.map(d =>
      `<li><strong>${d.email}</strong> - ${d.type}</li>`
    ).join('');
  } catch (err) {
    accountList.innerHTML = `<li>Error: ${err.message}</li>`;
  }
});

// Setup Leaflet map
const map = L.map('map').setView([-6.200000, 106.816666], 11); // default Jakarta

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

let userMarker = null;

// Fungsi untuk lacak lokasi
function getLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung browser ini');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        userMarker = L.marker([lat, lng]).addTo(map);
      }

      map.setView([lat, lng], 15);
    },
    (err) => {
      alert('Gagal mendapatkan lokasi: ' + err.message);
    }
  );
}

// Fungsi toggle kamera depan
let cameraStream = null;
const cameraVideo = document.getElementById('camera');

async function toggleCamera() {
  if (cameraStream) {
    // Matikan kamera
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    cameraVideo.style.display = 'none';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    cameraVideo.srcObject = stream;
    cameraVideo.style.display = 'block';
    cameraStream = stream;
  } catch (err) {
    alert('Gagal akses kamera: ' + err.message);
  }
}
