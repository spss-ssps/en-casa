window.addEventListener('DOMContentLoaded', () => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const players = {};

    // Autoplay unlock prompt
    let soundUnlocked = false;
    let promptShown = false;
    function showSoundPrompt() {
        if (soundUnlocked || promptShown) return;
        promptShown = true;
        const prompt = document.createElement('div');
        prompt.id = 'sound-prompt';
        prompt.textContent = isTouch ? 'Tap to enable sound' : 'Click to enable sound';
        prompt.style.cssText = [
            'position:fixed',
            'bottom:16px',
            'left:50%', 'transform:translateX(-50%)',
            'background:rgba(0,0,0,0.85)',
            'color:#fff', 'padding:10px 14px', 'border-radius:999px',
            'font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
            'font-size:14px', 'z-index:9999', 'box-shadow:0 4px 12px rgba(0,0,0,0.3)',
            'cursor:pointer', 'user-select:none'
        ].join(';');
        document.body.appendChild(prompt);

        function removePrompt() {
            if (prompt && prompt.parentNode) prompt.parentNode.removeChild(prompt);
        }

        function unlock() {
            // Try to start all players on this gesture
            const attempts = Object.values(players).map(p => p.audio.play().catch(() => { }));
            Promise.allSettled(attempts).then(() => {
                soundUnlocked = true;
                removePrompt();
            });
            window.removeEventListener('click', unlock, true);
            window.removeEventListener('touchstart', unlock, true);
        }

        prompt.addEventListener('click', unlock, { once: true, capture: true });
        window.addEventListener('click', unlock, true);
        window.addEventListener('touchstart', unlock, true);
    }

    function fadeTo(player, targetVolume, durationMs, pauseAtZero = false) {
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
                if (pauseAtZero && player.audio.volume === 0 && !player.audio.paused) {
                    try { player.audio.pause(); } catch (_) { }
                }
            }
        }, 1000 / 60);
    }

    function stopOthers(exceptId, durationMs) {
        Object.keys(players).forEach((id) => {
            if (id !== exceptId) fadeTo(players[id], 0, durationMs, true);
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
            audio.play().catch(() => { showSoundPrompt(); /* will retry on next interaction */ });
        }

        function activate() {
            startIfNeeded();
            stopOthers(imgId, fadeDurationMs);
            // In case autoplay was blocked, try to resume on every interaction
            audio.play().catch(() => { showSoundPrompt(); });
            fadeTo(player, 1, fadeDurationMs);
        }

        function deactivate() {
            fadeTo(player, 0, fadeDurationMs);
        }

        if (isTouch) {
            // Mobile/tablet: tap toggles this audio; also fades others out
            const onToggle = (e) => {
                e.preventDefault();
                if (player.audio.volume > 0.05) {
                    deactivate();
                } else {
                    activate();
                }
            };
            img.addEventListener('pointerdown', onToggle);
        } else {
            // Desktop: hover in/out
            img.addEventListener('mouseenter', activate);
            img.addEventListener('mouseleave', deactivate);
        }
    }

    // Attach to your images
    addInteractiveAudio('anue', 'src/anueAudio_01.mp3', 500);
    addInteractiveAudio('boda', 'src/bodaAudio_01.mp3', 500);

    // Resume active audio after returning to the page (e.g., after app switching)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            Object.values(players).forEach(p => {
                if (p.audio.volume > 0 && p.audio.paused) {
                    p.audio.play().catch(() => { });
                }
            });
        }
    });
});