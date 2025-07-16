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
  const observedSections = document.querySelectorAll(
    "section, .section, [data-observe-resize]"
  );
  observedSections.forEach((section) => {
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


  // Image scaling animation for all cards (including the last one)
const allCardsWrappers = gsap.utils.toArray(".slide-wrapper");

allCardsWrappers.forEach((wrapper, i) => {
  const imageElement = wrapper.querySelector("[data-gsap-image]");
  
  if (imageElement) {
    // Set initial scale
    gsap.set(imageElement, {
      scale: 0.3
    });
    
    // Create the scaling animation
    gsap.to(imageElement, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top 80%", // When card top hits 90% from top
        end: "top 30%",   // When card reaches center (50% from top)
        scrub: true,
        // Optional: uncomment to see markers for debugging
        // markers: {
        //   indent: 150 * i,
        //   startColor: "#ff6b6b",
        //   endColor: "#4ecdc4",
        //   fontSize: "12px"
        // }
      }
    });
  }
});

  /////////////////////////////////
  /////////////////////////////////
  /* Squeesed H2 ANIMATION */
  /////////////////////////////////
  /////////////////////////////////
  
  // Text squeeze animation for elements with data-gsap-squeeze attribute
const squeezeElements = gsap.utils.toArray("[data-gsap-squeeze]");

