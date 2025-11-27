'use client'

import gsap from "gsap"
import { SplitText } from "gsap/all";
import { useEffect } from "react";

gsap.registerPlugin(SplitText)







const page = () => {

  useEffect(() => {
  document.fonts.ready.then(()=>{
    const createSplitTexts = (elements)=>{
      const splits = {};

      elements.forEach(({key , selector , type}) =>{
        const config = {type , mask : type}

        if(type === 'chars') config.charsClass = 'char';
        if(type === 'lines') config.lineClass = 'line';
        splits[key] = SplitText.create(selector,config)
      })

      return splits;
    }

    
    const splitElements = [
      {key: 'logoChars', selector : '.preloader-logo h1' , type : 'chars'},
      {key: 'footerLines', selector : '.preloader-footer p' , type : 'lines'},
      {key: 'headerChars', selector : '.header h1' , type : 'chars'},
      {key: 'heroFooterH3', selector : '.hero-footer h3' , type : 'lines'},
      {key: 'heroFooterP', selector : '.hero-footer p' , type : 'lines'},
      {key: 'btnLabels', selector : '.btn-label span' , type : 'lines'},
    ];

    const splits = createSplitTexts(splitElements);

    gsap.set([splits.logoChars.chars], {x:'100%'})
    gsap.set([
      splits.footerLines.lines,
      splits.headerChars.chars,
      splits.heroFooterH3.lines,
      splits.heroFooterP.lines,
      splits.btnLabels.lines,
    ],
  {y:'100%'}
)
gsap.set('.btn-icon', {clipPath : 'circle(0% at 50% 50%)'})
gsap.set('.btn', {scale : 0})

function animateProgress(duration = 4) {
  const tl = gsap.timeline();
  const counterSteps = 5
  let currentProgress = 0

  for (let i = 0; i < counterSteps; i++){
    const finalStep = i === counterSteps - 1;
    const targetProgress = finalStep ? 1 : Math.min(currentProgress + Math.random() * 0.3 + 0.1 , 0.9);
    currentProgress = targetProgress;

    tl.to('.preloader-progress-bar', {
      scaleX : targetProgress,
      duration: duration / counterSteps,
      ease:'power2.out'
    })
  }

  return tl;
}

const tl = gsap.timeline({delay:0.5})

tl.to(splits.logoChars.chars, {
  x:'0%',
  stagger : 0.03,
  duration:1,
  ease:'power4.inOut'
}).to(
  splits.footerLines.lines,
  {
    y:'0%',
    stagger:0.1,
    duration:1,
    ease:'power4.inOut'
  },
  '0.25'
)
.add(animateProgress(),'<')
.set('.preloader-progress', {backgroundColor:'var(--base-300)'})
.to(
  splits.logoChars.chars,
  {
    x:'-100%',
    stagger:0.05,
    duration:0.8,
    ease:'power4.inOut',
  },
  '-=0.5'
)
.to(
  splits.footerLines.lines,
  {
    y:'-100%',
    stagger:0.1,
    duration:1,
    ease:'power4.inOut',
  },
  '<'
)
.to(
  '.preloader-progress',
  {
    opacity:0,
    duration:0.5,
    ease:'power3.out'
  },
  '-=0.25'
)
.to(
  '.preloader-mask',
  {
    scale:5,
    duration:2.5,
    ease:'power3.out',
  },
  '<'
)
.to(
  '.hero-img',
  {
    scale:1,
    duration:1.5,
    ease:'power3.out'
  },
  '<'
)
.to(splits.headerChars.chars,{
  y:0,
  stagger:0.05,   // ✅ Much faster
  duration:0.8,
  ease:'power4.out',
}, '-=1')          // Start it slightly earlier

.to(
  [splits.heroFooterH3.lines, splits.heroFooterP.lines],
  {
    y:0,
    stagger:0.1,
    duration:1,
    ease:'power4.out',
  },
  '-=1.5'
)
.to(
  '.btn',
  {
    scale:1,
    duration:1,
    ease:'power4.out',
    onStart:()=>{
      tl.to('.btn-icon',{
        clipPath:'circle(100% at 50% 50%)',
        duration:1,
        ease:'power2.out',
        delay:-1.25,
      }).to(splits.btnLabels.lines,{
        y:0,
        duration:1,
        ease:'power4.out',
        delay:-1.25,
      })
    },
  },
  '<'
)
  })
}, []);


  return (
    <main className='h-screen relative w-full'>
        <div className='preloader-progress'>
        <div className='preloader-progress-bar'></div>
          <div className='preloader-logo'>
              <h1>Obsidian</h1>
          </div>
      </div>

      <div className="preloader-mask"></div>

      <div className="preloader-content">
        <div className="preloader-footer">
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem quibusdam amet sunt ad quo laudantium similique, inventore incidunt pariatur voluptate?</p>
        </div>
      </div>


      <div className="container">
        <section className='hero'>
          <div className="hero-inner">
            <div className="hero-img">
              <img src='/knight.png' alt='bg' />
            </div>

            <div className="hero-content">
              <div className="header">
                <h1>Obsidian</h1>
              </div>

              <div className="contact-btn">
                <div className="btn">
                  <div className="btn-label">
                    <span>Contact</span>
                  </div>
                  <div className="btn-icon">
                    
                  </div>
                </div>
              </div>

              <div className="menu-btn">
                <div className="btn">
                  <div className="btn-label">
                    <span>Menu</span>
                  </div>
                  <div className="btn-icon">
                    
                  </div>
                </div>
              </div>

              <div className="hero-footer">
                <h3>
                  Spaces Defined Through light and Silence.
                </h3>

                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure deserunt?
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default page
