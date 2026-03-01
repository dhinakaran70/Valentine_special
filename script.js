document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const loadingSubtext = document.getElementById('loading-subtext');
    const loadingBar = document.querySelector('.loading-bar');

    const pageLoading = document.getElementById('loading-page');
    const pageWelcome = document.getElementById('welcome-page');
    const pageQuestion = document.getElementById('question-page');
    const pageProposal = document.getElementById('proposal-page');
    const pageCelebration = document.getElementById('celebration-page');

    const welcomeText = document.getElementById('welcome-text');
    const welcomeSubtext = document.getElementById('welcome-subtext');
    const btnContinue = document.getElementById('btn-continue');

    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const btnNo = document.getElementById('btn-no');

    const bgMusic = document.getElementById('bgMusic');
    const muteBtn = document.getElementById('muteBtn');

    // ==============================
    // 🎵 ADVANCED AUDIO SYSTEM
    // ==============================

    let isMusicPlaying = false;

    bgMusic.volume = 0;

    function fadeInMusic() {
        let vol = 0;
        const fade = setInterval(() => {
            if (vol < 0.5) {
                vol += 0.02;
                bgMusic.volume = vol;
            } else {
                clearInterval(fade);
            }
        }, 100);
    }

    function startMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            muteBtn.textContent = '🎵';
            fadeInMusic();
        }).catch(err => console.log("Autoplay blocked:", err));
    }

    // Attempt to start music immediately on load
    startMusic();

    // Fallback: Start music on first user interaction if autoplay is blocked
    document.addEventListener("click", () => {
        if (!isMusicPlaying) {
            startMusic();
        }
    });

    // Seamless loop safety
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = 0;
        bgMusic.play();
    });

    // Mute Button
    muteBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            muteBtn.textContent = '🔇';
            isMusicPlaying = false;
        } else {
            startMusic();
        }
    });

    // ==============================
    // 💖 FLOATING HEARTS
    // ==============================

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 4 + 's';
        heart.style.fontSize = Math.random() * 1.5 + 0.5 + 'rem';
        document.getElementById('hearts-container').appendChild(heart);

        setTimeout(() => heart.remove(), 7000);
    }
    setInterval(createHeart, 400);

    // ==============================
    // ⏳ LOADING SCREEN
    // ==============================

    const loadingTexts = [
        "Loading Love...",
        "Adding Cuteness...",
        "Spreading Roses...",
        "Preparing Something Special...",
        "Almost Ready My Love ❤️"
    ];

    let textIndex = 0;
    const loadingInterval = setInterval(() => {
        textIndex++;
        if (textIndex < loadingTexts.length) {
            loadingSubtext.textContent = loadingTexts[textIndex];
            loadingBar.style.width = `${(textIndex / loadingTexts.length) * 100}%`;
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(loadingInterval);
        loadingBar.style.width = '100%';
        loadingSubtext.textContent = "Ready! 🥰";

        setTimeout(() => {
            switchPage(pageLoading, pageWelcome);
            startWelcomeAnimation();
        }, 500);
    }, 5000);

    // ==============================
    // 🔄 PAGE SWITCH
    // ==============================

    function switchPage(fromPage, toPage) {
        fromPage.classList.remove('active');
        setTimeout(() => {
            fromPage.classList.add('hidden');
            toPage.classList.remove('hidden');
            setTimeout(() => {
                toPage.classList.add('active');
            }, 50);
        }, 1000);
    }

    // ==============================
    // ✨ WELCOME ANIMATION
    // ==============================

    const welcomeMessage = "Hey My Love ❤️\nI made something special just for you...";

    function startWelcomeAnimation() {
        let i = 0;
        welcomeText.innerHTML = '';
        const typeWriter = setInterval(() => {
            if (i < welcomeMessage.length) {
                welcomeText.innerHTML += welcomeMessage.charAt(i) === '\n' ? '<br>' : welcomeMessage.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
                welcomeText.style.borderRight = "none";
                welcomeSubtext.classList.remove('hidden');

                btnContinue.classList.remove('hidden');
                gsap.fromTo(btnContinue, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
            }
        }, 100);
    }

    btnContinue.addEventListener('click', () => {
        switchPage(pageWelcome, pageQuestion);
    });

    // ==============================
    // 💌 QUESTIONS FLOW
    // ==============================

    document.querySelectorAll('.q1-yes').forEach(btn => {
        btn.addEventListener('click', () => {
            gsap.to(q1, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    q1.classList.add('hidden');
                    q2.classList.remove('hidden');
                    gsap.fromTo(q2, { opacity: 0 }, { opacity: 1, duration: 0.5 });
                }
            });
        });
    });

    const moveNoButton = () => {
        const maxX = window.innerWidth * 0.4;
        const maxY = window.innerHeight * 0.4;
        const x = Math.random() * maxX * 2 - maxX;
        const y = Math.random() * maxY * 2 - maxY;

        gsap.to(btnNo, { x, y, duration: 0.4 });
    };

    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    document.querySelectorAll('.q2-yes, .q2-obviously').forEach(btn => {
        btn.addEventListener('click', () => {
            switchPage(pageQuestion, pageProposal);
        });
    });

    document.querySelectorAll('.final-yes').forEach(btn => {
        btn.addEventListener('click', () => {
            switchPage(pageProposal, pageCelebration);
        });
    });

});