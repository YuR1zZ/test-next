import React from 'react'

const page = () => {
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
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
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
