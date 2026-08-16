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
    <header className="sticky top-0 z-[10000] text-sm bg-blue-600 text-white shadow-md border-b border-blue-500">
      {/* Top Utility Bar */}
      <div className="hidden md:block bg-blue-700 border-b border-blue-600/70 text-blue-100">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-10 py-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-blue-100 hover:text-white cursor-pointer font-medium transition-colors">
            <FiMapPin className="text-sky-300 text-xs" />
            <span>Deliver to: <strong className="text-white font-semibold">Istanbul</strong></span>
          </div>

          <div className="flex items-center gap-6">
            {utilityLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Icon className="text-[12px] text-sky-300 group-hover:text-white" />
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
          <span className="grid h-9 w-9 place-items-center rounded-md bg-white text-blue-600 shadow-sm">
            <FiShoppingBag className="text-lg" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white leading-none">
              <span className="text-sky-200">Blu</span>E-Commerce
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
            className="group inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-700/80 border border-blue-500 px-3.5 py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-blue-700 hover:border-blue-400 active:scale-95 shadow-xs"
          >
            <FaHeart className="text-rose-300 transition-transform duration-150 group-hover:scale-110" />
            <span className="hidden lg:inline font-bold">Favorites</span>
          </Link>

          <Sidebar />
        </div>
      </div>
    </header>
  )
}

export default Header