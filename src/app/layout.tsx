import 'tailwindcss/tailwind.css'
import '../components/css/index.css'
import Header from '../components/Header/index.tsx'
import Footer from '../components/Footer.tsx'
import StoreProvider from './StoreProvider.tsx'
import { NextAuthProvider } from '../components/Auth/SessionWrapper.tsx'
import InitCart from '../components/InitCart/index.tsx'
import { Toaster, toast } from 'sonner'
import ConfirmProvider from '@/context/ConfirmContext.tsx'
import { Analytics } from '@vercel/analytics/next'
export const metadata = {
  title: "BluE-Commerce",
  description: "Hello hey!",
};
export default function RootLayout({ children }: { children: React.ReactElement }) {

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className='relative w-[100vw] '>
        <NextAuthProvider>
          {/* <BackgroundImage /> */}
          <StoreProvider>
            <ConfirmProvider>
              <Toaster />
              <InitCart />
              <Header />
              <main className='w-[100vw] min-h-[90vh] border-t-1'>
                {children}
              </main>
              <Footer />
            </ConfirmProvider>
          </StoreProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html >
  );
}
