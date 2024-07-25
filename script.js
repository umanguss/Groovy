document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const playPauseButton = document.getElementById("play-pause");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const volumeControl = document.getElementById("volume");
    const trackSlider = document.getElementById("track-slider");
    const currentTimeDisplay = document.getElementById("current-time");
    const totalDurationDisplay = document.getElementById("total-duration");
    const ribbon = document.getElementById("ribbon");
    const trackNameDisplay = document.getElementById("track-name");
    const albumPhoto = document.getElementById("album-photo");

    const hamBurger = document.querySelector(".fa-bars");
    const closeIcon = document.querySelector(".fa-times");
    const musicPlaylist = document.querySelector(".music-playlist");
    const pDiv = document.querySelector(".playlist-div");

    let isPlaying = false;
    let currentTrack = 0;
    let audioPosition = 0;

    // Array of Track URLs
    const trackList = [
        { name: "Shape of You", src: "audio/Shape of You.mp3", img: "images/shape.jpeg" },
        { name: "Blinding Lights", src: "audio/The Weeknd - Blinding Lights.mp3", img: "images/claus-grunstaudl-dKeB0-M9iiA-unsplash.jpg" },
        { name: "Mere Samne Wali Khidki Mein", src: "audio/Mere Samne Wali Khidki Mein.mp3", img: "images/icons8-team-7LNatQYMzm4-unsplash.jpg" },
        { name: "Navile", src: "audio/Navile-S-P-Balasubrahmanyam.mp3", img: "images/download.jpeg" },
        { name: "O Sajni Re", src: "audio/O Sajni Re.mp3", img: "images/Sajni-From-Laapataa-Ladies-Hindi-2024-20240212151002-500x500.jpg" },
        { name: "Ami je tomar", src: "audio/Ami je tomar.mp3", img: "images/kobu-agency-3hWg9QKl5k8-unsplash.jpg" },
        { name: "Illuminati", src: "audio/Illuminati.mp3", img: "images/james-owen-MuIvHRJbjA8-unsplash.jpg" },
        { name: "Dekha tenu", src: "audio/Dekha tenu.mp3", img: "images/adam-birkett-vISNAATFXlE-unsplash.jpg" },
        { name: "Sirivennela", src: "audio/Sirivennela.mp3", img: "images/syam.jpeg" },
        { name: "As It Was", src: "audio/As-It-Was.mp3", img: "images/asitwas.jpeg" },
        { name: "3 Peg", src: "audio/3 Peg Balie.mp3", img: "images/kobu-agency-3hWg9QKl5k8-unsplash.jpg" },
        { name: "Aankhein Khuli", src: "audio/Aankhein Khuli Mohabbatein.mp3", img: "images/markus-spiske-hU9gx8YfVK4-unsplash.jpg" },
        { name: "Chor Bazari", src: "audio/Chor Bazari.mp3", img: "images/adam-birkett-vISNAATFXlE-unsplash.jpg" },
        { name: "Khaab", src: "audio/Khaab.mp3", img: "images/icons8-team-7LNatQYMzm4-unsplash.jpg" },
        { name: "Lag Ja Gale Se Phir", src: "audio/Lag Ja Gale Se Phir.mp3", img: "images/kobu-agency-3hWg9QKl5k8-unsplash.jpg" },
        { name: "Mast Magan", src: "audio/Mast Magan.mp3", img: "images/markus-spiske-hU9gx8YfVK4-unsplash.jpg" },
        { name: "Mere Mehboob Mere Sanam", src: "audio/Mere Mehboob Mere Sanam.mp3", img: "images/adam-birkett-vISNAATFXlE-unsplash.jpg" },
        { name: "Perfect", src: "audio/Perfect.mp3", img: "images/icons8-team-7LNatQYMzm4-unsplash.jpg" },
        { name: "Prem Ki Naiyya", src: "audio/Prem Ki Naiyya.mp3", img: "images/kobu-agency-3hWg9QKl5k8-unsplash.jpg" },
        { name: "Tum Se Hi", src: "audio/Tum Se Hi.mp3", img: "images/markus-spiske-hU9gx8YfVK4-unsplash.jpg" }
    ];

    // Show PlayList
    function showPlayList() {
        musicPlaylist.style.display = "block";
        closeIcon.style.display = "block";
        hamBurger.style.display = "none";
    }

    // Hide PlayList
    function hidePlayList() {
        musicPlaylist.style.display = "none";
        closeIcon.style.display = "none";
        hamBurger.style.display = "block";
    }

    hamBurger.addEventListener("click", showPlayList);
    closeIcon.addEventListener("click", hidePlayList);

    // Display Tracks in playlist
    function displayTracks() {
        trackList.forEach((track, index) => {
            let div = document.createElement("div");
            div.classList.add("playlist");
            div.innerHTML = `
                <span class="song-index">${index + 1}</span>
                <p class="single-song">${track.name}</p>
            `;
            pDiv.appendChild(div);
        });
        playFromPlaylist();
    }

    displayTracks();

    // Play song from the playlist
    function playFromPlaylist() {
        pDiv.addEventListener("click", (e) => {
            if (e.target.classList.contains("single-song")) {
                const indexNum = trackList.findIndex((item) => item.name === e.target.innerHTML);
                loadTrack(indexNum);
                playSong();
                hidePlayList();
            }
        });
    }

    // Function to toggle between Play and Pause
    function togglePlayPause() {
        if (!isPlaying) {
            if (audioPosition === 0) {
                // Start from the beginning of the track
                audio.src = trackList[currentTrack].src;
            }
            audio.load();
            audio.currentTime = audioPosition; // Set the audio position
            audio.play()
                .then(() => {
                    playPauseButton.textContent = "❚❚";
                    isPlaying = true;
                    updateTrackInfo(currentTrack);

                    ribbon.style.display = "block"; // Show the ribbon
                    ribbon.classList.add("active");
                })
                .catch((error) => {
                    console.error("Audio Playback Error: " + error.message);
                });
        } else {
            audioPosition = audio.currentTime; // Store the current audio position
            audio.pause();
            playPauseButton.textContent = "►";
            ribbon.style.display = "none"; // Hide the ribbon
            isPlaying = false;
        }
    }

    playPauseButton.addEventListener("click", togglePlayPause);

    // Function to play the next track
    nextButton.addEventListener("click", function () {
        currentTrack = (currentTrack + 1) % trackList.length;
        playTrack(currentTrack);
    });

    // Function to play the previous track
    prevButton.addEventListener("click", function () {
        currentTrack = (currentTrack - 1 + trackList.length) % trackList.length;
        playTrack(currentTrack);
    });

    // Function to play a specific track
    function playTrack(trackIndex) {
        audio.src = trackList[trackIndex].src;
        audio.load();
        audio.play();
        playPauseButton.textContent = "❚❚";
        isPlaying = true;
        updateTrackInfo(trackIndex); // Updating the track info
    }

    // Function to load a specific track
    function loadTrack(trackIndex) {
        currentTrack = trackIndex;
        audio.src = trackList[trackIndex].src;
        audio.load();
        updateTrackInfo(trackIndex);
    }

    // Function to update the track info
    function updateTrackInfo(trackIndex) {
        const track = trackList[trackIndex];
        trackNameDisplay.textContent = track.name;
        albumPhoto.src = track.img;
    }

    volumeControl.addEventListener("input", function () {
        audio.volume = volumeControl.value;
    });

    // Update the audio time displays
    audio.addEventListener("timeupdate", function () {
        const currentTime = formatTime(audio.currentTime);
        const totalDuration = formatTime(audio.duration);
        currentTimeDisplay.textContent = currentTime;
        totalDurationDisplay.textContent = totalDuration;

        // Update the track slider as the audio plays
        const position = (audio.currentTime / audio.duration) * 100;
        trackSlider.value = position;
    });

    // Seek to a position when the user interacts with the track slider
    trackSlider.addEventListener("input", function () {
        const newPosition = (trackSlider.value / 100) * audio.duration;
        audio.currentTime = newPosition;
    });

    // Handle track ending and play the next track
    audio.addEventListener("ended", function () {
        currentTrack = (currentTrack + 1) % trackList.length;
        playTrack(currentTrack);
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    function playSong() {
        audio.play();
        playPauseButton.textContent = "❚❚";
        isPlaying = true;
    }
});
