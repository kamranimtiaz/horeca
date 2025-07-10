document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lenis
  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    // console.log(e);
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
  const bottomFoldPanel = document.querySelector("[data-gsap='bottom-flap']");

  // Get the top fold panel element
  const topFoldPanel = document.querySelector("[data-gsap='top-flap']");

  const topFlapContent = topFoldPanel.querySelector(
    "[data-gsap='top-flap-content']"
  );

  // Set initial styles for top panel
  gsap.set(topFoldPanel, {
    transformOrigin: "center top",
    transformPerspective: 500,
    overflow: "hidden",
    transformStyle: "preserve-3d",
  });
  // Set initial styles
  gsap.set(bottomFoldPanel, {
    transformPerspective: 500,
    // overflow: "hidden",
    transformStyle: "preserve-3d",
    transformOrigin: "center bottom",
  });
  // Set initial styles for content to counter perspective effects
  gsap.set(topFlapContent, {
    // transformStyle: "preserve-3d",
    transformOrigin: "center top",
    transformPerspective: 500, // Remove perspective inheritance
    backfaceVisibility: "hidden", // Ensure content stays visible
    // zIndex: 10, // Keep content above
    // position: "relative", // Ensure proper positioning context
    // top: 0,
    // left: 0,
  });

  // Create timeline for top fold panel
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: topFoldPanel,
      markers: true,
      start: "top top", // When bottom of trigger hits bottom of viewport
      end: "bottom 1%", // When bottom of trigger hits 20% from top of viewport
      scrub: 0.1,
    },
  });

  // First phase: 0% to 65% - Scale Y and Translate Y animation
  tl.to(topFoldPanel, {
    duration: 6, // 60% of timeline
    rotationX: -15,
  })
    .to(
      topFlapContent,
      {
        rotationX: 15, // Opposite of parent rotation
        duration: 6,
      },
      0
    )
    .to(
      bottomFoldPanel,
      {
        rotationX: 15,
        duration: 6, // 60% of timeline
      },
      0
    ) // Start at the same time

    // Phase 2: 60% to 100% - topFoldPanel to -90, bottomFoldPanel to 0
    .to(
      topFoldPanel,
      {
        rotationX: -40,
        duration: 4, // 40% of timeline (from 60% to 100%)
      },
      "50%"
    ) // Start at 60% of timeline
    .to(
      bottomFoldPanel,
      {
        rotationX: 0,
        duration: 4, // 40% of timeline (from 60% to 100%)
      },
      "50%"
    );

  // Scale word timeline

  // Long scroll animation with progress variables
  const longScrollSection = document.querySelector("[data-gsap='long-scroll']");
  const stickyContent = document.querySelector("[data-gsap='sticky-content']");
  const textTop = document.querySelector("[data-gsap='text-top']");
  const textMiddle = document.querySelector("[data-gsap='text-middle']");
  const textBottom = document.querySelector("[data-gsap='text-bottom']");
  const textWrapper = document.querySelector("[data-gsap='text-wrapper']");
  const pivotElement = textMiddle
    ? textMiddle.querySelector("[data-gsap='pivot']")
    : null;
  const pivotOffsetX = -200; // Change this value to adjust pivot position horizontally
  const pivotOffsetY = 0; // Change this value to adjust pivot position vertically

  // let initialTransformOrigin = "45% 50%";
  let initialTransformOrigin = "51% 10%";
  if (textMiddle && pivotElement) {
    const textMiddleRect = textMiddle.getBoundingClientRect();
    const pivotRect = pivotElement.getBoundingClientRect();

    const pivotCenterX =
      pivotRect.left + pivotRect.width / 2 - textMiddleRect.left;
    const pivotCenterY =
      pivotRect.top + pivotRect.height / 2 - textMiddleRect.top;

    const adjustedPivotX = pivotCenterX + pivotOffsetX;
    const adjustedPivotY = pivotCenterY + pivotOffsetY;

    const pivotPercentX = (adjustedPivotX / textMiddleRect.width) * 100;
    const pivotPercentY = (adjustedPivotY / textMiddleRect.height) * 100;

    // initialTransformOrigin = `${pivotPercentX}% ${pivotPercentY}%`;

    // Set the transform origin using direct style manipulation
    textMiddle.style.transformOrigin = initialTransformOrigin;

    // console.log('Transform origin set to:', initialTransformOrigin);
  }

  // Set initial CSS variables
  gsap.set(longScrollSection, {
    "--progress1": 0,
    "--progress2": 0,
  });

  if (textMiddle) {
    gsap.set(textMiddle, {
      scale: 0,
    });
  }

  // Pin the sticky content
  ScrollTrigger.create({
    trigger: longScrollSection,
    start: "top top",
    end: "bottom bottom",
    pin: stickyContent,
    pinSpacing: false,
    // markers: true, // Remove in production
  });

  // Create the long scroll animation with progress tracking
  ScrollTrigger.create({
    trigger: longScrollSection,
    start: "top top",
    end: "bottom bottom",
    markers: true,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      console.log(progress)

      // Calculate progress1: reaches 1 when overall progress is 0.6 (60%)
    const progress1 = Math.min(progress / 0.55, 1);

    // Calculate progress2: starts at 60% progress, reaches 1 at 100%
    const progress2 = progress >= 0.5 ? (progress - 0.5) / 0.5 : 0;

      // console.log(progress);
      // Update CSS variables
      gsap.set(longScrollSection, {
        "--progress1": progress1,
        "--progress2": progress2,
      });
      
// Apply transforms using the progress variables

      // text-top: translateY(calc(var(--progress1) * -100%))
      if (textTop) {
        gsap.set(textTop, {
          y: `${progress1 * -100}%`,
        });
      }

      if (textBottom) {
        gsap.set(textBottom, {
          y: `${progress1 * 100}%`,
        });
      }

      // text-middle: transform: translate(-50%, -50%) scale(calc(var(--progress1) * 8.5))
      // transform-origin: 50% calc(50% - var (--progress1) * 25%)
      if (textMiddle) {

        const rotationProgress = Math.min(progress2 / 0.1, 1);
        const rotation = rotationProgress * 7.8;

        gsap.set(textMiddle, {
          scale: progress1 * 2.25,
          // scale: progress1 * 4,
          rotation: rotation,
        });
      }

      // text-wrapper: transform: scale(calc(1 + (var(--progress1)) * 3))
      if (textWrapper) {
        gsap.set(textWrapper, {
          scale: 1 + progress1 * 8,
        });
      }
      

      if (progress2 > 0) {
        // Do something with progress2 (from 80% to 100% of scroll)
        // console.log('Progress2 active:', progress2);
        gsap.set(stickyContent, {
          color: "var(--swatch--pink)",
        })
      }

    },
  });



});
