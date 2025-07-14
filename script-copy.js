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


  // Function to refresh ScrollTrigger instances
  function refreshScrollTriggers() {
    ScrollTrigger.refresh();
  }

  // Set up ResizeObserver to watch for content changes
  const resizeObserver = new ResizeObserver((entries) => {
    // Debounce the refresh to avoid excessive calls
    clearTimeout(window.scrollTriggerRefreshTimeout);
    window.scrollTriggerRefreshTimeout = setTimeout(() => {
      refreshScrollTriggers();
    }, 100);
  });

  // Observe all sections that might change size
  const observedSections = document.querySelectorAll('section, .section, [data-observe-resize]');
  observedSections.forEach(section => {
    resizeObserver.observe(section);
  });

  // Also observe the body for overall layout changes
  resizeObserver.observe(document.body);

  // STACKED CARDS //

  const cardsWrappers = gsap.utils.toArray(".slide-wrapper").slice(0, -1);
  const cards = gsap.utils.toArray(".card_stack_component");

  cardsWrappers.forEach((wrapper, i) => {
    const card = cards[i];
    gsap.to(card, {
      rotationZ: (Math.random() - 0.5) * 10, // RotationZ between -5 and 5 degrees
      scale: 0.7, // Slight reduction of the content
      rotationX: 40,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        endTrigger: ".g_component_layout",
        scrub: true,
        pin: wrapper,
        pinSpacing: false,
        // markers: {
        //   indent: 100 * i,
        //   startColor: "#0ae448",
        //   endColor: "#fec5fb",
        //   fontSize: "14px"
        // },
      },
    });
  });

  /////////////////////////////////
  /////////////////////////////////
  /* FLAPS ANIMATION */
  /////////////////////////////////
  /////////////////////////////////

  // Get the fold panel element
  const bottomFoldPanel = document.querySelector("[data-gsap-flap='bottom']");

  // Get the top fold panel element
  const topFoldPanel = document.querySelector("[data-gsap-flap='top']");

  const topFlapContent = topFoldPanel.querySelector(
    "[data-gsap-content='flap']"
  );

  const bottomFlapContent = bottomFoldPanel.querySelector(
    "[data-gsap-content='flap']"
  );

  // Set initial styles for top panel
  gsap.set(topFoldPanel, {
    transformOrigin: "center top",
    transformPerspective: "100vw",
    overflow: "hidden",
    transformStyle: "preserve-3d",
  });
  // Set initial styles
  gsap.set(bottomFoldPanel, {
    transformPerspective: "100vw",
    overflow: "hidden",
    transformStyle: "preserve-3d",
    transformOrigin: "center bottom",
  });
  // Set initial styles for content to counter perspective effects
  gsap.set(topFlapContent, {
    transformStyle: "preserve-3d",
    transformOrigin: "center top",
    transformPerspective: "100vw", // Remove perspective inheritance
    backfaceVisibility: "hidden", // Ensure content stays visible
  });

  gsap.set(bottomFlapContent, {
    transformStyle: "preserve-3d",
    transformOrigin: "center bottom",
    transformPerspective: "100vw", // Remove perspective inheritance
    backfaceVisibility: "hidden", // Ensure content stays visible
  });

  // Create timeline for fold panels
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: topFoldPanel,
      markers: true,
      start: "top top",
      end: "bottom 1%",
      scrub: 0.1,
    },
  });

  // Phase 1: 0% to 50% - Initial rotation
  tl.to(topFoldPanel, {
    duration: 6,
    rotationX: -15,
  })
    .to(
      topFlapContent,
      {
        rotationX: 15, // Counter the parent's -15
        duration: 6,
      },
      0 // Start at beginning
    )
    .to(
      bottomFoldPanel,
      {
        rotationX: 15,
        duration: 6,
      },
      0 // Start at beginning
    )
    .to(
      bottomFlapContent,
      {
        rotationX: -15, // Counter the parent's +15
        duration: 6,
      },
      0 // Start at beginning
    )

    // Phase 2: 50% to 100% - Final rotation
    .to(
      topFoldPanel,
      {
        rotationX: -40, // Goes from -15 to -40
        duration: 4,
      },
      "50%" // Start at 50% of timeline
    )
    .to(
      topFlapContent,
      {
        rotationX: 40, // Counter the parent's -40
        duration: 4,
      },
      "50%" // Start at 50% of timeline
    )
    .to(
      bottomFoldPanel,
      {
        rotationX: 0, // Goes from +15 to 0
        duration: 4,
      },
      "50%" // Start at 50% of timeline
    )
    .to(
      bottomFlapContent,
      {
        rotationX: 0, // Counter the parent's 0 (no rotation needed)
        duration: 4,
      },
      "50%" // Start at 50% of timeline - THIS WAS THE MAIN FIX
    );

  /////////////////////////////////
  /////////////////////////////////
  /* TEXT SCALE TO FILL THE PAGE */
  /////////////////////////////////
  /////////////////////////////////

  // const longScrollSection = document.querySelector(
  //   "[data-gsap-section='long-scroll']"
  // );
  // const stickyContent = longScrollSection.querySelector(
  //   "[data-gsap-state='pinned']"
  // );
  // const textTop = longScrollSection.querySelector("[data-gsap-text='top']");
  // const textMiddle = longScrollSection.querySelector(
  //   "[data-gsap-text='middle']"
  // );
  // const textBottom = longScrollSection.querySelector(
  //   "[data-gsap-text='bottom']"
  // );
  // const textWrapper = longScrollSection.querySelector(
  //   "[data-gsap-wrapper='text-wrapper']"
  // );
  // const pivotElement = textMiddle
  //   ? textMiddle.querySelector("[data-gsap-pivot='pivot']")
  //   : null;
  // const beforePivot = textMiddle
  //   ? textMiddle.querySelector("[data-gsap-pivot='before']")
  //   : null;
  // const afterPivot = textMiddle
  //   ? textMiddle.querySelector("[data-gsap-pivot='after']")
  //   : null;

  // const pivotOffsetX = 125; // Change this value to adjust pivot position horizontally
  // const pivotOffsetY = 0; // Change this value to adjust pivot position vertically

  // // Initial and target transform origins
  // let initialOriginX = 50; // 50%
  // let initialOriginY = 50; // 50%
  // let pivotOriginX = 51; // Default fallback
  // let pivotOriginY = 40; // Default fallback

  // // Calculate pivot-based transform origin
  // if (textMiddle && pivotElement) {
  //   const textMiddleRect = textMiddle.getBoundingClientRect();
  //   const pivotRect = pivotElement.getBoundingClientRect();

  //   const pivotCenterX =
  //     pivotRect.left + pivotRect.width / 2 - textMiddleRect.left;
  //   const pivotCenterY =
  //     pivotRect.top + pivotRect.height / 2 - textMiddleRect.top;

  //   const adjustedPivotX = pivotCenterX + pivotOffsetX;
  //   const adjustedPivotY = pivotCenterY + pivotOffsetY;

  //   pivotOriginX = (adjustedPivotX / textMiddleRect.width) * 100;
  //   pivotOriginY = (adjustedPivotY / textMiddleRect.height) * 100;
  // }

  // // Set initial CSS variables
  // gsap.set(longScrollSection, {
  //   "--progress1": 0,
  //   "--progress2": 0,
  // });

  // if (textMiddle) {
  //   gsap.set(textMiddle, {
  //     scale: 0,
  //     transformOrigin: `${initialOriginX}% ${initialOriginY}%`,
  //   });
  // }

  // // Pin the sticky content
  // ScrollTrigger.create({
  //   trigger: longScrollSection,
  //   start: "top top",
  //   end: "bottom bottom",
  //   pin: stickyContent,
  //   pinSpacing: false,
  //   // markers: true, // Remove in production
  // });

  // // Create the long scroll animation with progress tracking
  // ScrollTrigger.create({
  //   trigger: longScrollSection,
  //   start: "top top",
  //   end: "bottom bottom",
  //   markers: true,
  //   scrub: true,
  //   onUpdate: (self) => {
  //     const progress = self.progress;
  //     console.log(progress);

  //     // Calculate progress1: reaches 1 when overall progress is 0.55 (55%)
  //     const progress1 = Math.min(progress / 0.55, 1);

  //     // Calculate progress2: starts at 50% progress, reaches 1 at 100%
  //     const progress2 = progress >= 0.53 ? (progress - 0.53) / 0.47 : 0;

  //     // Calculate progress3: starts at 40% progress, reaches 1 at 55%
  //     const progress3 =
  //       progress >= 0.4 && progress <= 0.55
  //         ? (progress - 0.4) / 0.15
  //         : progress > 0.55
  //         ? 1
  //         : 0;

  //     // Update CSS variables
  //     gsap.set(longScrollSection, {
  //       "--progress1": progress1,
  //       "--progress2": progress2,
  //     });

  //     // Apply transforms using the progress variables

  //     // text-top: translateY(calc(var(--progress1) * -100%))
  //     if (textTop) {
  //       gsap.set(textTop, {
  //         y: `${progress1 * -100}%`,
  //       });
  //     }

  //     if (textBottom) {
  //       gsap.set(textBottom, {
  //         y: `${progress1 * 100}%`,
  //       });
  //     }

  //     // Handle middle text animation with smooth origin interpolation
  //     if (textMiddle) {
  //       // Interpolate transform origin based on progress1
  //       const currentOriginX =
  //         initialOriginX + (pivotOriginX - initialOriginX) * progress1;
  //       const currentOriginY =
  //         initialOriginY + (pivotOriginY - initialOriginY) * progress1;

  //       // Set the interpolated transform origin
  //       textMiddle.style.transformOrigin = `${currentOriginX}% ${currentOriginY}%`;

  //       gsap.set(textMiddle, {
  //         scale: progress1 * 2.1,
  //       });
  //       gsap.set(beforePivot, {
  //         xPercent: progress3 * -5,
  //       });
  //       gsap.set(afterPivot, {
  //         xPercent: progress3 * 20,
  //       });
  //     }
  //     // text-wrapper: transform: scale(calc(1 + (var(--progress1)) * 3))
  //     if (textWrapper) {
  //       gsap.set(textWrapper, {
  //         scale: 1 + progress1 * 8,
  //       });
  //     }

  //     if (progress2 > 0) {
  //       // Do something with progress2 (from 50% to 100% of scroll)
  //       gsap.set(stickyContent, {
  //         color: "var(--swatch--pink)",
  //       });
  //     }
  //   },
  // });

  // Function to initialize long scroll animation for a single instance
  function initializeLongScrollAnimation(longScrollSection, index) {
    if (!longScrollSection) return;

    // Get elements within this specific section
    const stickyContent = longScrollSection.querySelector(
      "[data-gsap-state='pinned']"
    );
    const textTop = longScrollSection.querySelector("[data-gsap-text='top']");
    const textMiddle = longScrollSection.querySelector(
      "[data-gsap-text='middle']"
    );
    const textBottom = longScrollSection.querySelector(
      "[data-gsap-text='bottom']"
    );
    const textWrapper = longScrollSection.querySelector(
      "[data-gsap-wrapper='text-wrapper']"
    );
    const pivotElement = textMiddle?.querySelector("[data-gsap-pivot='pivot']");
    const beforePivot = textMiddle?.querySelector("[data-gsap-pivot='before']");
    const afterPivot = textMiddle?.querySelector("[data-gsap-pivot='after']");

    // Guard clause: Skip if essential elements are missing
    if (!stickyContent) {
      console.warn(
        `Long scroll section ${index + 1}: Missing sticky content element`
      );
      return;
    }

    const pivotOffsetX = parseInt(pivotElement.getAttribute("data-gsap-offset"));
    console.log(typeof pivotOffsetX)
    const pivotOffsetY = 0;

    // Initial and target transform origins
    let initialOriginX = 50;
    let initialOriginY = 50;
    let pivotOriginX = 51;
    let pivotOriginY = 40;

    // Calculate pivot-based transform origin
    if (textMiddle && pivotElement) {
      const textMiddleRect = textMiddle.getBoundingClientRect();
      const pivotRect = pivotElement.getBoundingClientRect();

      const pivotCenterX =
        pivotRect.left + pivotRect.width / 2 - textMiddleRect.left;
      const pivotCenterY =
        pivotRect.top + pivotRect.height / 2 - textMiddleRect.top;

      const adjustedPivotX = pivotCenterX + pivotOffsetX;
      const adjustedPivotY = pivotCenterY + pivotOffsetY;

      pivotOriginX = (adjustedPivotX / textMiddleRect.width) * 100;
      pivotOriginY = (adjustedPivotY / textMiddleRect.height) * 100;
    }

    // Set initial CSS variables
    gsap.set(longScrollSection, {
      "--progress1": 0,
      "--progress2": 0,
    });

    // Set initial styles for text middle
    if (textMiddle) {
      gsap.set(textMiddle, {
        scale: 0,
        transformOrigin: `${initialOriginX}% ${initialOriginY}%`,
      });
    }

    // Pin the sticky content
    ScrollTrigger.create({
      trigger: longScrollSection,
      start: "top top",
      end: "bottom bottom",
      pin: stickyContent,
      pinSpacing: false,
      invalidateOnRefresh: true
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
        console.log(`Section ${index + 1} progress:`, progress);

        // Calculate progress values
        const progress1 = Math.min(progress / 0.55, 1);
        const progress2 = progress >= 0.53 ? (progress - 0.53) / 0.47 : 0;
        const progress3 =
          progress >= 0.4 && progress <= 0.55
            ? (progress - 0.4) / 0.15
            : progress > 0.55
            ? 1
            : 0;

        // Update CSS variables
        gsap.set(longScrollSection, {
          "--progress1": progress1,
          "--progress2": progress2,
        });

        // Apply transforms with guard clauses
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

        // Handle middle text animation with smooth origin interpolation
        if (textMiddle) {
          // Interpolate transform origin based on progress1
          const currentOriginX =
            initialOriginX + (pivotOriginX - initialOriginX) * progress1;
          const currentOriginY =
            initialOriginY + (pivotOriginY - initialOriginY) * progress1;

          // Set the interpolated transform origin
          textMiddle.style.transformOrigin = `${currentOriginX}% ${currentOriginY}%`;

          gsap.set(textMiddle, {
            scale: progress1 * 2.1,
          });

          // Apply pivot animations if elements exist
          if (beforePivot) {
            gsap.set(beforePivot, {
              xPercent: progress3 * -5,
            });
          }

          if (afterPivot) {
            gsap.set(afterPivot, {
              xPercent: progress3 * 20,
            });
          }
        }

        // Text wrapper animation
        if (textWrapper) {
          gsap.set(textWrapper, {
            scale: 1 + progress1 * 8,
          });
        }

        // Progress2 effects
        if (progress2 > 0 && stickyContent) {
          gsap.set(stickyContent, {
            color: "var(--swatch--pink)",
          });
        }
      },
    });
  }

  // Initialize all long scroll sections
  const longScrollSections = document.querySelectorAll(
    "[data-gsap-section='long-scroll']"
  );

  if (longScrollSections.length > 0) {
    longScrollSections.forEach((section, index) => {
      initializeLongScrollAnimation(section, index);
    });
  } else {
    console.warn("No long scroll sections found");
  }

  /////////////////////////////////
  /////////////////////////////////
  /* ACCORDION */
  /////////////////////////////////
  /////////////////////////////////

  const accordionContainer = document.querySelector('[data-gsap="inview"]');
  const accordionHeaders = document.querySelectorAll(".accordion_header");
  const accordionWrapper = document.querySelector(
    '[data-gsap="accordion-wrapper"]'
  );

  let headerHeight = "8rem"; // rem

  if (accordionContainer && accordionHeaders.length > 0 && accordionWrapper) {
    const totalItemsCount = accordionHeaders.length;
    const sectionHeight = accordionContainer.getBoundingClientRect().height;
    const wrapperHeight = accordionWrapper.offsetHeight;
    const headerHeightPx = wrapperHeight / totalItemsCount;
    const sectionHeightPx = `${sectionHeight}px`;

    // Set global CSS variables on :root
    document.documentElement.style.setProperty(
      "--total-items",
      totalItemsCount
    );
    document.documentElement.style.setProperty(
      "--section-height",
      sectionHeightPx
    );
    document.documentElement.style.setProperty("--header-height", headerHeight);

    accordionHeaders.forEach((header, index) => {
      const itemPosition = index + 1;

      header.style.setProperty("--item-position", itemPosition);
    });

    const accordionContainers = document.querySelectorAll("[data-accordion]");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const container = entry.target;
            // Exact same logic as reference
            entry.boundingClientRect.top < 0
              ? container.classList.add("inview")
              : container.classList.remove("inview");
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -100% 0px", // Critical setting
          threshold: 0,
        }
      );

      accordionContainers.forEach((container) => {
        observer.observe(container);
      });
    }
  }
});
