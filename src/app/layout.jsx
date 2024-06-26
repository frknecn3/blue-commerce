import 'tailwindcss/tailwind.css'
import '../components/css/index.css'
import Header from '../components/Header'
import Footer from '../components/Footer.tsx'
import StoreProvider from './StoreProvider'
import BackgroundImage from '../components/BackgroundImage'
export const metadata = {
  title: "E-Commerce Project",
  description: "Generated by create next app",
};
export default function RootLayout({ children }) {

  console.log("Entry file executed!");
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className='relative w-[100vw] '>
          <BackgroundImage/>
          <StoreProvider>
            <Header className='w-[100vw]'/>
          <main className='  w-[100vw] min-h-[78vh] border-t-1'>
                {children}
          </main>
          <Footer className='w-[100vw]' />
          
          </StoreProvider>
      </body>
    </html>
  );
}
