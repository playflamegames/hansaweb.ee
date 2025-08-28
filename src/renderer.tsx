import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="et">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HansaWeb - Professionaalsed veebilehed alates 500€</title>
        <meta name="description" content="Professionaalsete veebilehtede ja mobiilirakenduste arendus. Lihtsa veebilehe hinnad alates 500€. Samal ajal kui teised ootavad nädalaid, saad sina juba homme näha oma tulevast veebilehte!" />
        <meta name="keywords" content="veebileht, koduleht, e-pood, mobiilirakendus, SEO, Eesti, Rakvere" />
        <meta name="author" content="HansaWeb" />
        
        {/* Open Graph */}
        <meta property="og:title" content="HansaWeb - Professionaalsed veebilehed alates 500€" />
        <meta property="og:description" content="Professionaalsete veebilehtede ja mobiilirakenduste arendus. Lihtsa veebilehe hinnad alates 500€." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hansaweb.ee" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* External Resources */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom Styles */}
        <link href="/style.css?v=5" rel="stylesheet" />
        
        {/* Tailwind Config */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#eff6ff',
                      100: '#dbeafe', 
                      200: '#bfdbfe',
                      300: '#93c5fd',
                      400: '#60a5fa',
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8',
                      800: '#1e40af',
                      900: '#1e3a8a'
                    },
                    gray: {
                      50: '#f9fafb',
                      100: '#f3f4f6',
                      200: '#e5e7eb',
                      300: '#d1d5db',
                      400: '#9ca3af',
                      500: '#6b7280',
                      600: '#4b5563',
                      700: '#374151',
                      800: '#1f2937',
                      900: '#111827'
                    }
                  },
                  fontFamily: {
                    'sans': ['Inter', 'system-ui', 'sans-serif']
                  }
                }
              }
            }
          `
        }} />
        
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {/* Navigation */}
        <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <a href="#" className="text-2xl font-bold text-primary-600">HansaWeb</a>
              </div>
              
              <div className="hidden md:flex space-x-8">
                <a href="#hero" className="text-gray-700 hover:text-primary-600 transition duration-300">Avaleht</a>
                <a href="#services" className="text-gray-700 hover:text-primary-600 transition duration-300">Teenused</a>
                <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition duration-300">Hinnad</a>
                <a href="#about" className="text-gray-700 hover:text-primary-600 transition duration-300">Meist</a>
                <a href="#contact" className="text-gray-700 hover:text-primary-600 transition duration-300">Kontakt</a>
              </div>
              
              <div className="md:hidden">
                <button id="mobile-menu-btn" className="text-gray-700 hover:text-primary-600">
                  <i className="fas fa-bars text-xl"></i>
                </button>
              </div>
            </div>
            
            {/* Mobile Menu */}
            <div id="mobile-menu" className="md:hidden hidden pb-4">
              <a href="#hero" className="block py-2 text-gray-700 hover:text-primary-600 transition duration-300">Avaleht</a>
              <a href="#services" className="block py-2 text-gray-700 hover:text-primary-600 transition duration-300">Teenused</a>
              <a href="#pricing" className="block py-2 text-gray-700 hover:text-primary-600 transition duration-300">Hinnad</a>
              <a href="#about" className="block py-2 text-gray-700 hover:text-primary-600 transition duration-300">Meist</a>
              <a href="#contact" className="block py-2 text-gray-700 hover:text-primary-600 transition duration-300">Kontakt</a>
            </div>
          </div>
        </nav>

        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary-400">HansaWeb</h3>
                <p className="text-gray-300 mb-4">Professionaalsed veebilehed ja mobiilirakendused</p>
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/in/ander-kumm-1a636825/" target="_blank" className="text-gray-400 hover:text-primary-400 transition duration-300">
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Teenused</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#services" className="hover:text-primary-400 transition duration-300">Veebilehtede arendus</a></li>
                  <li><a href="#services" className="hover:text-primary-400 transition duration-300">Mobiilirakendused</a></li>
                  <li><a href="#services" className="hover:text-primary-400 transition duration-300">SEO optimeerimine</a></li>
                  <li><a href="#services" className="hover:text-primary-400 transition duration-300">Hooldus</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><i className="fas fa-envelope mr-2"></i> info@hansaweb.ee</li>
                  <li><i className="fas fa-phone mr-2"></i> +372 5555 0000</li>
                  <li><i className="fas fa-map-marker-alt mr-2"></i> Koidula 33, Rakvere</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Lingid</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-primary-400 transition duration-300">Privaatsuspoliitika</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition duration-300">Teenuste tingimused</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400">© 2025 HansaWeb. Kõik õigused kaitstud.</p>
              <p className="text-gray-500 mt-2 text-sm">Loodud AI ja armastusega Eestis</p>
            </div>
          </div>
        </footer>

        {/* JavaScript */}
        <script src="/app.js?v=5"></script>
      </body>
    </html>
  )
})
