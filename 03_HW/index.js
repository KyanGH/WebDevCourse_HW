// -------------------------------------------
// GLOBAL SONG LIST
// -------------------------------------------
let songs = JSON.parse(localStorage.getItem("songs")) || [];

// -------------------------------------------
// ON PAGE LOAD
// -------------------------------------------
window.onload = () => {
  renderSongs();
};

// -------------------------------------------
// TOGGLE VIEW (TABLE <-> CARDS)
// -------------------------------------------
document.getElementById("toggleViewBtn").addEventListener("click", function () {
  const table = document.querySelector("table");
  const cards = document.getElementById("cardsView");
  const icon = document.getElementById("toggleIcon");

  if (table.classList.contains("d-none")) {
    // Switch TO TABLE VIEW
    table.classList.remove("d-none");
    cards.classList.add("d-none");

    icon.src = "https://img.icons8.com/material-outlined/24/ffffff/grid.png"; // grid icon
  } else {
    // Switch TO CARDS VIEW
    table.classList.add("d-none");
    cards.classList.remove("d-none");

    icon.src = "https://img.icons8.com/material-outlined/24/ffffff/table.png"; // table icon
  }
});

// -------------------------------------------
// EXTRACT YOUTUBE VIDEO ID
// -------------------------------------------
function extractYouTubeID(url) {
  const patterns = [
    /v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /embed\/([^?]+)/
  ];
  for (let p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

// -------------------------------------------
// FETCH REAL YOUTUBE TITLE (no API key)
// -------------------------------------------
async function fetchYouTubeTitle(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);

    if (!res.ok) return null;
    const data = await res.json();
    return data.title;
  } catch (e) {
    return null;
  }
}

// -------------------------------------------
// ADD OR UPDATE SONG
// -------------------------------------------
document.getElementById("songForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("songId").value;
  const url = document.getElementById("url").value.trim();
  const rating = parseInt(document.getElementById("rating").value);

  const videoId = extractYouTubeID(url);
  if (!videoId) {
    alert("Invalid YouTube URL");
    return;
  }

  let title = document.getElementById("title").value.trim();

  if (title === "") {
    const fetchedTitle = await fetchYouTubeTitle(videoId);
    if (fetchedTitle) title = fetchedTitle;
  }

  if (id) {
    // UPDATE
    const song = songs.find((s) => s.id == id);
    song.title = title;
    song.url = url;
    song.videoId = videoId;
    song.rating = rating;
  } else {
    // ADD NEW
    songs.push({
      id: Date.now(),
      title,
      url,
      videoId,
      rating,     // ✅ FIXED
      createdAt: Date.now(),
    });
  }

  saveSongs();
  renderSongs();
  this.reset();
  document.getElementById("songId").value = "";
  document.getElementById("submitBtn").innerHTML = '<i class="fas fa-plus"></i> Add';
});

// -------------------------------------------
// SAVE TO LOCAL STORAGE
// -------------------------------------------
function saveSongs() {
  localStorage.setItem("songs", JSON.stringify(songs));
}

// -------------------------------------------
// DELETE SONG
// -------------------------------------------
function deleteSong(id) {
  songs = songs.filter((s) => s.id !== id);
  saveSongs();
  renderSongs();
}

// -------------------------------------------
// EDIT SONG
// -------------------------------------------
function editSong(id) {
  const song = songs.find((s) => s.id === id);

  document.getElementById("songId").value = song.id;
  document.getElementById("title").value = song.title;
  document.getElementById("url").value = song.url;
  document.getElementById("rating").value = song.rating;   // ✅ FIXED

  document.getElementById("submitBtn").innerHTML =
    '<i class="fas fa-save"></i> Save';
}

// -------------------------------------------
// SEARCH + SORT LISTENERS
// -------------------------------------------
document.getElementById("search").addEventListener("input", renderSongs);

document.querySelectorAll('input[name="sort"]').forEach(radio => {
  radio.addEventListener("change", renderSongs);
});

// -------------------------------------------
// RENDER SONG LIST
// -------------------------------------------
function renderSongs() {
  const search = document.getElementById("search").value.toLowerCase();
  const selectedSort = document.querySelector('input[name="sort"]:checked').value;

  let filtered = songs.filter(s =>
    s.title.toLowerCase().includes(search)
  );

  if (selectedSort === "name") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }
  else if (selectedSort === "date") {
    filtered.sort((a, b) => a.createdAt - b.createdAt);
  }
  else if (selectedSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const tbody = document.getElementById("songList");
  tbody.innerHTML = "";

  filtered.forEach(song => {
    const thumbnail = `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${thumbnail}" width="120" class="rounded border" /></td>
      <td>${song.title}</td>
      <td><a href="${song.url}" target="_blank">Open</a></td>
      <td>${song.rating}/10</td>
      <td class="text-end">
  <button class="btn btn-sm btn-primary me-2" onclick="playSong('${song.videoId}', '${song.title.replace(/'/g, "\\'")}')">
    <i class="fas fa-play"></i>
  </button>

  <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
    <i class="fas fa-edit"></i>
  </button>

  <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
    <i class="fas fa-trash"></i>
  </button>
</td>
    `;

    tbody.appendChild(tr);
  });

// ---------------------------
// RENDER CARDS VIEW
// ---------------------------
const cards = document.getElementById("cardsView");
cards.innerHTML = "";

filtered.forEach(song => {
  const thumbnail = `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`;

  const col = document.createElement("div");
  col.className = "col-md-4";

  col.innerHTML = `
    <div class="card bg-dark text-white h-100 shadow border-primary">
      <img src="${thumbnail}" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title">${song.title}</h5>
        <p class="card-text">Rating: ${song.rating}/10</p>
      </div>
      <div class="card-footer text-end">
        <button class="btn btn-sm btn-primary me-2" onclick="playSong('${song.videoId}', '${song.title.replace(/'/g, "\\'")}')">
          <i class="fas fa-play"></i>
        </button>
        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  cards.appendChild(col);
});


}

// -------------------------------------------
// PLAY SONG IN MODAL PLAYER
// -------------------------------------------
function playSong(videoId, title) {
  const modal = new bootstrap.Modal(document.getElementById("playerModal"));

  document.getElementById("playerTitle").textContent = title;
  document.getElementById("playerIframe").src =
    `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  modal.show();

  // Stop video when modal is closed
  document.getElementById("playerModal").addEventListener("hidden.bs.modal", () => {
    document.getElementById("playerIframe").src = "";
  });
}
