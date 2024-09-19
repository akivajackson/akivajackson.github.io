// https://codepen.io/jacksoboy/pen/NWZQbQr

const stories = [
  {
    template: "Last night, I went to the {adjective1} Moishe House party, where everyone was dressed as {plural_noun1}. The highlight was when {famous_person} showed up and started {verb_ing1}. We all had a blast {verb_ing2}, and by the end of the night, someone had turned the {plural_noun1} into a dance routine! It was definitely not a {adjective2} evening! To keep having nights like this, please consider donating some {plural_noun1} to support us!"
  },
  {
    template: "The concert at Moishe House was going perfectly until the {adjective1} musician started playing {plural_noun1} instead of their instrument. The audience was baffled, but then {famous_person} took their {plural_noun1} and started {verb_ing1}. Suddenly, the stage filled with {noun2}, and everyone was left cheering for more chaos! To help us recover from the madness, please send {plural_noun1} our way!"
  },
  {
    template: "At the Moishe House cooking class, we tried to make {food1}, but things went terribly wrong. First, the {adjective1} chef forgot to add the {noun1}, and then {famous_person} accidentally {verb_past1} into the {kitchen_appliance}. The kitchen quickly turned into a {adjective2} mess, and we ended up ordering {food2} instead. What a disaster! If you want to help us recover, please send a {noun1} to keep us cooking!"
  },
  {
    template: "Shabbat dinner started off calm, but quickly turned into a {adjective1} adventure. The challah was shaped like {plural_noun1}, and instead of {liquid2}, someone brought {liquid1}. {famous_person} stood up to give a toast but ended up {verb_ing1} into the soup. We were all laughing so hard that {noun2} spilled everywhere! If you want to keep the fun going, please donate some {liquid2}!"
  },
  {
    template: "We went on a hike through the {adjective1} forest near Moishe House. Halfway through, we found a {noun1} hidden under a pile of {plural_noun1}. {famous_person} told us it was a sign, so we all {verb_past1} until we reached the {location1}. It was a {adjective2} day full of surprises! To help us find more hidden treasures, consider donating a {noun2} to support us!"
  },
  {
    template: "Movie night at Moishe House was supposed to be relaxing, but everything went {adjective1}. First, the movie got replaced with a video of {plural_noun1} {verb_ing1}. Then, the popcorn machine went haywire, {verb_ing2} nonstop until the room was filled with {noun1}. By the end, we were too {adjective1} to finish the film! To fix our popcorn machine, we rely on donations—send us some {plural_noun1}!"
  },
  {
    template: "The concert at MoHo started off with the band playing {adjective1} music, but things quickly took a turn. The lead singer {verb_past1} off the stage, and the drummer replaced their drumsticks with {plural_noun1}. {famous_person} made a surprise appearance, handing out {food1} to the crowd. To keep the fun going, consider donating some {plural_noun2}!"
  },
  {
    template: "At the Moishe House picnic, everything was going fine until a {adjective1} {animal1} ran through the park and stole all the {plural_noun1}. While we tried to chase it down, {famous_person} arrived with {noun1}, and we ended up {verb_ing1} instead. It was a {adjective1} day in the sun! If you want to stop the {animal1} from stealing our food again, please donate some {plural_noun1}!"
  },
  {
    template: "At the Yiddish class, things got out of hand when {famous_person} showed up to teach us how to say {noun1} in Yiddish. Instead of learning, we spent the whole time {verb_ing1} and trying to find {plural_noun1} hidden around the room. The night ended with everyone laughing and {verb_ing2} in Yiddish! If you want to keep learning Yiddish with us, donate some {plural_noun2} to support our efforts!"
  },
  {
    template: "Our Shabbat was supposed to be peaceful, but when {famous_person} arrived, everything went {adjective1}. First, the candles were lit with an {noun1}, and then the {adjective2} kugel somehow ended up on the ceiling. By the time we got to the blessings, we were all {emotion1} and {verb_ing1} instead of praying. To help clean up the {noun1}, we rely on donations—send us some {plural_noun2} if you can!"
  }
];


// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Load initial story
let currentStory = Math.floor(Math.random() * stories.length);
loadStory(currentStory);

// Load new story when "New Story" is clicked
document.getElementById('newStoryBtn').addEventListener('click', function () {
  currentStory = Math.floor(Math.random() * stories.length);
  loadStory(currentStory);
  document.getElementById('storyGenerator').scrollIntoView({behavior: 'smooth'});
});

// Generate story on form submit
document.getElementById('madLibForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const inputs = document.querySelectorAll('#madLibForm input');
  let storyTemplate = stories[currentStory].template;

  // Replace placeholders with input values
  inputs.forEach(input => {
    const regex = new RegExp(`\\{${input.id}\\}`, 'g');
    storyTemplate = storyTemplate.replace(regex, input.value);
  });

  // Display the story
  document.getElementById('storyText').innerText = storyTemplate;
  document.getElementById('storyOutput').classList.remove('hidden');
  document.getElementById('storyOutput').scrollIntoView({behavior: 'smooth'});

  // Delay the appearance of the donate button slightly for effect
  setTimeout(() => {
    document.getElementById('donateContainer').classList.remove('hidden');
  }, 800);  // 800ms delay for donate button
});

// Copy story to clipboard
document.getElementById('copyStoryBtn').addEventListener('click', function () {
  const story = document.getElementById('storyText').innerText;
  navigator.clipboard.writeText(story).then(() => {
    alert('Story copied to clipboard! Paste it as a comment when you donate.');
  }).catch(err => {
    alert('Failed to copy story. Please copy it manually.');
    console.error('Error copying to clipboard:', err);
  });
});

// Open donation page
document.getElementById('donateBtn').addEventListener('click', function () {
  window.open('https://donate.moishehouse.org/team/603229', '_blank');
});

// Function to load a story template and display input fields
function loadStory(storyIndex) {
  const story = stories[storyIndex];
  const inputFields = document.getElementById('inputFields');
  inputFields.innerHTML = '';  // Clear previous inputs

  // Extract unique placeholders
  const placeholders = story.template.match(/\{(\w+)\}/g).map(pl => pl.replace(/[{}]/g, ''));
  const uniquePlaceholders = [...new Set(placeholders)];

  // Shuffle the order of input fields
  shuffleArray(uniquePlaceholders);

  // Create input fields dynamically based on the current story
  uniquePlaceholders.forEach(partId => {
    const label = document.createElement('label');
    label.setAttribute('for', partId);

    // Convert the label to title case
    const titleCasedLabel = partId
        .replace(/\d+$/, '') // Remove numbers
        .split('_') // Split on underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Title case each word
        .join(' '); // Join with spaces

    label.innerText = titleCasedLabel + ':';

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', partId);
    input.required = true;
    inputFields.appendChild(label);
    inputFields.appendChild(input);
  });

  // Reset the form and hide previous outputs
  document.getElementById('madLibForm').reset();
  document.getElementById('storyOutput').classList.add('hidden');
  document.getElementById('donateContainer').classList.add('hidden');
}
