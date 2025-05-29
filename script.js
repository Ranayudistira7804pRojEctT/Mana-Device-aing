let map;
let cameraStream;

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung oleh browser ini.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      if (!map) {
        map = L.map('map').setView([lat, lon], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      } else {
        map.setView([lat, lon], 16);
      }

      L.marker([lat, lon]).addTo(map)
        .bindPopup("Lokasi kamu sekarang")
        .openPopup();
    },
    (error) => {
      alert("Gagal mendapatkan lokasi: " + error.message);
    }
  );
}

function toggleCamera() {
  const video = document.getElementById("camera");

  if (cameraStream) {
    // Matikan kamera
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.style.display = "none";
  } else {
    // Nyalakan kamera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        video.style.display = "block";
      })
      .catch(err => {
        alert("Gagal mengakses kamera: " + err.message);
      });
  }
}
