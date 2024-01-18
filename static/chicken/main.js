let counter = document.getElementById('seconds');
let count = 0;
let interval;
let songsAndGifs = [
    {
        "genre": "Electro Groove",
        "song": 'club—chicken-on-a-raft.mp3',
        "gif": 'dj.gif',
    }, {
        "genre": "Melancholic Melody",
        "song": 'sad-piano—Reflections.mp3',
        "gif": 'indie.gif',
    }, {
        "genre": "Funky Beats",
        "song": "funk-groovy--Funky-Chicken-(1).mp3",
        "gif": 'DALL·E-2024-01-15-21.46.50---A-chicken-on-a-raft-in-a-minimalist,-modern-art-style.-The-image-is-composed-with-simple,-clean-lines-and-a-limited-color-palette.-The-chicken-is-styl.png',
    }, {
        "genre": "Pop Sensation",
        "song": 'pop-Chicken-on-a-Raft.mp3',
        "gif": 'DALL·E-2024-01-15-21.56.14---A-chicken-on-a-raft-in-a-digital-pixel-art-style.-The-image-is-composed-of-vibrant-pixels,-creating-a-nostalgic-and-playful-scene.-The-chicken-is-depi.png',
    }, {
        "genre": "Metal Mayhem",
        "song": 'Metal-Madness.mp3',
        "gif": 'metal.gif',
    }, {
        "genre": "Sitar Rhythms",
        "song": "sitar-infused-traditional-indian-The-Chicken's-Raft.mp3",
        "gif": 'sunset.gif',
    }, {
        "genre": "Jazzy Vibes",
        "song": 'jazz-Chicken-on-a-Raft.mp3',
        "gif": 'DALL·E-2024-01-15-18.48.02---A-jazz-album-cover-featuring-a-chicken-on-a-raft.-The-style-is-cool-and-sophisticated,-with-a-hint-of-vintage-charm.-The-chicken-is-stylized-in-a-slee.png',
    }, {
        "genre": "Folk Serenity",
        "song": 'folk—Hey-Oh,-Chicken-on-a-Raft.mp3',
        "gif": 'DALL·E-2024-01-15-18.53.06---A-chicken-on-a-raft-in-a-warm-and-rustic-folk-style.-The-chicken-is-peaceful-and-serene,-depicted-with-natural-and-earthy-tones.-The-raft-is-made-of-n.png',
    }, {
        "genre": "Baroque Elegance",
        "song": "baroque-classical-choral-Chicken-on-a-Raft-(Baroque-Edition).mp3",
        "gif": 'DALL·E-2024-01-15-18.47.57---An-opera-album-cover-with-a-chicken-on-a-raft.-The-style-is-grand-and-dramatic,-reflecting-the-theatrical-nature-of-opera.-The-chicken-is-depicted-in-.png',
    }, {
        "genre": "Piano Solitude",
        "song": 'sad-piano—Shadows-on-the-Keys.mp3',
        "gif": 'DALL·E-2024-01-15-21.56.24---A-chicken-on-a-raft-in-a-contemporary-street-photography-style.-The-image-captures-a-candid,-spontaneous-moment-of-a-real-chicken-on-a-small-raft,-per.png',
    }, {
        "genre": "Club Nightlife",
        "song": 'club—Dance-All-Night.mp3',
        "gif": 'DALL·E-2024-01-15-21.51.18---A-chicken-on-a-raft-in-an-Art-Deco-style.-The-image-is-characterized-by-elegant,-geometric-shapes-and-streamlined-forms.-The-chicken-is-stylized-with-.png'
    }, {
        "genre": "Funk Fusion",
        "song": "funk-groovy--Funky-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-21.56.20---A-chicken-on-a-raft-in-a-Northern-Renaissance-style.-The-image-is-detailed-and-intricate,-with-an-emphasis-on-realism-and-fine-textures.-The-chicken-i.png'
    }, {
        "genre": "Country Metal Fusion",
        "song": 'country-Chicken-on-a-Raft-(2)-heavy-metal-hard-hitting-intense.mp3',
        "gif": 'DALL·E-2024-01-15-18.42.49---An-album-cover-for-a-death-metal-song-featuring-a-chicken-on-a-raft.-The-style-is-dark-and-intense,-with-the-chicken-portrayed-in-a-fierce,-almost-men.png'
    }, {
        "genre": "Seafarer's Tune",
        "song": 'Skippers-Lament.mp3',
        "gif": 'DALL·E-2024-01-15-21.57.39---A-chicken-on-a-raft-in-a-Rococo-art-style.-The-image-is-light,-playful,-and-ornate,-with-delicate-colors-and-intricate-details.-The-chicken-is-adorned.png'
    }, {
        "genre": "Chinese-ish Folklore",
        "song": "folk-traditional-chinese-enchanting-The-Adventure-of-the-Chicken-on-the-Raft.mp3",
        "gif": 'DALL·E-2024-01-15-21.56.27---A-chicken-on-a-raft-in-a-traditional-Chinese-ink-wash-painting-style.-The-image-is-elegant-and-minimalistic,-with-fluid-brushstrokes-and-a-focus-on-th.png'
    }, {
        "genre": "Indian Classical",
        "song": "traditional-indian-sitar-tabla-The-Rafting-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-21.56.09---A-chicken-on-a-raft-in-a-Victorian-era-illustration-style.-The-image-has-a-classic,-vintage-feel,-with-detailed-line-work-and-a-monochromatic-color-sc.png'
    }, {
        "genre": "Hallelujah",
        "song": 'chicken-hallelujah.mp3',
        "gif": 'DALL·E-2024-01-15-21.57.41---A-chicken-on-a-raft-in-a-Constructivist-art-style.-The-image-is-bold-and-geometric,-with-an-emphasis-on-abstract-forms-and-industrial-materials.-The-c.png'
    }, {
        "genre": "Opera Drama",
        "song": 'Chicken-on-a-Raft-(Opera-Edition).mp3',
        "gif": 'DALL·E-2024-01-15-18.53.16---A-chicken-on-a-raft-in-a-grand-and-dramatic-opera-style.-The-chicken-is-depicted-in-a-theatrical-and-powerful-manner,-possibly-wearing-a-miniature-ope.png'
    }, {
        "genre": "Melodramatic Waves",
        "song": 'melodrama—chicken-sailors-ode.mp3',
        "gif": 'DALL·E-2024-01-15-21.56.18---A-chicken-on-a-raft-in-a-surrealistic-style-inspired-by-Salvador-Dali.-The-image-features-dream-like-elements-with-the-chicken-and-raft-melting-and-di.png'
    }, {
        "genre": "Pop Symphony",
        "song": 'poppy-chicken-symphony.mp3',
        "gif": 'DALL·E-2024-01-15-21.46.52---A-chicken-on-a-raft-in-a-futuristic,-cyberpunk-style.-The-chicken-is-enhanced-with-neon-and-cybernetic-elements,-giving-it-a-bold,-edgy-look.-The-raft.png',
    }, {
        "genre": "Balkan Club",
        "song": "isopolyphony-balkan-The-Chicken-on-the-Raft.mp3",
        "gif": 'DALL·E-2024-01-15-21.46.54---A-chicken-on-a-raft-in-an-impressionist-painting-style.-The-image-features-soft-brushstrokes-and-a-focus-on-the-play-of-light-and-color.-The-chicken-i.png',
    }, {
        "genre": "Arabesque Rhythm",
        "song": "lively-traditional-arabesque--Raftin'-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-21.51.14---A-chicken-on-a-raft-in-a-Gothic-art-style.-The-image-is-dark-and-moody,-with-dramatic-lighting-and-shadow-play.-The-chicken-is-depicted-in-a-mysteriou.png'
    }, {
        "genre": "Medieval Echoes",
        "song": "medieval-choral-gregorianChanting-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-21.51.16---A-chicken-on-a-raft-in-a-pop-art-style.-The-image-features-bold-colors,-stark-outlines,-and-a-playful,-whimsical-approach.-The-chicken-is-depicted-in-.png'
    }, {
        "genre": "Maqam Folk",
        "song": "traditional-maqam-folk-The-Majestic-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-18.53.21---A-chicken-on-a-raft-in-a-cool-and-sophisticated-jazz-style.-The-chicken-is-stylized-in-a-sleek,-jazzy-manner,-possibly-with-elements-like-a-hat-or-a-s.png'
    }, {
        "genre": "Upbeat Chinese-ish",
        "song": "upbeat-traditional-chinese-folk-Chicken-on-a-Raft.mp3",
        "gif": 'DALL·E-2024-01-15-21.57.43---A-chicken-on-a-raft-in-a-Pre-Raphaelite-art-style.-The-image-is-rich-in-symbolism-and-natural-detail,-with-an-emphasis-on-beauty-and-emotion.-The-chic.png'
    }, {
        "genre": "Balkan Isopolyphony",
        "song": "-balkan-isopolyphony-traditionalThe-Raft-of-the-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-21.51.22---A-chicken-on-a-raft-in-a-classic-Renaissance-painting-style.-The-image-features-a-realistic-and-detailed-depiction-of-the-chicken,-with-careful-attent.png',
    }, {
        "genre": "Choral Classics",
        "song": "-choral-classical-Cluck-Cluck-Harmony.mp3",
        "gif": 'DALL·E-2024-01-15-21.46.48---A-chicken-on-a-raft-in-a-traditional-Japanese-ukiyo-e-woodblock-print-style.-The-image-features-classic-ukiyo-e-elements,-such-as-curving-lines-and-fl.png'
    }, {
        "genre": "Gregorian Solemnity",
        "song": "-solemn-gregorian-chants-reverentFeathered-Voyage.mp3",
        "gif": 'DALL·E-2024-01-15-21.56.12---A-chicken-on-a-raft-in-a-Baroque-painting-style.-The-image-is-rich-and-dramatic,-with-deep-shadows-and-intense-lighting.-The-chicken-is-depicted-with-.png',
    }, {
        "genre": "Worldly Beats",
        "song": "-traditional-world-upbeat-Raftin'-Chicken.mp3",
        "gif": 'DALL·E-2024-01-15-21.56.22---A-chicken-on-a-raft-in-an-Expressionist-style.-The-image-is-characterized-by-intense,-vivid-colors-and-bold,-distorted-forms,-conveying-emotional-expe.png'
    }, {
        "genre": "Fusion Excitement",
        "song": "-upbeat-fusion-world-Raft-of-the-Rooster.mp3",
        "gif": 'DALL·E-2024-01-15-21.56.15---A-chicken-on-a-raft-in-a-street-art-graffiti-style.-The-image-is-vibrant-and-expressive,-with-bold-spray-paint-effects-and-urban-influences.-The-chick.png',
    },
].map(songAndGif => {
    songAndGif.song = "songs/" + songAndGif.song;
    songAndGif.gif = "gifs/" + songAndGif.gif;
    return songAndGif;
})
let currentIndex = 0;

