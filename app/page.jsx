'use client'

import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)


const page = () => {

  useEffect(() => {
    const lenis = new Lenis()
  
    lenis.scrollTo(0, { immediate: true })
  
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
  
    rafId = requestAnimationFrame(raf)
  
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  const config = {
    gap : 0.08,
    speed: 0.03,
    arcRadius: 500,
    imageSpeed: 1, // Speed multiplier for floating images (higher = faster movement)
    bgChangeThreshold: 12, // Threshold multiplier for background image changes (higher = slower to change)
  }

  const spotlightItems = [
    {name: 'Silent Arc', img: '/img-1.jpg'},
    {name: 'Silent Arc2', img: '/img-2.jpg'},
    {name: 'Silent Arc3', img: '/img-3.jpg'},
    {name: 'Silent Arc4', img: '/img-4.jpg'},
    {name: 'Silent Arc5', img: '/img-5.jpg'},
    {name: 'Silent Arc6', img: '/img-6.jpg'},
    {name: 'Silent Arc7', img: '/img-7.jpg'},
  ]

  useEffect(() => {
    const titlesContainer = document.querySelector('.spotlight-titles');
    const imagesContainer = document.querySelector('.spotlight-images');
    const spotlightHeader = document.querySelector('.spotlight-header');
    const titlesContainerElement = document.querySelector(
      '.spotlight-titles-container'
    )
    const introTextElements = document.querySelectorAll('.spotlight-intro-text')
    const imageElements = []

    if (!titlesContainer || !imagesContainer || !spotlightHeader || !titlesContainerElement) {
      return
    }

    spotlightItems.forEach((item,index) =>{
      const titleElement = document.createElement('h1');
      titleElement.textContent = item.name;
      if(index === 0) titleElement.style.opacity = '1';
      titlesContainer.appendChild(titleElement);

      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'spotlight-img';
      const imgElement = document.createElement('img')
      imgElement.src = item.img;
      imgElement.alt = '';
      imgWrapper.appendChild(imgElement);
      imagesContainer.appendChild(imgWrapper)
      imageElements.push(imgWrapper);
    })

    const titleElements = titlesContainer.querySelectorAll('h1');
    let currentActiveIndex = 0;
    let currentBgIndex = 0; // Separate index for background image (changes slower)
    let lastBgChangeProgress = 0; // Track scroll progress when background last changed
    let lastProgress = 0; // Track previous progress to determine scroll direction

    const containerWidth = window.innerWidth * 0.3;
    const containerHeight = window.innerHeight;
    const arcStartX = containerWidth - 220;
    const arcStartY = -200;
    const arcEndY = containerHeight + 200;
    const arcControlPointX = arcStartX + config.arcRadius;
    const arcControlPointY = containerHeight / 2;

    const getBazierPosition = (t)=> {
      // Bezier curve from start to end: P = (1-t)²P0 + 2(1-t)tP1 + t²P2
      const x = (1 - t) * (1 - t) * arcStartX + 2 * (1 - t) * t * arcControlPointX + t * t * arcStartX;
      const y = (1 - t) * (1 - t) * arcStartY + 2 * (1 - t) * t * arcControlPointY + t * t * arcEndY;
      return { x, y }
    }

    const getImgProgressState = (index , overallProgress)=> {
      const startTime = index * config.gap;
      const endTime = startTime + config.speed;

      if(overallProgress < startTime) return -1;
      if (overallProgress > endTime) return 2;

      return (overallProgress - startTime) / config.speed;
    }

    imageElements.forEach((img)=> gsap.set(img,{opacity:0}))
    
    // Set initial background image
    const bgImg = document.querySelector('.spotlight-bg-img img')
    if(bgImg) {
      bgImg.src = spotlightItems[0].img;
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger:'.spotlight',
      start: 'top top',
      end: `+=${window.innerHeight * 10}px`,
      pin:true,
      pinSpacing:true,
      scrub: 1,
      onUpdate: (self)=>{
        const progress = self.progress;
        const scrollDirection = progress > lastProgress ? 'down' : 'up';
        lastProgress = progress;

        if(progress <= 0.2) {
          const animationProgress = progress / 0.2;

          const moveDistance = window.innerWidth * 0.6;
          if(introTextElements[0]) {
            gsap.set(introTextElements[0], {
              x: -animationProgress * moveDistance,
              opacity: 1
            })
          }
          if(introTextElements[1]) {
            gsap.set(introTextElements[1],{
              x: animationProgress * moveDistance,
              opacity: 1
            });
          }

          // Reset background to first image when in intro section
          if(currentBgIndex !== 0) {
            const bgImg = document.querySelector('.spotlight-bg-img img')
            if(bgImg) {
              bgImg.src = spotlightItems[0].img;
            }
            currentBgIndex = 0;
            lastBgChangeProgress = 0;
          }

          // Fade in background slowly near the end of the animation (last 30% of progress)
          // Start fading in at 70% of animation progress (0.7), fully visible at 100% (1.0)
          const fadeStart = 0.7;
          let bgOpacity = 0;
          if(animationProgress >= fadeStart) {
            // Calculate fade progress from 0 to 1 over the last 30% of animation
            const fadeProgress = (animationProgress - fadeStart) / (1 - fadeStart);
            bgOpacity = fadeProgress;
          }

          gsap.set('.spotlight-bg-img', {
            transform: `scale(${1.5 - animationProgress * 0.5})`,
            opacity: bgOpacity
          });
          gsap.set('.spotlight-bg-img img', { 
            transform: `scale(${1.5 - animationProgress * 0.5})`
          });

          imageElements.forEach((img)=> gsap.set(img, {opacity:0}));
          spotlightHeader.style.opacity = '0';
          gsap.set(titlesContainerElement , {
            '--before-opacity': '0',
            '--after-opacity': '0',
          })
        }

        else if (progress > 0.2 && progress <= 0.25) {
          const transitionProgress = (progress - 0.2) / 0.05;
          // Background should be fully visible during transition section
          // Intro section fades in background ending at opacity 1.0
          // Transition section maintains opacity 1.0 (background already fully visible from intro)
          // When scrolling back, intro section will handle the fade out
          gsap.set('.spotlight-bg-img', { 
            transform: 'scale(1)',
            opacity: 1
          })
          gsap.set('.spotlight-bg-img img', { transform: 'scale(1)'})
          
          // Ensure background image is set to first image when in transition/intro sections
          if(currentBgIndex !== 0) {
            const bgImg = document.querySelector('.spotlight-bg-img img')
            if(bgImg) {
              bgImg.src = spotlightItems[0].img;
            }
            currentBgIndex = 0;
            lastBgChangeProgress = 0;
          }

          if(introTextElements[0]) gsap.set(introTextElements[0], {opacity:0})
          if(introTextElements[1]) gsap.set(introTextElements[1], {opacity:0})

          imageElements.forEach((img)=>gsap.set(img, {opacity:0}))
          spotlightHeader.style.opacity = '1';
          gsap.set(titlesContainerElement, {
            '--before-opacity': '1',
            '--after-opacity': '1',
          })
        }

        else if (progress > 0.25 && progress <= 0.95) {
          // Calculate background opacity - fade out if it's the last image and scrolling to outro
          let bgOpacity = 1;
          const isLastBg = currentBgIndex === spotlightItems.length - 1;
          if(isLastBg && progress > 0.9) {
            const fadeProgress = (progress - 0.9) / 0.05; // Fade from 0.9 to 0.95
            bgOpacity = 1 - Math.min(1, fadeProgress);
          }
          
          gsap.set('.spotlight-bg-img', { 
            transform: 'scale(1)',
            opacity: bgOpacity
          })
          gsap.set('.spotlight-bg-img img', { transform: 'scale(1)'})

          if(introTextElements[0]) gsap.set(introTextElements[0], {opacity:0})
          if(introTextElements[1]) gsap.set(introTextElements[1], {opacity:0})

          spotlightHeader.style.opacity = '1';
          gsap.set(titlesContainerElement, {
            '--before-opacity': '1',
            '--after-opacity': '1',
          })

          const switchProgress = (progress - 0.25) / 0.7;
          const viewportHeight = window.innerHeight;
          const titlesContainerHeight = titlesContainer.scrollHeight
          const startPosition = viewportHeight;
          const targetPosition = -titlesContainerHeight;
          const totalDistance = startPosition - targetPosition;
          const currentY = startPosition - switchProgress * totalDistance;

          gsap.set('.spotlight-titles', {
            transform: `translateY(${currentY}px)`,
          })

          const viewportMiddle = viewportHeight / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;

          titleElements.forEach((title,index)=> {
            const titleRect = title.getBoundingClientRect()
            const titleCenter = titleRect.top + titleRect.height / 2;
            const distanceFromCenter = Math.abs(titleCenter - viewportMiddle)

            if(distanceFromCenter < closestDistance) {
              closestDistance = distanceFromCenter;
              closestIndex = index
            }
          })

          // Update active title immediately
          if(closestIndex !== currentActiveIndex){
            if(titleElements[currentActiveIndex]) {
              titleElements[currentActiveIndex].style.opacity= '0.25';
            }
            titleElements[closestIndex].style.opacity = '1'
          }
          
          // Update currentActiveIndex for title tracking (always update)
          currentActiveIndex = closestIndex;
          
          // Sync background image directly with active title index
          // This ensures all 7 images are shown and changes are synced with titles
          if(closestIndex !== currentBgIndex) {
            const progressDiff = Math.abs(switchProgress - lastBgChangeProgress);
            const progressPerItem = 1 / spotlightItems.length;
            
            // Small threshold to prevent jitter, but allow all indices to be reached
            // Use a smaller threshold to keep it more responsive and synced
            const threshold = progressPerItem * 0.15; // 15% of one item's progress
            
            // Always allow change if we've moved to a different item (index difference >= 1)
            // This ensures we can reach all 7 images
            if(progressDiff >= threshold || Math.abs(closestIndex - currentBgIndex) >= 1) {
              // Ensure index is valid
              const targetIndex = Math.max(0, Math.min(closestIndex, spotlightItems.length - 1));
              const bgImg = document.querySelector('.spotlight-bg-img img')
              if(bgImg) {
                bgImg.src = spotlightItems[targetIndex].img;
              }
              currentBgIndex = targetIndex;
              lastBgChangeProgress = switchProgress;
            }
          }

          // Sync floating images with titles - position images along arc from top to bottom
          // Each image appears when its title becomes active, moving along the arc path
          imageElements.forEach((img,index)=>{
            // Calculate when this image should appear based on its index
            // Images appear sequentially as we scroll through titles
            const baseStartProgress = index / spotlightItems.length;
            const baseEndProgress = (index + 1) / spotlightItems.length;
            const progressRange = baseEndProgress - baseStartProgress;
            
            // Make images overlap more to reduce spacing - start earlier and end later
            const overlapAmount = 0.3; // 30% overlap on each side
            const imageStartProgress = Math.max(0, baseStartProgress - overlapAmount * progressRange);
            const imageEndProgress = Math.min(1, baseEndProgress + overlapAmount * progressRange);
            
            // Calculate the position along the arc for this image based on scroll progress
            // When switchProgress is at imageStartProgress, image is at top of arc (t=0)
            // When switchProgress is at imageEndProgress, image is at bottom of arc (t=1)
            let t = 0;
            if(switchProgress < imageStartProgress) {
              // Image hasn't appeared yet
              gsap.set(img, {opacity: 0});
              return;
            } else if(switchProgress >= imageEndProgress) {
              // Image has passed - keep at bottom
              t = 1;
            } else {
              // Map switchProgress to t (0 to 1) for this image's arc position
              // Multiply by imageSpeed to make movement faster along the arc path
              const progress = (switchProgress - imageStartProgress) / (imageEndProgress - imageStartProgress);
              t = Math.min(1, progress * config.imageSpeed);
            }
            
            const pos = getBazierPosition(t);
            // Show image more prominently when its corresponding title is active
            const isActive = index === closestIndex;
            let baseOpacity = isActive ? 1 : 0.6;
            
            // Apply fade-out animation only to the last image when scrolling to outro (progress > 0.9)
            let finalOpacity = baseOpacity;
            const isLastImage = index === spotlightItems.length - 1;
            if(isLastImage && progress > 0.9) {
              const fadeProgress = (progress - 0.9) / 0.05; // Fade from 0.9 to 0.95
              const fadeOutOpacity = 1 - Math.min(1, fadeProgress);
              finalOpacity = baseOpacity * fadeOutOpacity;
            }
            
            gsap.set(img,{
              x:pos.x - 100,
              y: pos.y - 75,
              opacity: finalOpacity,
            })
          })
        } 
        
        if(progress > 0.9) {
          // Fade out the entire spotlight section as we transition to outro
          const fadeProgress = (progress - 0.9) / 0.05; // Fade from 0.9 to 0.95
          const sectionOpacity = 1 - Math.min(1, fadeProgress);
          
          gsap.set('.spotlight-images', {opacity: sectionOpacity});
          gsap.set('.spotlight-titles-container', {opacity: sectionOpacity});
          spotlightHeader.style.opacity = String(sectionOpacity);
          
          // Ensure last background image fully fades to 0
          const isLastBg = currentBgIndex === spotlightItems.length - 1;
          if(isLastBg) {
            // Use sectionOpacity which goes from 1 to 0, ensuring it reaches 0
            const bgOpacity = progress > 0.95 ? 0 : sectionOpacity;
            gsap.set('.spotlight-bg-img', {
              opacity: bgOpacity
            })
          }
          
          if(progress > 0.95) {
            gsap.set(titlesContainerElement, {
              '--before-opacity':'0',
              '--after-opacity':'0',
            })
          } else {
            // Restore opacity when scrolling back from fade-out
            gsap.set(titlesContainerElement, {
              '--before-opacity':'1',
              '--after-opacity':'1',
            })
          }
        }
      }
    })

    return () => {
      scrollTrigger.kill()
      imageElements.forEach(img => img.remove())
      titlesContainer.innerHTML = ''
    }
  }, [])

  return (
    <main>
      <section className='intro'>
        <h1>curated series of surreal frames.</h1>
      </section>
      <section className='spotlight'>
        <div className="spotlight-intro-text-wrapper">
          <div className="spotlight-intro-text">
            <p>Beneath</p>
          </div>
          <div className="spotlight-intro-text">
            <p>Beyond</p>
          </div>
        </div>

        <div className="spotlight-bg-img">
          <img src='/img-3.jpg' alt=''/>
        </div>

        <div className="spotlight-titles-container">
          <div className="spotlight-titles"></div>
        </div>

        <div className="spotlight-images"></div>

        <div className="spotlight-header">
          <p>Discover</p>
        </div>
      </section>
      <section className='outro'>
        <h1>Moments in still motion.</h1>
      </section> 
      
    </main>
  )
}

export default page
