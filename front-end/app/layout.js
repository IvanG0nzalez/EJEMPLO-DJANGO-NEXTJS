import { Inter } from 'next/font/google'
import './globals.css'
import "bootstrap/dist/css/bootstrap.css";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Docker deploy</title>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" async/>
      </head>


      <body className={inter.className}>
        <div className='container-fluid'>
          {/*
          <header>
            <Menu></Menu>
          </header>
          */}
          <section>
            {children}
          </section>
        </div>  
      </body>
    </html>
  )
}
