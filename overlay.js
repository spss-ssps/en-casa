document.getElementById('casa').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';

    // Prime iOS audio gate with a real src
    const primer = new Audio('src/anueAudio_01.mp3');
    primer.volume = 0.001;
    primer.play().then(() => primer.pause()).catch(() => { });
});