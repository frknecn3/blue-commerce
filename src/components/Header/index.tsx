import Sidebar from '../Sidebar'
import { FaHeart } from 'react-icons/fa'
import { FiPackage, FiTag, FiHelpCircle, FiShoppingBag, FiMapPin } from 'react-icons/fi'
import Link from 'next/link'
import CartAndControls from './CartAndControls'
import HeaderSearchbar from './HeaderSearchbar'

const utilityLinks = [
  { href: '/orders', label: 'My Orders', icon: FiPackage },
  { href: '/offers', label: 'Special Offers', icon: FiTag },
  { href: '/support', label: 'Customer Support', icon: FiHelpCircle },
  { href: '/become-seller', label: 'Become a Seller', icon: FiShoppingBag },
]

const Header = () => {
  return (
    <header className="sticky top-0 z-[10000] text-sm bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top Utility Bar */}
      <div className="hidden md:block bg-slate-950 border-b border-slate-800 text-slate-400">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-10 py-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer font-medium transition-colors">
            <FiMapPin className="text-blue-400 text-xs" />
            <span>Deliver to: <strong className="text-white font-semibold">Istanbul</strong></span>
          </div>

          <div className="flex items-center gap-6">
            {utilityLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Icon className="text-[12px] opacity-70 group-hover:opacity-100 text-blue-400" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 sm:px-6 lg:px-10 py-3 md:gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="BluE-Commerce Homepage">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-blue-600 text-white shadow-sm">
            <FiShoppingBag className="text-lg" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              <span className="text-blue-400">Blu</span>E-Commerce
            </h1>
          </div>
        </Link>

        {/* Search Bar Container */}
        <div className="flex-1 max-w-3xl">
          <HeaderSearchbar />
        </div>

        {/* Right Actions Controls */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <CartAndControls />

          <Link
            href="/favorites"
            aria-label="Favorites"
            className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-800 border border-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 transition-all duration-150 hover:bg-slate-700 hover:text-white hover:border-slate-600 active:scale-95"
          >
            <FaHeart className="text-rose-500 transition-transform duration-150 group-hover:scale-110" />
            <span className="hidden lg:inline font-bold">Favorites</span>
          </Link>

          <Sidebar />
        </div>
      </div>
    </header>
  )
}

export default Header