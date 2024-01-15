let counter = document.getElementById('seconds');
let count = 0;
let interval;
let songs = [
    'songs/club—chicken-on-a-raft.mp3',
    'songs/Metal-Madness.mp3',
    'songs/sad-piano—Reflections.mp3',
    'songs/folk—Hey-Oh,-Chicken-on-a-Raft.mp3',
    'songs/club—Dance-All-Night.mp3',
    'songs/jazz-Chicken-on-a-Raft.mp3',
    'songs/pop-Chicken-on-a-Raft.mp3',
    'songs/melodrama—chicken-sailors-ode.mp3',
    'songs/Chicken-on-a-Raft-(Opera-Edition).mp3',
    'songs/country-Chicken-on-a-Raft-(2)-heavy-metal-hard-hitting-intense.mp3',
    'songs/sad-piano—Shadows-on-the-Keys.mp3',
    'songs/Skippers-Lament.mp3',
    'songs/chicken-hallelujah.mp3',
    'songs/poppy-chicken-symphony.mp3',
]
let currentSongIndex = 0;


function startVideo() {
    let container = document.getElementById('container');
    let image = document.getElementById('startImage');
    container.removeChild(image);

    let video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('mute', '');
    let source = document.createElement('source');
    source.setAttribute('src', 'chicken-on-a-raft.mp4');
    source.setAttribute('type', 'video/mp4');
    video.appendChild(source);
    container.appendChild(video);

    let audio = document.getElementById('audio');
    audio.play();

    video.onclick = function () {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        audio.src = songs[currentSongIndex];
        audio.play();
    };


    document.getElementById('counter-container').style.display = 'block';

    interval = setInterval(function () {
        count++;
        counter.innerText = count;
    }, 1000);
}
