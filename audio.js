window.addEventListener('DOMContentLoaded', () => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const players = {};

    function fadeTo(player, target, ms) {
        clearInterval(player.fadeInterval);
        const start = player.audio.volume;
        const steps = Math.round(ms / (1000 / 60));
        let i = 0;
        player.fadeInterval = setInterval(() => {
            i++;
            player.audio.volume = Math.min(1, Math.max(0, start + (target - start) * (i / steps)));
            if (i >= steps) {
                clearInterval(player.fadeInterval);
                if (target === 0) player.audio.pause();
            }
        }, 1000 / 60);
    }

    function register(imgId, src, ms = 500) {
        const img = document.getElementById(imgId);
        if (!img) return;

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0;
        const player = { audio, fadeInterval: null };
        players[imgId] = player;

        function activate() {
            audio.volume = 0.01;
            audio.play().catch(() => { });
            Object.values(players).forEach(p => { if (p !== player) fadeTo(p, 0, ms); });
            fadeTo(player, 1, ms);
        }

        function deactivate() { fadeTo(player, 0, ms); }

        if (isTouch) {
            img.addEventListener('pointerdown', e => {
                e.preventDefault();
                audio.volume > 0.05 ? deactivate() : activate();
            });
        } else {
            img.addEventListener('mouseenter', activate);
            img.addEventListener('mouseleave', deactivate);
        }
    }

    register('anue', 'src/anueAudio_01.mp3');
    register('boda', 'src/bodaAudio_01.mp3');

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible')
            Object.values(players).forEach(p => { if (p.audio.volume > 0) p.audio.play().catch(() => { }); });
    });
});