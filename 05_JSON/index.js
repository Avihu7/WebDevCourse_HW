const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
// if not exist, set to empty array
// 
let songs = JSON.parse(localStorage.getItem('playlist')) || [];

// User Click the Add Button
form.addEventListener('submit', (e) => {
    // Don't submit the form to the server yet, let me handle it with JavaScript
    e.preventDefault();

    // Read Forms Data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;

  
    // TODO VALIDATE FIELDS
    const song = {
        id: Date.now(),  // Unique ID
        title: title,
        url: url,
        dateAdded: Date.now()
    };

   
    songs.push(song);
    saveAndRender();

    //TO DO SAVE  AND RERENDER 

    form.reset();
});

// Save to Local Storage and render UI Table
function saveAndRender() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs();
    //TODO RELOAD UI
}

function renderSongs() {
    list.innerHTML = ''; // Clear current list

    songs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');
       
        row.innerHTML = `
            <td>${song.title}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}