squeezeElements.forEach((element, i) => {
  // Set initial transform origin and scale
  gsap.set(element, {
    transformOrigin: "0 0", // Origin at top-left (0,0)
    scaleX: 1,
    scaleY: 0 // Start from scale 1,0
  });
  
  // Create the squeeze animation
  gsap.to(element, {
    scaleY: 1, // Animate to scale 1,1 (scaleX stays 1)
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom", // When element top hits viewport bottom
      end: "top 75%",     // When element top hits 65% from top
      scrub: true,
      // Optional: uncomment to see markers for debugging
      // markers: {
      //   indent: 100 * i,
      //   startColor: "#ff9800",
      //   endColor: "#2196f3",
      //   fontSize: "12px"
      // }
    }
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

  // Function to initialize long scroll animation for a single instance
  // function initializeLongScrollAnimation(longScrollSection, index) {
  //   if (!longScrollSection) return;

  //   // Get elements within this specific section
  //   const stickyContent = longScrollSection.querySelector(
  //     "[data-gsap-state='pinned']"
  //   );
  //   const textTop = longScrollSection.querySelector("[data-gsap-text='top']");
  //   const textMiddle = longScrollSection.querySelector(
  //     "[data-gsap-text='middle']"
  //   );
  //   const textBottom = longScrollSection.querySelector(
  //     "[data-gsap-text='bottom']"
  //   );
  //   const textWrapper = longScrollSection.querySelector(
  //     "[data-gsap-wrapper='text-wrapper']"
  //   );
  //   const pivotElement = textMiddle?.querySelector("[data-gsap-pivot='pivot']");
  //   const beforePivot = textMiddle?.querySelector("[data-gsap-pivot='before']");
  //   const afterPivot = textMiddle?.querySelector("[data-gsap-pivot='after']");

  //   // Guard clause: Skip if essential elements are missing
  //   if (!stickyContent) {
  //     console.warn(
  //       `Long scroll section ${index + 1}: Missing sticky content element`
  //     );
  //     return;
  //   }

  //   const pivotOffsetX = parseInt(pivotElement.getAttribute("data-gsap-offset"));
  //   console.log(typeof pivotOffsetX)
  //   const pivotOffsetY = 0;

  //   // Initial and target transform origins
  //   let initialOriginX = 50;
  //   let initialOriginY = 50;
  //   let pivotOriginX = 51;
  //   let pivotOriginY = 40;

  //   // Calculate pivot-based transform origin
  //   if (textMiddle && pivotElement) {
  //     const textMiddleRect = textMiddle.getBoundingClientRect();
  //     const pivotRect = pivotElement.getBoundingClientRect();

  //     const pivotCenterX =
  //       pivotRect.left + pivotRect.width / 2 - textMiddleRect.left;
  //     const pivotCenterY =
  //       pivotRect.top + pivotRect.height / 2 - textMiddleRect.top;

  //     const adjustedPivotX = pivotCenterX + pivotOffsetX;
  //     const adjustedPivotY = pivotCenterY + pivotOffsetY;

  //     pivotOriginX = (adjustedPivotX / textMiddleRect.width) * 100;
  //     pivotOriginY = (adjustedPivotY / textMiddleRect.height) * 100;
  //   }

  //   // Set initial CSS variables
  //   gsap.set(longScrollSection, {
  //     "--progress1": 0,
  //     "--progress2": 0,
  //   });

  //   // Set initial styles for text middle
  //   if (textMiddle) {
  //     gsap.set(textMiddle, {
  //       scale: 0,
  //       transformOrigin: `${initialOriginX}% ${initialOriginY}%`,
  //     });
  //   }

  //   // Pin the sticky content
  //   ScrollTrigger.create({
  //     trigger: longScrollSection,
  //     start: "top top",
  //     end: "bottom bottom",
  //     pin: stickyContent,
  //     pinSpacing: false,
  //     invalidateOnRefresh: true
  //     // markers: true, // Remove in production
  //   });

  //   // Create the long scroll animation with progress tracking
  //   ScrollTrigger.create({
  //     trigger: longScrollSection,
  //     start: "top top",
  //     end: "bottom bottom",
  //     markers: true,
  //     scrub: true,
  //     onUpdate: (self) => {
  //       const progress = self.progress;
  //       console.log(`Section ${index + 1} progress:`, progress);

  //       // Calculate progress values
  //       const progress1 = Math.min(progress / 0.55, 1);
  //       const progress2 = progress >= 0.53 ? (progress - 0.53) / 0.47 : 0;
  //       const progress3 =
  //         progress >= 0.4 && progress <= 0.55
  //           ? (progress - 0.4) / 0.15
  //           : progress > 0.55
  //           ? 1
  //           : 0;

  //       // Update CSS variables
  //       gsap.set(longScrollSection, {
  //         "--progress1": progress1,
  //         "--progress2": progress2,
  //       });

  //       // Apply transforms with guard clauses
  //       if (textTop) {
  //         gsap.set(textTop, {
  //           y: `${progress1 * -100}%`,
  //         });
  //       }

  //       if (textBottom) {
  //         gsap.set(textBottom, {
  //           y: `${progress1 * 100}%`,
  //         });
  //       }

  //       // Handle middle text animation with smooth origin interpolation
  //       if (textMiddle) {
  //         // Interpolate transform origin based on progress1
  //         const currentOriginX =
  //           initialOriginX + (pivotOriginX - initialOriginX) * progress1;
  //         const currentOriginY =
  //           initialOriginY + (pivotOriginY - initialOriginY) * progress1;

  //         // Set the interpolated transform origin
  //         textMiddle.style.transformOrigin = `${currentOriginX}% ${currentOriginY}%`;

  //         gsap.set(textMiddle, {
  //           scale: progress1 * 2.1,
  //         });

  //         // Apply pivot animations if elements exist
  //         if (beforePivot) {
  //           gsap.set(beforePivot, {
  //             xPercent: progress3 * -5,
  //           });
  //         }

  //         if (afterPivot) {
  //           gsap.set(afterPivot, {
  //             xPercent: progress3 * 20,
  //           });
  //         }
  //       }

  //       // Text wrapper animation
  //       if (textWrapper) {
  //         gsap.set(textWrapper, {
  //           scale: 1 + progress1 * 8,
  //         });
  //       }

  //       // Progress2 effects
  //       if (progress2 > 0 && stickyContent) {
  //         gsap.set(stickyContent, {
  //           color: "var(--swatch--pink)",
  //         });
  //       }
  //     },
  //   });
  // }

  function initializeLongScrollAnimation(section, index) {
     const stickyContent = section.querySelector(
      "[data-gsap-state='pinned']"
    );
    const middleText = section.querySelector("[data-gsap='middle-text']");
    if (!middleText) return;

    const viewportCenterX = window.innerWidth / 2;
    const middleTextBox = middleText.getBoundingClientRect();
    const middleTextCenterX = middleTextBox.left + middleTextBox.width / 2;
    const deltaX = viewportCenterX - middleTextCenterX;

    const tl = gsap.timeline({
      scrollTrigger: {
      trigger: longScrollSection,
      start: "top top",
      end: "bottom bottom",
      markers: true,
      scrub: true,
      pin: stickyContent,
      },
    });

    tl.to(middleText, {
      x: deltaX,
      duration: 1,
      ease: "power2.out",
    }).to(
      middleText,
      {
        scale: 3,
        ease: "power2.inOut",
        transformOrigin: "center center",
      },
      "<" // Start scale at the same time as translation
    );
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
    const headerHeightPx = `${wrapperHeight / totalItemsCount}px`;
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
    document.documentElement.style.setProperty(
      "--header-height",
      headerHeightPx
    );

    accordionHeaders.forEach((header, index) => {
      const itemPosition = index + 1;

      header.style.setProperty("--item-position", itemPosition);
    });

    const accordionContainers = document.querySelectorAll("[data-accordion]");

    // if ("IntersectionObserver" in window) {
    //   const observer = new IntersectionObserver(
    //     (entries) => {
    //       entries.forEach((entry) => {
    //         const container = entry.target;
    //         // Exact same logic as reference
    //         entry.boundingClientRect.top < 0
    //           ? container.classList.add("inview")
    //           : container.classList.remove("inview");
    //       });
    //     },
    //     {
    //       root: null,
    //       rootMargin: "0px 0px -100% 0px", // Critical setting
    //       threshold: 0,
    //     }
    //   );

    //   accordionContainers.forEach((container) => {
    //     observer.observe(container);
    //   });
    // }

    ScrollTrigger.create({
      trigger: accordionWrapper,
      start: `top bottom-=${wrapperHeight}`,
      onEnter: () => {
        accordionContainers.forEach((container) => {
          container.classList.add("inview");
        });
      },
      onLeaveBack: () => {
        accordionContainers.forEach((container) => {
          container.classList.remove("inview");
        });
      },
    });
  }
});
