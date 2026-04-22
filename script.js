gsap.registerPlugin(ScrollTrigger);

// Membuat Timeline yang dipicu oleh Scroll
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=1500", // Membuat scroll terasa lebih panjang (pinning)
        scrub: 1,
        pin: true,    // MENAHAN layar agar tidak bergeser saat animasi berjalan
    }
});

// Animasi berurutan dalam satu timeline
tl.to(".hero-title", { scale: 5, opacity: 0, duration: 1 })
  .to(".hero-subtitle", { y: -100, opacity: 0, duration: 0.5 }, "-=0.5") // Mulai lebih awal
  .from(".box", { x: -1000, rotation: -720, duration: 1.5 })
  .to(".box", { backgroundColor: "#ff0055", duration: 0.5 });

// Teknik Stagger: Membuat elemen muncul bergantian
gsap.to(".reveal-text span", {
    y: 0,
    stagger: 0.05, // Jeda antar huruf 0.05 detik
    duration: 1,
    ease: "power4.out"
});

//PAralac
gsap.to(".background-element", {
    yPercent: -50, // Bergerak lebih lambat dari scroll asli
    ease: "none",
    scrollTrigger: {
        trigger: ".content",
        scrub: true
    }
});

scrollTrigger: {
    trigger: ".content",
    start: "top center",
    markers: true, // Akan memunculkan garis panduan Start/End di layar
}
