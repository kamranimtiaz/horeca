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
    lenis.resize();
  }

  window.addEventListener("resize", refreshScrollTriggers);

  /////////////////////////////////
  /////////////////////////////////
  /* 2ND Hero Slider */
  /////////////////////////////////
  /////////////////////////////////

  const heroSlides = document.querySelectorAll(".hero_slide");
  if (!heroSlides.length) return;

  let currentIndex = 0;
  let splitInstances = [];
  let isFirstAnimation = true;

  // Initialize - move all heading and text out of screen
  heroSlides.forEach((slide) => {
    const heading = slide.querySelector('[data-animate-heading="h1"]');
    const text = slide.querySelector('[data-animate-text="hero-sub"]');
    const textElement = text ? text.querySelector("p") : null;

    // Split text and store instances
    if (heading) {
      const headingSplit = new SplitText(heading, { type: "chars" });
      splitInstances.push({
        element: heading,
        split: headingSplit,
        type: "heading",
      });

      // Move heading and its chars out of screen initially
      gsap.set(heading, { yPercent: 100, y: "50vh" });
      gsap.set(headingSplit.chars, { yPercent: 100, y: "50vh" });
    }

    if (textElement) {
      const textSplit = new SplitText(textElement, { type: "words" });
      splitInstances.push({
        element: textElement,
        split: textSplit,
        type: "text",
      });

      // Move text and its words out of screen initially
      gsap.set(textElement, { yPercent: 100, y: "50vh" });
      gsap.set(textSplit.words, { yPercent: 100, y: "50vh" });
    }
  });

  // Get split instance for an element
  function getSplitInstance(element) {
    return splitInstances.find((instance) => instance.element === element);
  }

  // Reset slide to bottom position
  function resetSlideToBottom(slideIndex) {
    const slide = heroSlides[slideIndex];
    const heading = slide.querySelector('[data-animate-heading="h1"]');
    const text = slide.querySelector('[data-animate-text="hero-sub"]');
    const textElement = text ? text.querySelector("p") : null;

    if (heading) {
      const headingInstance = getSplitInstance(heading);
      gsap.set(heading, { yPercent: 100, y: "50vh" });
      if (headingInstance && headingInstance.split.chars) {
        gsap.set(headingInstance.split.chars, { yPercent: 100, y: "50vh" });
      }
    }

    if (textElement) {
      const textInstance = getSplitInstance(textElement);
      gsap.set(textElement, { yPercent: 100, y: "50vh" });
      if (textInstance && textInstance.split.words) {
        gsap.set(textInstance.split.words, { yPercent: 100, y: "50vh" });
      }
    }
  }

  // Single timeline for slide transitions
  function changeSlide() {
    const nextIndex = (currentIndex + 1) % heroSlides.length;

    // Get current and next slide elements
    const currentSlide = heroSlides[currentIndex];
    const nextSlide = heroSlides[nextIndex];

    const currentHeading = currentSlide?.querySelector(
      '[data-animate-heading="h1"]'
    );
    const currentText = currentSlide?.querySelector(
      '[data-animate-text="hero-sub"]'
    );
    const currentTextElement = currentText
      ? currentText.querySelector("p")
      : null;

    const nextHeading = nextSlide.querySelector('[data-animate-heading="h1"]');
    const nextText = nextSlide.querySelector('[data-animate-text="hero-sub"]');
    const nextTextElement = nextText ? nextText.querySelector("p") : null;

    console.log(
      `Transitioning from slide ${currentIndex} to slide ${nextIndex}`
    );

    // Create single timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Reset outgoing slide to bottom (if not first animation)
        if (!isFirstAnimation) {
          resetSlideToBottom(currentIndex);
        }
        currentIndex = nextIndex;
        isFirstAnimation = false;
        console.log(`Current slide is now: ${currentIndex}`);
      },
    });

    // SLIDE IN ANIMATIONS (always happen)
    // Animate next heading from bottom to center
    if (nextHeading) {
      const nextHeadingInstance = getSplitInstance(nextHeading);

      tl.fromTo(
        nextHeading,
        {
          yPercent: 100,
          y: "50vh",
        },
        {
          yPercent: 0,
          y: "0vh",
          ease: "power2.out",
          duration: 1,
        },
        0
      );

      // Animate next heading chars with stagger
      if (nextHeadingInstance && nextHeadingInstance.split.chars) {
        tl.fromTo(
          nextHeadingInstance.split.chars,
          {
            yPercent: 100,
            y: "50vh",
          },
          {
            yPercent: 0,
            y: "0vh",
            ease: "power2.out",
            stagger: 0.04,
            duration: 1,
          },
          0
        );
      }
    }

    // Animate next text from bottom to center (slight delay)
    if (nextTextElement) {
      const nextTextInstance = getSplitInstance(nextTextElement);

      tl.fromTo(
        nextTextElement,
        {
          yPercent: 100,
          y: "50vh",
        },
        {
          yPercent: 0,
          y: "0vh",
          ease: "power2.out",
          duration: 0.8,
        },
        0.2
      );

      // Animate next text words with stagger
      if (nextTextInstance && nextTextInstance.split.words) {
        tl.fromTo(
          nextTextInstance.split.words,
          {
            yPercent: 100,
            y: "50vh",
          },
          {
            yPercent: 0,
            y: "0vh",
            ease: "power2.out",
            stagger: 0.03,
            duration: 0.8,
          },
          0.2
        );
      }
    }

    // SLIDE OUT ANIMATIONS (only if NOT first animation)
    if (!isFirstAnimation) {
      // Move current heading to top (starts at 0.5s)
      if (currentHeading) {
        const currentHeadingInstance = getSplitInstance(currentHeading);

        tl.to(
          currentHeading,
          {
            yPercent: -100,
            y: "-50vh",
            ease: "power2.in",
            duration: 0.8,
          },
          0.1
        );

        // Move current heading chars to top with stagger
        if (currentHeadingInstance && currentHeadingInstance.split.chars) {
          tl.to(
            currentHeadingInstance.split.chars,
            {
              yPercent: -100,
              y: "-50vh",
              ease: "power2.in",
              stagger: -0.02,
              duration: 0.6,
            },
            0.1
          );
        }
      }

      // Move current text to top
      if (currentTextElement) {
        const currentTextInstance = getSplitInstance(currentTextElement);

        tl.to(
          currentTextElement,
          {
            yPercent: -100,
            y: "-50vh",
            ease: "power2.in",
            duration: 0.8,
          },
          0.1
        );

        // Move current text words to top with stagger
        if (currentTextInstance && currentTextInstance.split.words) {
          tl.to(
            currentTextInstance.split.words,
            {
              yPercent: -100,
              y: "-50vh",
              ease: "power2.in",
              stagger: -0.03,
              duration: 0.6,
            },
            0.1
          );
        }
      }
    }

    return tl;
  }

  // Start when hero section hits 20% from top
  ScrollTrigger.create({
    trigger: ".section_hero",
    start: "top 20%",
    once: true,
    onEnter: () => {
      console.log("Hero section triggered, starting slideshow");
      // Start first animation
      changeSlide();

      // Start changing slides every 4s
      setInterval(changeSlide, 4000);
    },
  });

  // Cleanup
  window.addEventListener("beforeunload", () => {
    splitInstances.forEach((instance) => {
      if (instance.split && instance.split.revert) {
        instance.split.revert();
      }
    });
  });

  /////////////////////////////////
  /////////////////////////////////
  /* Animtate background */
  /////////////////////////////////
  /////////////////////////////////

  document.addEventListener("colorThemesReady", () => {
    $("[data-animate-theme-to]").each(function () {
      let theme = $(this).attr("data-animate-theme-to");
      let endTheme = $(this).attr("data-animate-theme-end") || "default";

      ScrollTrigger.create({
        trigger: $(this),
        start: "top center",
        end: "bottom center",
        toggleActions: "restart none none reverse",
        invalidateOnRefresh: true,
        onEnter: () => {
          gsap.to("body", {
            ...colorThemes.getTheme(theme),
            duration: 0.5, // ← Add duration here
            ease: "Quad.easeInOut",
          });
        },
        onEnterBack: () => {
          gsap.to("body", {
            ...colorThemes.getTheme(theme),
            duration: 0.5, // ← Add duration here
            ease: "Quad.easeInOut",
          });
        },
      });
    });
  });

  /////////////////////////////////
  /////////////////////////////////
  /* Squeesed H2 ANIMATION */
  /////////////////////////////////
  /////////////////////////////////

  // Basic Line-by-Line Squeeze using GSAP SplitText plugin
  const squeezeElements = gsap.utils.toArray("[data-gsap-squeeze]");

  squeezeElements.forEach((element, i) => {
    // Split the text into lines using SplitText plugin
    const splitText = new SplitText(element, {
      type: "lines",
      linesClass: "squeeze-line",
    });

    // Get the line elements
    const lines = splitText.lines;

    // Set initial transform origin and scale for each line
    gsap.set(lines, {
      transformOrigin: "0 0", // Origin at top-left (0,0)
      scaleX: 1,
      scaleY: 0, // Start from scale 1,0
    });

    // Create the squeeze animation for each line
    lines.forEach((line, lineIndex) => {
      gsap.to(line, {
        scaleY: 1, // Animate to scale 1,1 (scaleX stays 1)
        ease: "none",
        scrollTrigger: {
          trigger: line, // Use the parent element as trigger
          start: "top bottom", // When element top hits viewport bottom
          end: "top 75%", // When element top hits 75% from top
          scrub: true,
          // Add a slight delay for each line to create stagger effect
          // delay: lineIndex * 0.1,
          // Optional: uncomment to see markers for debugging
          // markers: {
          //   indent: 100 * i + lineIndex * 20,
          //   startColor: "#ff9800",
          //   endColor: "#2196f3",
          //   fontSize: "12px"
          // }
        },
      });
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
    const stickyContent = section.querySelector("[data-gsap-state='pinned']");
const middleText = section.querySelector("[data-gsap-text='middle']");
const pivotElement = middleText
  ? middleText.querySelector("[data-gsap-pivot='pivot']")
  : null;

if (!middleText || !pivotElement) {
  console.warn("Middle text or pivot element not found");
  return;
}

// Step 1: Initial measurements
gsap.set(middleText, { scale: 1, x: 0 });

const pivotRect = pivotElement.getBoundingClientRect();
const pivotAbsoluteCenterX = pivotRect.left + pivotRect.width / 2;
const viewportCenterX = window.innerWidth / 2;
const offsetToCenter = pivotAbsoluteCenterX - viewportCenterX;

gsap.set(middleText, {
  scale: 0,
  x: 0,
  transformOrigin: "50% 50%",
});

// Step 2: GSAP timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "bottom bottom",
    markers: true,
    scrub: true,
    pin: stickyContent,
    onUpdate: (self) => {
      const progress = self.progress;
      const currentScale = progress * 20;
      const currentX = -offsetToCenter * currentScale;

      gsap.set(middleText, {
        scale: currentScale,
        x: currentX,
      });
    },
  },
});

return tl;


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
      setTimeout(() => {
        header.style.position = "absolute";
      }, 1000);
      
    });

    const accordionContainers = document.querySelectorAll("[data-accordion]");

    ScrollTrigger.create({
      trigger: accordionWrapper,
      start: `top bottom-=${wrapperHeight}`,
      onEnter: () => {
        accordionContainers.forEach((container) => {
          container.classList.add("inview");
        });
        
          // setTimeout(()=>{
          //   lenis.resize(); // Update Lenis dimensions
          //   ScrollTrigger.refresh(true); // Force immediate refresh

          // }, 50)
            
        
      },
      onLeaveBack: () => {
        accordionContainers.forEach((container) => {
          container.classList.remove("inview");
        });
      },
    });
  }
});
