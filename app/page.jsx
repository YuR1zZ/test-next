import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <main className='h-screen'>
      <nav>
        <div className='logo'>
          <Link href='#'>
          <span>Golden Hour Atelier</span>
          </Link>
        </div>
        <div className="menu-toggler">
          <span className='text-[white]'>Menu</span>
        </div>
      </nav>

      <div className="main-overlay">
        <canvas></canvas>

        {/* <div className="intro">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis fuga architecto pariatur aliquam voluptatum eius nisi. Minus officiis fuga impedit.</p>
        </div> */}
      </div>

      <section className='hero'>
        <h1>A study in Time and Txxtures</h1>
      </section>
    </main>
  )
}

export default page
