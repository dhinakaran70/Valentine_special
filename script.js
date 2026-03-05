document.addEventListener('DOMContentLoaded', () => {

    // --- Elements ---
    const loadingSubtext = document.getElementById('loading-subtext');

    const pageStart = document.getElementById('start-page');
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
    const q3 = document.getElementById('q3');
    const q4 = document.getElementById('q4');
    const dodgeBtns = document.querySelectorAll('.dodge-btn');

    const bgMusic = document.getElementById('bgMusic');

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
        if (isMusicPlaying) return;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            fadeInMusic();
        }).catch(err => console.log("Autoplay blocked:", err));
    }

    // We NO LONGER attempt to play on load. 
    // The user MUST tap the gift box to start everything.

    // Fallback interaction listeners for safety, though the gift box click handles it.
    const startAudioOnInteraction = () => startMusic();
    ['click', 'touchstart'].forEach(evt =>
        document.addEventListener(evt, startAudioOnInteraction, { once: true })
    );

    // Seamless loop safety
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = 0;
        bgMusic.play();
    });


    // ==============================
    // 💖 FLOATING HEARTS
    // ==============================

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        // Randomize between yellow heart and star
        const isStar = Math.random() > 0.5;
        heart.innerHTML = isStar ? '🌟' : '💛';
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
        "Loading Friendship...",
        "Adding Fun...",
        "Gathering Memories...",
        "Preparing Something Special...",
        "Almost Ready Bestie 💛"
    ];

    function startLoadingScreen() {
        // Animate the loading bar smoothly over 5 seconds
        gsap.to('.loading-bar', { width: '100%', duration: 5, ease: "power1.inOut" });

        // We use GSAP to create a beautiful cycling text animation
        let tl = gsap.timeline();

        loadingTexts.forEach((text, i) => {
            tl.to(loadingSubtext, {
                y: -30, opacity: 0, duration: 0.4,
                delay: 0.6, // amount of time reading
                onComplete: () => {
                    loadingSubtext.textContent = text;
                }
            })
                .fromTo(loadingSubtext, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
        });

        // After all texts have cycled, switch exactly like before
        tl.to(loadingSubtext, {
            y: -30, opacity: 0, duration: 0.4, delay: 0.6,
            onComplete: () => {
                loadingSubtext.textContent = "Ready! 🥰";
            }
        })
            .fromTo(loadingSubtext, { scale: 0.5, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" })
            .to({}, { duration: 0.8 }) // hold the ready state for a moment
            .call(() => {
                switchPage(pageLoading, pageWelcome);
                startWelcomeAnimation();
            });
    }

    // ==============================
    // 🎁 START SCREEN LOGIC
    // ==============================

    pageStart.addEventListener('click', () => {
        // Start audio immediately on this click!
        startMusic();

        // Add a fun little pop animation to the gift box before transitioning
        gsap.to('.gift-box', { scale: 1.5, opacity: 0, duration: 0.5 });

        setTimeout(() => {
            switchPage(pageStart, pageLoading);
            // Trigger the loading sequence once the page switches
            setTimeout(startLoadingScreen, 1000);
        }, 400);
    });

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

    const welcomeMessage = "Hey Bestie 🌟\nI made something special just for you...";

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
    // 💌 QUESTIONS FLOW (Q1 -> Q2 -> Q3 -> Q4)
    // ==============================

    function transitionQuestion(fromQ, toQ) {
        gsap.to(fromQ, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                fromQ.classList.add('hidden');
                toQ.classList.remove('hidden');
                gsap.fromTo(toQ, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            }
        });
    }

    // Q1 -> Q2
    document.querySelectorAll('.q1-yes').forEach(btn => {
        btn.addEventListener('click', () => transitionQuestion(q1, q2));
    });

    // Q2 -> Q3
    document.querySelectorAll('.q2-yes, .q2-obviously').forEach(btn => {
        btn.addEventListener('click', () => transitionQuestion(q2, q3));
    });

    // Q3 -> Q4
    document.querySelectorAll('.q3-yes').forEach(btn => {
        btn.addEventListener('click', () => transitionQuestion(q3, q4));
    });

    // Q4 -> Proposal Page
    document.querySelectorAll('.q4-yes').forEach(btn => {
        btn.addEventListener('click', () => {
            switchPage(pageQuestion, pageProposal);
        });
    });

    // --- General Dodge Logic for ALL "No" Buttons ---
    const moveNoButton = (btn) => {
        const maxX = window.innerWidth * 0.4;
        const maxY = window.innerHeight * 0.4;
        const x = Math.random() * maxX * 2 - maxX;
        const y = Math.random() * maxY * 2 - maxY;

        gsap.to(btn, { x, y, duration: 0.4 });
    };

    dodgeBtns.forEach(btn => {
        btn.addEventListener('mouseover', () => moveNoButton(btn));
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveNoButton(btn);
        });
    });

    document.querySelectorAll('.final-yes').forEach(btn => {
        btn.addEventListener('click', () => {
            switchPage(pageProposal, pageCelebration);
        });
    });

});