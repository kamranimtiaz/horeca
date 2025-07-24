document.addEventListener("DOMContentLoaded", function () {
  document.fonts.ready.then(() => {
    // Initialize Lenis
    const lenis = new Lenis();

    lenis.on("scroll", (e) => {
      // console.log(e);
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // requestAnimationFrame(raf);

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

    // ====== ANIMATION TIMING VARIABLES ======
    const ANIMATION_CONFIG = {
      // Heading animations
      heading: {
        stagger: 0.15,
        duration: 0.75,
      },
      // Text animations
      text: {
        stagger: 0.05,
        duration: 0.6,
        slideInDelay: 0.2, // Simple delay in seconds for text slide-in
      },
      // Container animations
      container: {
        headingDuration: 1,
        textDuration: 0.8,
        slideOutDelay: 0.1,
      },
    };

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
        gsap.set(textSplit.words, { yPercent: 100, y: "50vh", opacity: 0 });
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
          gsap.set(textInstance.split.words, {
            yPercent: 100,
            y: "50vh",
            opacity: 0,
          });
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

      const nextHeading = nextSlide.querySelector(
        '[data-animate-heading="h1"]'
      );
      const nextText = nextSlide.querySelector(
        '[data-animate-text="hero-sub"]'
      );
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
      // Calculate slide-in delay for heading based on slide-out progress
      let headingSlideInDelay = 0;

      if (!isFirstAnimation && currentHeading) {
        const currentHeadingInstance = getSplitInstance(currentHeading);
        if (currentHeadingInstance && currentHeadingInstance.split.chars) {
          const charCount = currentHeadingInstance.split.chars.length;
          // 2/3 of chars out = (charCount * 2/3 - 1) * stagger + slideOutDelay
          headingSlideInDelay =
            ANIMATION_CONFIG.container.slideOutDelay +
            ((charCount * 2) / 3 - 1) * ANIMATION_CONFIG.heading.stagger;
        }
      }

      // Simple text delay: heading starts + text delay
      const textSlideInDelay =
        headingSlideInDelay + ANIMATION_CONFIG.text.slideInDelay;

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
            duration: ANIMATION_CONFIG.container.headingDuration,
          },
          headingSlideInDelay
        );

        // Animate next heading chars with stagger (positive for slide in)
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
              stagger: ANIMATION_CONFIG.heading.stagger,
              duration: ANIMATION_CONFIG.heading.duration,
            },
            headingSlideInDelay
          );
        }
      }

      // Animate next text from bottom to center (simple delay after heading starts)
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
            duration: ANIMATION_CONFIG.container.textDuration,
          },
          textSlideInDelay
        );

        // Animate next text words with stagger (positive for slide in)
        if (nextTextInstance && nextTextInstance.split.words) {
          tl.fromTo(
            nextTextInstance.split.words,
            {
              yPercent: 100,
              opacity: 0,
              y: "50vh",
            },
            {
              yPercent: 0,
              y: "0vh",
              opacity: 1,
              ease: "power2.out",
              stagger: ANIMATION_CONFIG.text.stagger,
              duration: ANIMATION_CONFIG.text.duration,
            },
            textSlideInDelay
          );
        }
      }

      // SLIDE OUT ANIMATIONS (only if NOT first animation)
      if (!isFirstAnimation) {
        // Move current heading to top (starts at slideOutDelay)
        if (currentHeading) {
          const currentHeadingInstance = getSplitInstance(currentHeading);

          tl.to(
            currentHeading,
            {
              yPercent: -100,
              y: "-50vh",
              ease: "power2.in",
              duration: ANIMATION_CONFIG.container.headingDuration,
            },
            ANIMATION_CONFIG.container.slideOutDelay
          );

          // Move current heading chars to top with stagger (negative for slide out)
          if (currentHeadingInstance && currentHeadingInstance.split.chars) {
            tl.to(
              currentHeadingInstance.split.chars,
              {
                yPercent: -100,
                y: "-50vh",
                ease: "power2.in",
                stagger: -ANIMATION_CONFIG.heading.stagger,
                duration: ANIMATION_CONFIG.heading.duration,
              },
              ANIMATION_CONFIG.container.slideOutDelay
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
              duration: ANIMATION_CONFIG.container.textDuration,
            },
            ANIMATION_CONFIG.container.slideOutDelay
          );

          // Move current text words to top with stagger (negative for slide out)
          if (currentTextInstance && currentTextInstance.split.words) {
            tl.to(
              currentTextInstance.split.words,
              {
                yPercent: -100,
                y: "-50vh",
                opacity: 0,
                ease: "power2.in",
                stagger: -ANIMATION_CONFIG.text.stagger,
                duration: ANIMATION_CONFIG.text.duration,
              },
              ANIMATION_CONFIG.container.slideOutDelay
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
    /* Slides Pinned at Top and Video Scaling */
    /////////////////////////////////
    /////////////////////////////////

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
          end: "bottom center",
          endTrigger: ".g_component_layout",
          scrub: true,
          pin: wrapper,
          pinSpacing: false,
        },
      });

      gsap.to(card, {
        autoAlpha: 0, // Ends at opacity: 0 and visibility: hidden
        ease: "power1.in", // Starts gradually
        scrollTrigger: {
          trigger: card, // Listens to the position of content
          start: "top -80%", // Starts when the top exceeds 80% of the viewport
          end: "+=" + 0.2 * window.innerHeight, // Ends 20% later
          scrub: true, // Progresses with the scroll
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
          scale: 0.3,
        });

        // Create the scaling animation
        gsap.to(imageElement, {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 80%", // When card top hits 90% from top
            end: "top 30%", // When card reaches center (50% from top)
            scrub: true,
          },
        });
      }
    });

    /////////////////////////////////
    /////////////////////////////////
    /* GRID LINES ANIMATION */
    /////////////////////////////////
    /////////////////////////////////

    const gridSection = document.querySelector(
      '[data-gsap-section="grid-lines"]'
    );
    if (!gridSection) return;

    const pinnedContent = gridSection.querySelector(
      '[data-gsap-state="pinned"]'
    );
    const horizontalWrapper = gridSection.querySelector(
      '[data-gsap-wrapper="horizontal-scroll"]'
    );
    const scrollItems = gridSection.querySelectorAll(
      '[data-gsap-item="scroll-item"]'
    );
    const horizontalLines = gridSection.querySelectorAll(
      '[data-gsap-lines="horizontal"]'
    );
    const verticalLines = gridSection.querySelectorAll(
      '[data-gsap-lines="vertical"]'
    );

    const itemCount =
      parseInt(gridSection.getAttribute("data-gsap-items")) ||
      scrollItems.length;

    if (!pinnedContent || !horizontalWrapper || scrollItems.length === 0) {
      console.warn(
        `Grid lines section ${gridSection}: Missing essential elements`
      );
      return;
    }

    // Set initial line state
    gsap.set(horizontalLines, {
      width: "0%",
      transformOrigin: "left center",
    });

    gsap.set(verticalLines, {
      height: "0%",
      transformOrigin: "top center",
    });

    // Line animation when section comes into view
    gsap.to(horizontalLines, {
      width: "100%",
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: horizontalWrapper,
        start: "top 40%",
        toggleActions: "play none none none",
      },
    });

    gsap.to(verticalLines, {
      height: "100%",
      duration: 1,
      ease: "power4.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: horizontalWrapper,
        start: "top 40%",
        toggleActions: "play none none none",
      },
    });

    // 🧠 Dynamically calculate the total scroll distance in px
    const wrapperWidth = horizontalWrapper.scrollWidth;
    const visibleWidth = horizontalWrapper.offsetWidth;
    const totalScrollDistance = wrapperWidth - visibleWidth;

    // Set height of the pinned section based on scroll distance
    const requiredHeight = totalScrollDistance + window.innerHeight;

    gsap.set(gridSection, {
      minHeight: `${requiredHeight}px`, // or height if you're sure it won't change
    });

    // 🌀 Animate horizontal scroll in pixels
    let gridScrollTrigger = gsap.timeline({
      scrollTrigger: {
        trigger: horizontalWrapper,
        start: "top 40%", // When section top hits 30% from top
        end: `+=${totalScrollDistance}`,
        scrub: 1,
        pin: pinnedContent,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          console.log(
            `Grid lines ${gridSection} scroll progress:`,
            self.progress
          );
        },
        markers: true,
      },
    });

    if (scrollItems.length > 1) {
      gridScrollTrigger.to(
        horizontalWrapper,
        {
          x: -totalScrollDistance,
          ease: "none",
          duration: 1,
        },
        0
      );
    }

    /////////////////////////////////
    /////////////////////////////////
    /* H2 PINNED WITHOUT GRAVITY */
    /////////////////////////////////
    /////////////////////////////////
    // Find all containers with the data attribute

    const containers = document.querySelectorAll("[data-animate-container]");

    containers.forEach((container) => {
      // Find the h2 inside the container with data-animate-heading
      const headingWrapper = container.querySelector(
        '[data-animate-heading="h2"]'
      );
      const title = headingWrapper ? headingWrapper.querySelector("h2") : null;

      if (!title) return; // Skip if no h2 found

      // Use SplitText to split the h2 into individual characters
      const splitText = new SplitText(title, {
        type: "chars",
        charsClass: "letter",
      });

      // Calculate the distance for scattering
      const dist = container.clientHeight - title.clientHeight;

      // Check if container should be pinned
      const shouldPin =
        container.getAttribute("data-animate-container") === "pinned";

      if (shouldPin) {
        // Pin the title during scroll (only for containers with "pinned" value)
        ScrollTrigger.create({
          trigger: container,
          pin: title,
          start: "top 20%",
          end: "+=" + dist,
          onComplete: () => {
            // Optional: Revert SplitText when animation completes
            // splitText.revert();
          },
        });
      } else {
        //Specific case for horizontal scroll with pinning
        ScrollTrigger.create({
          trigger: container,
          pin: title,
          start: "top 20%",
          endTrigger: horizontalWrapper,
          markers: true,
          end: "bottom 40%",
          onComplete: () => {
            // Optional: Revert SplitText when animation completes
            // splitText.revert();
          },
        });
      }

      // Animate each character with random scattering (applies to all containers)
      const letters = splitText.chars;
      letters.forEach((letter) => {
        const randomDistance = Math.random() * dist;

        gsap.from(letter, {
          y: randomDistance,
          ease: "none",
          scrollTrigger: {
            trigger: shouldPin ? title : container, // Use title if pinned, container if not
            start: "top 20%",
            end: "+=" + randomDistance,
            scrub: true,
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
          },
        });
      });
    });

    /////////////////////////////////
    /////////////////////////////////
    /* TEXT SCALE TO FILL THE PAGE */
    /////////////////////////////////
    /////////////////////////////////

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
      const pivotElement = textMiddle?.querySelector(
        "[data-gsap-pivot='pivot']"
      );
      const beforePivot = textMiddle?.querySelector(
        "[data-gsap-pivot='before']"
      );
      const afterPivot = textMiddle?.querySelector("[data-gsap-pivot='after']");

      // Guard clause: Skip if essential elements are missing
      if (!stickyContent) {
        console.warn(
          `Long scroll section ${index + 1}: Missing sticky content element`
        );
        return;
      }

      // Set initial CSS variables
      gsap.set(longScrollSection, {
        "--progress1": 0,
        "--progress2": 0,
      });

      // Simple setup - just measure where the pivot is relative to textMiddle at the start
      let pivotOffsetX = 0;

      if (textMiddle && pivotElement) {
        // Measure initial positions
        const textMiddleRect = textMiddle.getBoundingClientRect();
        const pivotRect = pivotElement.getBoundingClientRect();

        // How far is the pivot from textMiddle's center? (including the 13px offset)
        const textMiddleCenterX =
          textMiddleRect.left + textMiddleRect.width / 2;
        const pivotCenterX =
          pivotRect.left + pivotRect.width / 2 + pivotRect.width * 0.1;

        pivotOffsetX = pivotCenterX - textMiddleCenterX;

        console.log("Simple setup:", {
          pivotOffsetX: pivotOffsetX,
          textMiddleCenterX: textMiddleCenterX,
          pivotCenterX: pivotCenterX,
        });

        // Set initial state for animation
        gsap.set(textMiddle, {
          scale: 0,
          transformOrigin: "50% 50%", // Scale from center
        });
      }

      // Pin the sticky content
      ScrollTrigger.create({
        trigger: longScrollSection,
        start: "top top",
        end: "bottom bottom",
        pin: stickyContent,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // Create the long scroll animation
      ScrollTrigger.create({
        trigger: longScrollSection,
        start: "top top",
        end: "bottom bottom",
        // markers: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          console.log(`Long scroll section ${index + 1} progress:`, progress);
          // Calculate progress values
          const progress1 = Math.min(progress / 0.6, 1);
          const progress2 = progress >= 0.3 ? (progress - 0.3) / 0.55 : 0;
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

          // Apply transforms
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

          // Simple middle text animation
          if (textMiddle && pivotElement) {
            const currentScale = Math.max(0, progress1 * 2.25); // Clamp to minimum 0

            // Always apply transforms (don't use conditional)
            const viewportCenterX = window.innerWidth / 2;

            // Calculate how much we need to shift to get pivot to center
            const scaledPivotOffset = pivotOffsetX * currentScale;
            const targetTranslateX = -scaledPivotOffset;

            // Calculate opacity: 0 at progress1=0, 1 at progress1>=0.33
            const middleOpacity = Math.min(
              Math.max((progress1 - 0) / 0.33, 0),
              1
            );

            gsap.set(textMiddle, {
              scale: currentScale,
              x: targetTranslateX,
              transformOrigin: "50% 50%",
              opacity: middleOpacity,
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
            // Get the color mode from the attribute
            const colorMode =
              longScrollSection.getAttribute("data-long-scroll");
            let colorValue = "#fff"; // default

            if (colorMode === "pink") {
              colorValue = "var(--swatch--pink)";
            } else if (colorMode === "white") {
              colorValue = "#fff";
            }

            gsap.set(stickyContent, {
              color: colorValue,
            });
          }
        },
      });
    }

    // Initialize all long scroll sections
    const longScrollSections = document.querySelectorAll(
      "[data-gsap-section='long-scroll']"
    );
    setTimeout(() => {
      if (longScrollSections.length > 0) {
        longScrollSections.forEach((section, index) => {
          initializeLongScrollAnimation(section, index);
        });
      } else {
        console.warn("No long scroll sections found");
      }
    }, 500);

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
      const headerHeightPx =
        window.innerWidth > 768
          ? `${wrapperHeight / totalItemsCount}px`
          : headerHeight;
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
        if (window.matchMedia("(min-width: 769px)").matches) {
          setTimeout(() => {
            header.style.position = "absolute";
          }, 1000);
        }
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
    /////////////////////////////////
    /////////////////////////////////
    /* Footer social Cards*/
    /////////////////////////////////
    /////////////////////////////////

    // Feed Items 3D Animation Class
    // Feed Items 3D Animation Class
    class FeedItemsAnimation {
      constructor(container) {
        // Element selections based on your HTML structure
        this.container = container;
        this.feedItems = [...container.querySelectorAll(".feed_cms_item")];
        this.feedSection = container.querySelector(".section_feed");
        this.feedWrapper = container.querySelector(".feed_cms_wrap");
        this.feedList = container.querySelector(".feed_cms_list"); // The actual grid container

        // Animation properties
        this.targetZValue = 1;
        this.closestItem = null;
        this.closestZDifference = Infinity;
        this.currIndex = 0;
        this.newIndex = 0;
        this.numItems = this.feedItems.length;
        this.progress = 0;

        this.init();
      }

      init() {
        // Initial setup for feed items
        gsap.set(this.feedItems, {
          z: (index) => (index + 1) * -1800,
          zIndex: (index) => index * -1,
          opacity: 0,
        });

        this.createScrollTriggers();
        this.getProgress();
      }

      // Main progress calculation and item positioning
      getProgress = () => {
        this.resetClosestItem();

        this.feedItems.forEach((item) => {
          let normalizedZ = gsap.utils.normalize(
            -3000,
            0,
            gsap.getProperty(item, "z")
          );
          item.setAttribute("data-z", normalizedZ);

          // Animate opacity based on z position
          gsap.to(item, { opacity: normalizedZ + 0.2 });

          // Scale images based on z position
          const itemImage = item.querySelector(".feed_img");
          if (itemImage) {
            gsap.to(itemImage, {
              scale: normalizedZ * 0.5 + 0.75,
              ease: "expo.out",
              duration: 0.5,
            });
          }

          // Find closest item to target z value
          let zDifference = Math.abs(normalizedZ - this.targetZValue);
          if (zDifference < this.closestZDifference) {
            this.closestZDifference = zDifference;
            this.closestItem = item;
          }
        });

        // Update current index
        this.currIndex = this.feedItems.indexOf(this.closestItem);
      };

      resetClosestItem = () => {
        this.closestItem = null;
        this.closestZDifference = Infinity;
      };

      createScrollTriggers() {
        // Main scroll animation for feed items z-positioning
        ScrollTrigger.create({
          trigger: this.feedSection,
          start: "top top",
          end: () => `+=${this.numItems * window.innerHeight}`,
          pin: this.feedSection,
          pinSpacing: true,
          scrub: 0.1,
          // markers: true, // Remove this in production
          immediateRender: false,
          onUpdate: (self) => {
            this.progress = self.progress;
            this.progress = gsap.utils.clamp(0, 1, this.progress);

            // Calculate z-offset to bring items forward as you scroll
            let zOffset = this.progress * 1800 * this.numItems;
            gsap.set(this.feedItems, {
              z: (index) => (index + 1) * -1800 + zOffset,
            });

            this.getProgress();
          },
          onStart: () => {
            // Ensure the pinned element starts at the top
            gsap.set(this.feedList, {
              position: "fixed",
              top: 0,
              left: "50%",
              xPercent: -50,
            });
          },
        });
      }
    }

    // Call this function to add the CSS:
    // addRequiredCSS();

    const feedAnimation = new FeedItemsAnimation(document);
  });

  /////////////////////////////////
  /////////////////////////////////
  /* Animtate background */
  /////////////////////////////////
  /////////////////////////////////

  function animateBackground() {
    const backgroundElement = document.querySelector("[data-animate-bg]");
    document.addEventListener("colorThemesReady", () => {
      $("[data-animate-theme-to]").each(function () {
        let theme = $(this).attr("data-animate-theme-to");

        ScrollTrigger.create({
          trigger: $(this),
          start: "top center",
          markers: true,
          end: "bottom center",
          onToggle: ({ self, isActive }) => {
            if (isActive) gsap.to("body", { ...colorThemes.getTheme(theme) });
          },
        });
      });
    });
  }

  animateBackground();
});
