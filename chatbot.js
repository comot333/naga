function pesan() {
  const pesanInput = document.getElementById("pesan");
  const teksPesan = pesanInput.value.trim();
  if (!teksPesan) return;

  const waktu = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  // Pesan user
  tambahPesan(teksPesan, 'user', waktu);
  simpanRiwayat(teksPesan, 'user', waktu);

  // Pesan AI (loading)
  const pAI = tambahPesan("...", 'ai', waktu);
  scrollToBottom();

  geminiChatAi(teksPesan).then((balasan) => {
    pAI.querySelector('.text').textContent = balasan;
    pAI.querySelector('.timestamp').textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    simpanRiwayat(balasan, 'ai', new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    scrollToBottom();
  });

  pesanInput.value = "";
}

function tambahPesan(teks, tipe, waktu) {
  const p = document.createElement("p");
  p.classList.add(tipe);
  p.innerHTML = `<span class="text">${teks}</span><span class="timestamp">${waktu}</span>`;
  document.getElementById("out").appendChild(p);
  return p;
}

function simpanRiwayat(teks, tipe, waktu) {
  let riwayat = JSON.parse(localStorage.getItem("chatHistory")) || [];
  riwayat.push({teks, tipe, waktu});
  localStorage.setItem("chatHistory", JSON.stringify(riwayat));
}

function loadRiwayat() {
  let riwayat = JSON.parse(localStorage.getItem("chatHistory")) || [];
  riwayat.forEach(r => tambahPesan(r.teks, r.tipe, r.waktu));
}

function bukaRiwayat() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  let riwayat = JSON.parse(localStorage.getItem("chatHistory")) || [];
  riwayat.forEach(r => {
    let div = document.createElement("div");
    div.textContent = `[${r.waktu}] ${r.teks}`;
    list.appendChild(div);
  });

  let modal = document.getElementById("history-modal");
  modal.classList.remove("show"); // reset animasi
  modal.style.display = "block"; // pastikan kelihatan

  setTimeout(() => {
    modal.classList.add("show");
  }, 10);
}

function tutupRiwayat() {
  let modal = document.getElementById("history-modal");
  modal.classList.remove("show");

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function geminiChatAi(prompt) {
  const apiKey = "AIzaSyCKL8eHPo_zf3w3vkqB5vtypp5hn9oV1dI";
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  )
  .then(res => res.json())
  .then(data => data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respons");
}

function handleKeyPress(e) {
  if (e.key === 'Enter') pesan();
}

function scrollToBottom() {
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
}

window.addEventListener('load', loadRiwayat);    p2.style.background = "rgba(255, 200, 200, 0.95)";
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
