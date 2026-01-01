'use client'

import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { useEffect } from "react"
import slides from '../constants/index.js'

gsap.registerPlugin(SplitText)


const page = () => {

  useEffect(() => {
    if (!slides || slides.length === 0) {
      console.error('No slides data available')
      return
    }

    const totalSlides = slides.length;
    let currentSlide = 1;

    let isAnimating = false
    let scrollAllowed = true
    let lastScrollTime = 0

    const createSlide = (slideIndex)=>{
      // Ensure slideIndex is within valid range (1 to totalSlides)
      if (slideIndex < 1 || slideIndex > totalSlides) {
        console.error(`Invalid slide index: ${slideIndex}. Valid range: 1-${totalSlides}`)
        return null
      }

      const arrayIndex = slideIndex - 1
      const slideData = slides[arrayIndex]

      if (!slideData) {
        console.error(`Slide data not found for index ${slideIndex} (array index ${arrayIndex}). Total slides: ${totalSlides}, slides array length: ${slides.length}`)
        console.log('Available slides:', slides.map((s, i) => ({ index: i, title: s?.slideTitle })))
        return null
      }

      const slide = document.createElement('div')
      slide.className = 'slide'

      const slideHeader = document.createElement('div')
      slideHeader.className = 'slide-header'

      const slideTitle = document.createElement('div')
      slideTitle.className = 'slide-title'
      const h1 = document.createElement('h1')
      h1.textContent = slideData.slideTitle
      slideTitle.appendChild(h1);

      if (slideData.subTitle) {
        const h2 = document.createElement('h2')
        h2.className = 'slide-subtitle'
        h2.textContent = slideData.subTitle
        slideTitle.appendChild(h2);
      }

      const slideDescription = document.createElement('div')
      slideDescription.className = 'slide-description'
      const p = document.createElement('p')
      p.textContent = slideData.slideDescription
      slideDescription.appendChild(p);

      const slideLink = document.createElement('div')
      slideLink.className = 'slide-link'
      const a = document.createElement('a')
      a.href = slideData.slideUrl
      a.textContent = 'Steam Profile'
      slideLink.appendChild(a);

      slideHeader.appendChild(slideTitle);
      slideHeader.appendChild(slideDescription);

      const slideInfo = document.createElement('div')
      slideInfo.className = 'slide-info'

      const slideIndexWrapper = document.createElement('div')
      slideIndexWrapper.className = 'slide-index-wrapper'
      const slideIndexCopy = document.createElement('p')
      slideIndexCopy.textContent = slideIndex.toString().padStart(2, '0')
      const slideIndexSeperator = document.createElement('p')
      slideIndexSeperator.textContent = '/'
      const slidesTotalCount = document.createElement('p')
      slidesTotalCount.textContent = totalSlides.toString().padStart(2,'0')
      
      slideIndexWrapper.appendChild(slideIndexCopy)
      slideIndexWrapper.appendChild(slideIndexSeperator)
      slideIndexWrapper.appendChild(slidesTotalCount)

      slideInfo.appendChild(slideIndexWrapper)

      slide.appendChild(slideHeader)
      slide.appendChild(slideInfo)
      slide.appendChild(slideLink)

      return slide;
    }

    const splitText = (slide)=> {
      const slideHeader = slide.querySelector('.slide-title h1')
      if(slideHeader) {
        SplitText.create(slideHeader, {
          type:'word',
          wordsClass: 'word',
          mask:'words',
        })
      }

      const slideContent = slide.querySelectorAll('p,a')
      slideContent.forEach((element)=>{
        SplitText.create(element,{
          type:'lines',
          linesClass: 'line',
          mask:'lines',
          reduceWhiteSpace:false,
        })
      })
    }

    const animateSlide = (direction)=> {
      if(isAnimating || !scrollAllowed) return

      isAnimating = true
      scrollAllowed = false

      const slider = document.querySelector('.slider')
      const currentSlideElement = slider.querySelector('.slide')

      if(direction === 'down') {
        currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1
      } else {
        currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1
      }

      // Ensure currentSlide is within valid bounds
      if (currentSlide < 1) currentSlide = 1
      if (currentSlide > totalSlides) currentSlide = totalSlides

      const exitY = direction === 'down' ? '-200vh' : '200vh'
      const entryY = direction === 'down' ? '100vh' : '-100vh'
      const entryClipPath = direction === 'down' ? 'polygon(20% 20%, 80% 20%,80% 100%,20% 100%)' : 'polygon(20% 0%, 80% 0%, 80% 80%,20% 80%)'

      gsap.to(currentSlideElement, {
        scale: 0.25,
        opacity: 0,
        rotation:30,
        y:exitY,
        duration:2,
        ease:'power4.inOut',
        force3d: true,
        onComplete: ()=> {
          currentSlideElement.remove()
        }
      })

      setTimeout(()=>{
        const newSlide = createSlide(currentSlide)
        
        if (!newSlide) {
          isAnimating = false
          scrollAllowed = true
          return
        }

        gsap.set(newSlide, {
          y:entryY,
          clipPath:entryClipPath,
          force3d:true,
        })

        slider.appendChild(newSlide);

        splitText(newSlide);

        const words = newSlide.querySelectorAll('.word')
        const lines = newSlide.querySelectorAll('.line')

        gsap.set([...words,...lines], {
          y:'100%',
          force3d:true,
        })

        gsap.to(newSlide, {
          y:0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration:1.5,
          ease:'power4.out',
          force3d:true,
          onStart: ()=> {
            const tl = gsap.timeline()

            const headerWords = newSlide.querySelectorAll('.slide-title .word')
            tl.to(
              headerWords,
              {
                y:'0%',
                duration:1,
                ease: 'power4.out',
                stagger:0.1,
                force3d:true,
              },
              0.75
            )

            const indexLines = newSlide.querySelectorAll('.slide-index-wrapper .line')
            const descriptionLines = newSlide.querySelectorAll('.slide-description .line')

            tl.to(
              indexLines,
              {
                y:'0%',
                duration:1,
                ease:'power4.out',
                stagger:0.1,
              },
              '<'
            );

            tl.to(
              descriptionLines,
              {
                y:'0%',
                duration:1,
                ease:'power4.out',
                stagger:0.1,
              },
              '<'
            );

            const linkLines = newSlide.querySelectorAll('.slide-link .line')
            tl.to(
              linkLines,
              {
                y:'0%',
                duration:1,
                ease:'power4.out',
              },
              '-=1'
            )
          },

          onComplete: ()=> {
            isAnimating = false;
            setTimeout(()=> {
              scrollAllowed = true;
              lastScrollTime = Date.now()
            },100)
          }
        })
      }, 750)
    }

    const handleScroll = (direction)=>{
      const now = Date.now();

      if(isAnimating || !scrollAllowed) return
      if(now - lastScrollTime < 1000) return

      lastScrollTime = now
      animateSlide(direction)
    }

    const handleWheel = (e)=>{
      e.preventDefault();
      const direction = e.deltaY > 0 ? 'down' : 'up'
      handleScroll(direction)
    }

    let touchStartY = 0
    let isTouchActive = false

    const handleTouchStart = (e)=>{
      touchStartY = e.touches[0].clientY
      isTouchActive = true
    }

    const handleTouchMove = (e)=>{
      e.preventDefault()
      if(!isTouchActive || isAnimating || !scrollAllowed) return

      const touchCurrentY = e.touches[0].clientY;
      const difference = touchStartY - touchCurrentY

      if(Math.abs(difference) > 50) {
        isTouchActive = false
        const direction = difference > 0 ? 'down' : 'up'
        handleScroll(direction)
      }
    }

    const handleTouchEnd = ()=>{
      isTouchActive = false
    }

    // Initialize the first slide
    const slider = document.querySelector('.slider')
    const existingSlide = slider.querySelector('.slide')
    if (existingSlide) {
      existingSlide.remove()
    }
    const firstSlide = createSlide(1)
    if (firstSlide) {
      slider.appendChild(firstSlide)
      splitText(firstSlide)
      
      // Set initial animation state for first slide
      const words = firstSlide.querySelectorAll('.word')
      const lines = firstSlide.querySelectorAll('.line')
      
      gsap.set([...words, ...lines], {
        y: '0%',
        force3d: true,
      })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, []);

  


  return (
    <main>
      <div className="slider">
        {/* First slide will be initialized dynamically in useEffect */}
      </div>
    </main>
  )
}

export default page
