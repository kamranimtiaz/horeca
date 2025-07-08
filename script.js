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
  const bottomFoldPanel = document.querySelector(".ix_fold_panel.is-bottom");

  // Get the top fold panel element
  const topFoldPanel = document.querySelector(".ix_fold_panel.is-top");

  // Set initial styles for top panel
  gsap.set(topFoldPanel, {
    transformOrigin: "center top",
    transformPerspective: 600,
    transformStyle: "preserve-3d",
  });
  // Set initial styles
  gsap.set(bottomFoldPanel, {
    transformPerspective: 600,
    transformStyle: "preserve-3d",
    transformOrigin: "center bottom",
  });

  // Create timeline for top fold panel
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".ix_fold_wrap",
      markers: true,
      start: "top top", // When bottom of trigger hits bottom of viewport
      end: "bottom 5%", // When bottom of trigger hits 20% from top of viewport
      scrub: 1,
    },
  });

  // First phase: 0% to 65% - Scale Y and Translate Y animation
  tl
  .to(topFoldPanel, {
    duration: 5,
    rotationX: -10,
  })
  .to(bottomFoldPanel, {
    rotationX: 15 ,
    duration: 5,
  }, 0)
  .to(topFoldPanel, {
    duration: 2.5,
    rotationX: -30,
  })
  .to(bottomFoldPanel, {
    rotationX: 0 ,
    duration: 4
  }, "75%");
});
