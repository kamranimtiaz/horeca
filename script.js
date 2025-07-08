document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lenis
  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    console.log(e);
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Connect Lenis with ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Get the fold panel element
  const foldPanel = document.querySelector(".ix_fold_panel.is-bottom");

  // Get the top fold panel element
  const topFoldPanel = document.querySelector(".ix_fold_panel.is-top");

  // Set initial styles for top panel
  gsap.set(topFoldPanel, {
    transformOrigin: "center top",
  });

  // Create timeline for top fold panel
  const tlTop = gsap.timeline({
    scrollTrigger: {
      trigger: ".ix_fold_wrap",
      start: "top 20%", // When bottom of trigger hits bottom of viewport
      end: "bottom 20%", // When bottom of trigger hits 20% from top of viewport
      scrub: 0.25,
    },
  });

  // First phase: 0% to 65% - Scale Y and Translate Y animation
  tlTop.to(topFoldPanel, {
    rotationX: -30,
  });

  // Set initial styles
  gsap.set(foldPanel, {
    // scaleY: 0.2,
    yPercent: -54,
    rotationX: 30,
    transformOrigin: "center bottom",
  });

  // Create the main timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: foldPanel,
      start: "top bottom", // When bottom of trigger hits bottom of viewport
      end: "top 20%",
      scrub: 0, // Smooth scrubbing
    },
  });

  // First phase: 0% to 65% - Scale Y and Translate Y animation
//   tl.to(foldPanel, {
//     scaleY: 1,
//     yPercent: 0,
    
//   });
  // Second phase: 65% to 100% - Rotate X animation
  tl.to(foldPanel, {
    // rotationX: 0,
    yPercent: 0,
  });
});
