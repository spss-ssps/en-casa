window.addEventListener('DOMContentLoaded', () => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const players = {};

    function fadeTo(player, targetVolume, durationMs) {
        clearInterval(player.fadeInterval);
        const startVol = player.audio.volume;
        const steps = Math.max(1, Math.round((durationMs || 500) / (1000 / 60)));
        let i = 0;
        player.fadeInterval = setInterval(() => {
            i++;
            const t = i / steps;
            const vol = startVol + (targetVolume - startVol) * t;
            player.audio.volume = Math.min(1, Math.max(0, vol));
            if (i >= steps) {
                player.audio.volume = Math.min(1, Math.max(0, targetVolume));
                clearInterval(player.fadeInterval);
            }
        }, 1000 / 60);
    }

    function stopOthers(exceptId, durationMs) {
        Object.keys(players).forEach((id) => {
            if (id !== exceptId) fadeTo(players[id], 0, durationMs);
        });
    }

    function addInteractiveAudio(imgId, audioSrc, fadeDurationMs = 500) {
        const img = document.getElementById(imgId);
        if (!img) return;

        const audio = new Audio(audioSrc);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0; // start silent

        const player = { id: imgId, audio, fadeInterval: null, started: false };
        players[imgId] = player;

        function startIfNeeded() {
            if (player.started) return;
            player.started = true;
            // Start playback on user gesture; if blocked, try again on next gesture
            audio.play().catch(() => { /* will retry on next interaction */ });
        }

        function activate() {
            startIfNeeded();
            stopOthers(imgId, fadeDurationMs);
            // In case autoplay was blocked, try to resume on every interaction
            audio.play().catch(() => { });
            fadeTo(player, 1, fadeDurationMs);
        }

        function deactivate() {
            fadeTo(player, 0, fadeDurationMs);
        }

        if (isTouch) {
            // Mobile/tablet: tap toggles this audio; also fades others out
            img.addEventListener('click', (e) => {
                e.preventDefault();
                if (player.audio.volume > 0.05) {
                    deactivate();
                } else {
                    activate();
                }
            });
        } else {
            // Desktop: hover in/out
            img.addEventListener('mouseenter', activate);
            img.addEventListener('mouseleave', deactivate);
        }
    }

    // Attach to your images
    addInteractiveAudio('anue', 'src/anueAudio_01.mp3', 500);
    addInteractiveAudio('boda', 'src/bodaAudio_01.mp3', 500);
});