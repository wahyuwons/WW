// Mengaktifkan plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Animasi sederhana saat halaman dimuat
gsap.from(".title", { 
    duration: 1.5, 
    y: -50, 
    opacity: 0, 
    ease: "bounce" 
});

// 2. Animasi yang dipicu oleh Scroll (ScrollTrigger)
gsap.to(".box", {
    scrollTrigger: {
        trigger: ".box",      // Elemen yang memicu animasi
        start: "top 80%",     // Animasi mulai saat box berada di 80% layar
        end: "top 30%",       // Animasi selesai
        scrub: 1,             // Mengikuti kecepatan scroll (sangat keren!)
    },
    x: 400,
    rotation: 360,
    borderRadius: "50%",
    backgroundColor: "#2ecc71"
});