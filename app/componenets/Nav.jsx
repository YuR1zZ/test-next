import Link from "next/link"

const Nav = () => {
  return (
    <nav>
        <div className="nav-logo">
            <Link href='/'>Silhoutte</Link>
        </div>
        <div className="nav-links">
            <Link href='/'>Index</Link>
            <Link href='/about'>About</Link>
            <Link href='/contact'>Contact</Link>
        </div>
    </nav>
  )
}

export default Nav