let audio = document.getElementById('audio');
let image = document.getElementById('startImage');
let downloadButton = document.getElementById('downloadButton');

clickNextSong = function () {
    nextSong(1);
}
nextSong = function (increment = 1) {
    currentIndex = (currentIndex + increment) % songsAndGifs.length;
    downloadButton.href = audio.src = songsAndGifs[currentIndex].song;
    audio.play();

    image.src = songsAndGifs[currentIndex].gif;
    for (let li of lis) {
        li.classList.remove('current');
    }
    lis[currentIndex + 1].classList.add('current');
    lis[currentIndex + 1].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});

    // Update the dropdown to the genre of the current song
    document.getElementById('songDropdown').value = songsAndGifs[currentIndex].genre;

    //preload the next song
    let nextSongIndex = (currentIndex + 1) % songsAndGifs.length;
    let nextSong = new Audio();
    nextSong.src = songsAndGifs[nextSongIndex].song;
};

// Add the carousel of images
let carousel = document.getElementById('carousel');
let ul = document.getElementById('carouselList');
// Add an empty li at the start
let startLi = document.createElement('li');
startLi.classList.add('padding');
ul.appendChild(startLi);
for (let i = 0; i < songsAndGifs.length; i++) {
    let li = document.createElement('li');
    let img = document.createElement('img');
    img.src = songsAndGifs[i].gif;
    img.onclick = function () {
        currentIndex = i;
        nextSong(0);
    };
    li.appendChild(img);
    ul.appendChild(li);
}
// Add an empty li at the end
let endLi = document.createElement('li');
endLi.classList.add('padding');
let lis = document.querySelectorAll('#carousel li');
ul.appendChild(endLi);
carousel.appendChild(ul);

