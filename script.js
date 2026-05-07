document.addEventListener('DOMContentLoaded', () => {
    // 1. Netflix Intro Animation Timeline
    const tlIntro = gsap.timeline();

    // Play ta-dum sound (might need user interaction to play audio in some browsers)
    const audio = document.getElementById('ta-dum');
    
    // Simulate the "N" drawing effect
    tlIntro.to(".left-leg", { scaleY: 1, duration: 0.4, ease: "power2.inOut" })
           .to(".diagonal", { scaleY: 1, duration: 0.4, ease: "power2.inOut" }, "-=0.2")
           .to(".right-leg", { scaleY: 1, duration: 0.4, ease: "power2.inOut" }, "-=0.2")
           // Netflix signature flash/glow before zoom
           .to(".letter-n", { filter: "brightness(1.5) drop-shadow(0 0 20px rgba(229,9,20,1))", duration: 0.2 })
           // Zoom MASSIVELY into the N (like Netflix) and fade out
           .to(".netflix-intro", { scale: 40, opacity: 0, duration: 1.2, ease: "power3.in", delay: 0.3 })
           // Hide Intro Container
           .to("#intro-container", { display: "none", duration: 0 })
           // Show Profile Screen
           .call(() => {
               document.getElementById('profile-screen').classList.remove('hidden');
           })
           .to("#profile-screen", { opacity: 1, duration: 1 });

    // Optional: Try playing audio (browsers usually block autoplay, but we try)
    setTimeout(() => {
        audio.play().catch(e => console.log("Audio autoplay prevented by browser"));
    }, 500);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// 2. Select Profile Logic
function selectProfile() {
    // Zoom in slightly on the chosen profile
    const tlProfile = gsap.timeline();
    
    tlProfile.to("#profile-screen", { opacity: 0, scale: 1.1, duration: 0.8, ease: "power2.inOut" })
             .set("#profile-screen", { display: "none" })
             .call(() => {
                 document.getElementById('main-ui').classList.remove('hidden');
             })
             .to("#main-ui", { opacity: 1, duration: 1 })
             // Hero animations
             .from(".hero-title", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
             .from(".hero-meta", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.6")
             .from(".hero-description", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5")
             .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.5");
}

// 3. Video Modal Logic
function openVideo() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('anniversary-video');
    
    modal.classList.remove('hidden');
    
    // Animate modal entry from center, scaling up
    gsap.fromTo(modal, {opacity: 0, scale: 0.8}, {opacity: 1, scale: 1, duration: 0.5, ease: "power3.inOut"});
    
    // Request fullscreen for the modal container for true Netflix style
    if (modal.requestFullscreen) {
        modal.requestFullscreen();
    } else if (modal.webkitRequestFullscreen) { /* Safari */
        modal.webkitRequestFullscreen();
    } else if (modal.msRequestFullscreen) { /* IE11 */
        modal.msRequestFullscreen();
    }
    
    video.play();
}

function closeVideo() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('anniversary-video');
    
    // Pause video
    video.pause();
    
    // Exit fullscreen if active
    if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // Animate modal exit
    gsap.to(modal, {opacity: 0, scale: 0.8, duration: 0.4, ease: "power3.inOut", onComplete: () => {
        modal.classList.add('hidden');
    }});
}

// Add event listener to close modal if user exits fullscreen natively (e.g., using Esc key)
document.addEventListener('fullscreenchange', handleFullscreenExit);
document.addEventListener('webkitfullscreenchange', handleFullscreenExit);
document.addEventListener('mozfullscreenchange', handleFullscreenExit);
document.addEventListener('MSFullscreenChange', handleFullscreenExit);

function handleFullscreenExit() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        const modal = document.getElementById('video-modal');
        if (!modal.classList.contains('hidden')) {
            closeVideo();
        }
    }
}
