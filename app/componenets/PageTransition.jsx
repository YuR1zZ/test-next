'use client'


import { useEffect , useRef } from "react"
import { useRouter , usePathname } from "next/navigation"
import gsap from "gsap"

const PageTransition = ({children}) => {

  const router = useRouter()
  const pathname = usePathname()
  const overlayRef = useRef(null)
  const blocksRef = useRef([])
  const isTransitioning = useRef(false)

  useEffect(() => {
    const createBlocks = ()=> {
      if(!overlayRef.current) return;
      overlayRef.current.innerHTML = '';
      blocksRef.current = [];

      for (let i = 0; i < 20; i++){
        const block = document.createElement('div');
        block.className = 'block';
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    }

    createBlocks()

    gsap.set(blocksRef.current, {scaleX: 0 , transformOrigin : 'left'});



    revealPage();

    const handleRouteChange = (url)=> {
      if(isTransitioning.current) return;
      isTransitioning.current = true;
      overPage(url)
    }

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) =>{
      link.addEventListener('click', (e)=>{
        e.preventDefault();
        const href = e.currentTarget.href;
        const url = new URL(href).pathname;
        if(url !== pathname) {
          handleRouteChange(url)
        }
      })
    })

    return ()=>{
      links.forEach((link)=>{
        link.removeEventListener('click',handleRouteChange)
      })
    }

  }, [router , pathname]);

  const overPage = (url) => {
    const tl = gsap.timeline({
      onComplete: ()=> router.push(url)
    })

    tl.to(blocksRef.current,{
      scaleX:1,
      duration:0.4,
      stagger:0.02,
      ease:'power2.out',
      transformOrigin:'left',
    })
  }

  const revealPage = ()=> {
    gsap.set(blocksRef.current,{scaleX:1,transformOrigin: "right"})

    gsap.to(blocksRef.current, {
      scaleX:0 , 
      duration: 0.4,
      stagger:0.02,
      ease:'power2.out',
      transformOrigin:'right',
      onComplete: ()=>{
        isTransitioning.current = false;
      }
    })
  }

  return (
    <>
      <div ref={overlayRef} className="transition-overlay"></div>
      
      {children}
    </>
  )
}

export default PageTransition
