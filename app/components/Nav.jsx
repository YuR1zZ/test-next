
import Link from 'next/link'


const Nav = () => {
  return (
    <nav className='fixed w-full flex items-center justify-between px-10'>
        <Link href='/'>Home</Link>
        <Link href='/colony'>Colony</Link>
        <Link href='/gateway'>GateWay</Link>
        <Link href='/station'>Station</Link>
    </nav>
  )
}

export default Nav
