'use client'

import gsap from "gsap"
import { useEffect } from "react";

const page = () => {

  const menuItems = [
    {label : 'Vision' , icon : 'scan-sharp', href: '#vision'},
    {label : 'Portfolio' , icon : 'layers-sharp', href: '#portfolio'},
    {label : 'People' , icon : 'person-sharp', href: '#people'},
    {label : 'Insights' , icon : 'browsers-sharp', href: '#insights'},
    {label : 'Careesrs' , icon : 'stats-chart-sharp', href: '#careers'},
    {label : 'About Us' , icon : 'reader-sharp', href: '#about'},
  ]

  let isOpen = false;
  let isMenuAnimating = false;
  let responsiveConfig = {};

  const getResponsiveConfig = ()=> {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 1000;

    const maxSize = Math.min(viewportWidth * 0.9, viewportHeight * 0.9);
    const menuSize = isMobile ? Math.min(maxSize , 480) : 700;

    return {
      menuSize,
      center: menuSize / 2,
      innerRadius: menuSize * 0.08,
      outerRadius: menuSize * 0.42,
      contentRadius: menuSize * 0.28,
    }
  }

  useEffect(() => {
    responsiveConfig = getResponsiveConfig()

    const menu = document.querySelector('.circular-menu');
    const joystick = document.querySelector('.joystick');
    const menuOverlayNav = document.querySelector('.menu-overlay-nav');
    const menuOverlayFooter = document.querySelector('.menu-overlay-footer');

    menu.style.width = `${responsiveConfig.menuSize}px`;
    menu.style.height = `${responsiveConfig.menuSize}px`;

    gsap.set(joystick, {scale:0});
    gsap.set([menuOverlayFooter, menuOverlayNav], {opacity:0})

    menuItems.forEach((item,index) => {
      const segment = createSegment(item,index,menuItems.length);
      segment.addEventListener('mouseenter', ()=>{

        // Audio can be added here

        
      })
      menu.appendChild(segment)
    })

    document
    .querySelector('.menu-toggle-btn')
    .addEventListener('click', toggleMenu);
    document.querySelector('.close-btn').addEventListener('click', toggleMenu);
    
    initCenterDrag();
  }, []);


  const createSegment = (item,index,total)=>{
    const segment = document.createElement('a');
    segment.className = 'menu-segment';
    segment.href = item.href;

    const {menuSize , center , innerRadius , outerRadius , contentRadius} = responsiveConfig;

    const anglePerSegment = 360 / total;
    const baseStartAngle = anglePerSegment * index;
    const centerAngle = baseStartAngle + anglePerSegment /2;
    const startAngle = baseStartAngle + 0.19;
    const endAngle = baseStartAngle + anglePerSegment - 0.19;

    const innerStartX = 
    center + innerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const innerStartY = 
    center + innerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const outerStartX = 
    center + outerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const outerStartY = 
    center + outerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const innerEndX = 
    center + innerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const innerEndY = 
    center + innerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);
    const outerEndX = 
    center + outerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const outerEndY = 
    center + outerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);


    const largeArcFlag = endAngle - startAngle > 180 ? 1:0;

    const pathData = [
      `M ${innerStartX} ${innerStartY}`,
      `L ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      'Z'
    ].join(' ');

    segment.style.clipPath = `path('${pathData}')`;
    segment.style.width = `${menuSize}px`;
    segment.style.height = `${menuSize}px`;

    const contentX = 
    center + contentRadius * Math.cos(((centerAngle - 90) * Math.PI) / 180)
    const contentY = 
    center + contentRadius * Math.sin(((centerAngle - 90) * Math.PI) / 180)

    segment.innerHTML = `
    <div class='segment-content'
    style='left: ${contentX}px; top: ${contentY}px; transform:translate(-50% , -50%);'>
    <ion-icon name='${item.icon}'></ion-icon>
    <div class='label'>${item.label}</div>
    </div>
    `;

    return segment;
  }

  const toggleMenu = () => {
  if (isMenuAnimating) return;

  const menuOverlay = document.querySelector('.menu-overlay');
  const menuSegments = document.querySelectorAll('.menu-segment');
  const joystick = document.querySelector('.joystick');
  const menuOverlayNav = document.querySelector('.menu-overlay-nav');
  const menuOverlayFooter = document.querySelector('.menu-overlay-footer');

  isMenuAnimating = true;

  if (!isOpen) {
    isOpen = true;
    // new Audio('/menu-open.mp3').play();

    gsap.to(menuOverlay, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
      onStart: () => (menuOverlay.style.pointerEvents = 'all'),
    });

    gsap.to(joystick, {
      scale: 1,
      duration: 0.4,
      delay: 0.2,
      ease: 'back.out(1.7)',
    });

    gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 0 });
    gsap.to([menuOverlayNav, menuOverlayFooter], {
      opacity: 1,
      duration: 0.075,
      delay: 0.3,
      repeat: 3,
      yoyo: true,
      ease: 'power2.inOut',
      onComplete: () =>
        gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 1 }),
    });

    [...Array(menuSegments.length).keys()]
      .sort(() => Math.random() - 0.5)
      .forEach((originalIndex, shuffledPosition) => {
        const segment = menuSegments[originalIndex];

        gsap.set(segment, { opacity: 0 });
        gsap.to(segment, {
          opacity: 1,
          duration: 0.075,
          delay: shuffledPosition * 0.075,
          repeat: 3,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(segment, { opacity: 1 });
            if (shuffledPosition === menuSegments.length - 1) {
              isMenuAnimating = false;
            }
          },
        });
      });

  } else {
    isOpen = false;
    // new Audio('/menu-close.mp3').play();

    gsap.to([menuOverlayNav, menuOverlayFooter], {
      opacity: 0,
      duration: 0.05,
      repeat: 2,
      yoyo: true,
      ease: 'power2.inOut',
      onComplete: () =>
        gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 0 }),
    });

    gsap.to(joystick, {
      scale: 0,
      duration: 0.3,
      delay: 0.2,
      ease: 'back.in(1.7)',
    });

    [...Array(menuSegments.length).keys()]
      .sort(() => Math.random() - 0.5)
      .forEach((originalIndex, shuffledPosition) => {
        const segment = menuSegments[originalIndex];

        gsap.to(segment, {
          opacity: 0,
          duration: 0.05,
          delay: shuffledPosition * 0.05,
          repeat: 2,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(segment, { opacity: 0 }),
        });
      });

    gsap.to(menuOverlay, {
      opacity: 0,
      duration: 0.3,
      delay: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        menuOverlay.style.pointerEvents = 'none';
        isMenuAnimating = false;
      },
    });
  }
};


const initCenterDrag = ()=> {
  const joystick = document.querySelector('.joystick')
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let activeSegment = null

  const animate = ()=>{
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    gsap.set(joystick, {
      x: currentX,
      y: currentY,
    })

    if(
      isDragging &&
      Math.sqrt(currentX * currentX + currentY * currentY) > 20
    ){
      const angle = Math.atan2(currentY,currentX) * (180 / Math.PI);
      const segmentIndex = Math.floor(((angle + 90 + 360) % 360) / (360 / menuItems.length)) % menuItems.length;
      const segment = document.querySelectorAll('.menu-segment')[segmentIndex]

      if(segment !== activeSegment){
        if(activeSegment){
          activeSegment.style.animation = '';
          activeSegment.querySelector('.segment-content').style.animation = '';
          activeSegment.style.zIndex = '';
        }
        activeSegment = segment;
        segment.style.animation = 'flickerHover 350ms ease-in-out forwards';
        segment.querySelector('.segment-content').style.animation = 'contentFlickerHover 350ms ease-in-out forwards';
        segment.style.zIndex = '10';
        if(isOpen){
          new Audio('/menu-select.mp3').play().catch(()=>{})
        }
      }
    }else{
      if(activeSegment){
        activeSegment.style.animation = '';
        activeSegment.querySelector('.segment-content').style.animation = '';
        activeSegment.style.zIndex = '';
        activeSegment = null;
      }
    }
    requestAnimationFrame(animate)
  }
  joystick.addEventListener('mousedown', (e)=>{
    isDragging =true;
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const drag = (e)=> {
      if(!isDragging) return

      const deltaX = (e.clientX || e.touches[0]?.clientX) - centerX;
      const deltaY = (e.clientY || e.touches[0]?.clientY) - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDrag = 100*0.25;

      if(distance <= 20){
        targetX = targetY = 0;
      } else if(distance > maxDrag) {
        const ratio = maxDrag / distance;
        targetX = deltaX * ratio
        targetY = deltaY * ratio
      } else {
        targetX = deltaX
        targetY = deltaY
      }
      e.preventDefault()
    }
    
    const endDrag = ()=> {
      isDragging = false;
      targetX = targetY = 0
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', endDrag)
    }
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', endDrag)
    e.preventDefault()
  })
  animate()
}

  

  return (

    

    <main>


      {/* html part */}

    <div className="menu-toggle-btn">

      <div className="hamburger-bar"></div>
      <div className="hamburger-bar"></div>

    </div>

    <div className="menu-overlay">
      <div className="menu-bg blur-[5px]"></div>

      <div className="menu-overlay-nav">
        <div className="close-btn">
          <div className="close-btn-bar"></div>
          <div className="close-btn-bar"></div>
        </div>
        <div className="menu-overlay-items">
          <a href='#'><ion-icon name='logo-google'></ion-icon></a>
          <a href='#'><ion-icon name='logo-github'></ion-icon></a>
          <a href='#'><ion-icon name='logo-vercel'></ion-icon></a>
        </div>
      </div>

      <div className="menu-overlay-footer">
        <p>Copyright &copy; 2025 All Rights Reserved</p>
        <div className="menu-overlay-items">
          <a href='#'>Cookie Settings</a>
          <a href='#'>Private Policy</a>
          <a href='#'>Legal Disclaimer</a>
        </div>
      </div>

      <div className="circular-menu">
          <div className="joystick">
            <ion-icon name='grid-sharp' class='center-icon center-main'></ion-icon>
            <ion-icon name='chevron-up-sharp' class='center-icon center-up'></ion-icon>
            <ion-icon name='chevron-down-sharp' class='center-icon center-down'></ion-icon>
            <ion-icon name='chevron-back-sharp' class='center-icon center-left'></ion-icon>
            <ion-icon name='chevron-forward-sharp' class='center-icon center-right'></ion-icon>
          </div>
        </div>
    </div>
    </main>
  )
}

export default page