function startVideo() {
    image.setAttribute('id', 'gif');
    nextSong(0)
    image.onclick = clickNextSong;

    document.getElementById('counter-container').style.display = 'block';

    interval = setInterval(function () {
        count++;
        counter.innerText = count.toString();
    }, 1000);

    // Make the carousel visible
    carousel.style.display = 'block';
    document.getElementById('muteButton').style.display = 'block';
    document.getElementById('downloadButton').style.display = 'block';
}

// Preload the first image(the first song is already preloaded in the HTML)
let first_img = new Image();
first_img.src = songsAndGifs[0].gif;

window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        nextSong(1);
    } else if (event.key === 'ArrowLeft') {
        nextSong(-1);
    }
});

document.getElementById('muteButton').addEventListener('click', function () {
    let audioElem = document.getElementById('audio');
    if (audioElem.muted) {
        // If the audio is currently muted, unmute it and change the image source
        audioElem.muted = false;
        this.src = 'icons/unmute.png';
    } else {
        // If the audio is currently playing, mute it and change the image source
        audioElem.muted = true;
        this.src = 'icons/mute.png';
    }
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        audio.pause();
    } else {
        audio.play();
    }
});

function populateSongDropdown() {
    let genres = [...songsAndGifs.map(song => song.genre)];
    let dropdown = document.getElementById('songDropdown');
    genres.forEach(genre => {
        let option = document.createElement('option');
        option.value = genre;
        option.text = genre;
        dropdown.add(option);
    });
}

// Call the function to populate the dropdown
populateSongDropdown();

document.getElementById('songDropdown').addEventListener('change', function() {
    let selectedGenre = this.value;
    let songsOfGenre = songsAndGifs.filter(song => song.genre === selectedGenre);
    if (songsOfGenre.length > 0) {
        // Get the index of the first song of the selected genre
        let songIndex = songsAndGifs.indexOf(songsOfGenre[0]);
        // Call nextSong with the index of the first song of the selected genre
        nextSong(songIndex);
    }
});