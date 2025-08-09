function pesan() {
  const pesanInput = document.getElementById("pesan");
  const pesan = pesanInput.value.trim();
  
  // Jangan kirim pesan kosong
  if (!pesan) return;

  const p = document.createElement("p");
  const p2 = document.createElement("p");
  
  // Pesan dari user
  p.textContent = pesan;
  p.style.marginLeft = "auto";
  p.style.background = "linear-gradient(135deg, #667eea, #764ba2)";
  p.style.color = "white";
  
  document.getElementById("out").appendChild(p);
  
  // Indikator sedang mengetik
  p2.innerHTML = "🤖 <span class='typing-indicator'>sedang mengetik</span>";
  p2.style.marginRight = "auto";
  p2.style.background = "rgba(255, 255, 255, 0.95)";
  p2.style.color = "#666";
  
  document.getElementById("out").appendChild(p2);

  // Auto scroll ke bawah
  scrollToBottom();

  geminiChatAi(pesan).then((balas) => {
    p2.textContent = `🤖 ${balas}`;
    p2.style.background = "rgba(255, 255, 255, 0.95)";
    p2.style.color = "#333";
    scrollToBottom();
  }).catch((error) => {
    p2.textContent = "🤖 Maaf, terjadi kesalahan. Silakan coba lagi.";
    p2.style.background = "rgba(255, 200, 200, 0.95)";
    p2.style.color = "#d32f2f";
    scrollToBottom();
  });

  // Kosongkan input dan fokus kembali
  pesanInput.value = "";
  pesanInput.focus();
}

function geminiChatAi(prompt) {
  const apiKey = "AIzaSyCKL8eHPo_zf3w3vkqB5vtypp5hn9oV1dI";
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("API error:", data);
        throw new Error("Tidak ada respons dari AI");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
}

// Fungsi untuk menangani tombol Enter
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    pesan();
  }
}

// Fungsi untuk scroll otomatis ke bawah
function scrollToBottom() {
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}

// Auto fokus ke input saat halaman dimuat
window.addEventListener('load', () => {
  document.getElementById('pesan').focus();
});