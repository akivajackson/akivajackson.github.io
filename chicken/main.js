let counter = document.getElementById('seconds');
let count = 0;
let interval;
let songs = [
    'songs/chicken-sailors-ode.mp3',
    'songs/chicken-symphony.mp3',
    'songs/chicken-on-a-raft.mp3',
    'songs/chicken-hallelujah.mp3',
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
