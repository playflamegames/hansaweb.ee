import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

app.use(renderer)

// Main page
app.get('/', (c) => {
  return c.render(<HomePage />)
})

// API endpoint for contact form
app.post('/api/contact', async (c) => {
  try {
    const data = await c.req.json()
    
    // In a real application, you would:
    // 1. Validate the data
    // 2. Send email using a service like Resend, SendGrid, etc.
    // 3. Store in database if needed
    
    console.log('Contact form submission:', data)
    
    return c.json({ 
      success: true, 
      message: 'Sõnum on edukalt saadetud! Võtame teiega varsti ühendust.' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return c.json({ 
      success: false, 
      message: 'Viga sõnumi saatmisel. Palun proovige hiljem uuesti.' 
    }, 400)
  }
})

// API endpoint for pricing calculator
app.post('/api/calculate-price', async (c) => {
  try {
    const data = await c.req.json()
    
    // Load pricing configuration
    const config = {
      basePrice: 500,
      websiteTypeMultiplier: {
        single_page: 1.0,
        multi_page: 1.5,
        large_site: 2.5,
        ecommerce: 4.0,
        custom: 0
      },
      languageMultiplier: {
        single: 1.0,
        multi: {
          2: 1.3,
          3: 1.6,
          4: 1.9,
          5: 2.2
        }
      },
      deadlineMultiplier: {
        fast: 1.5,
        normal: 1.0,
        flexible: 0.9
      },
      featurePrices: {
        contact_form: 50,
        gallery: 100,
        blog: 200,
        booking: 300,
        other: 0
      }
    }
    
    let price = config.basePrice
    
    // Apply website type multiplier
    if (data.websiteType && config.websiteTypeMultiplier[data.websiteType]) {
      price *= config.websiteTypeMultiplier[data.websiteType]
    }
    
    // Apply language multiplier
    if (data.languages === 'multi' && data.languageCount) {
      const langMultiplier = config.languageMultiplier.multi[data.languageCount] || 1.0
      price *= langMultiplier
    }
    
    // Apply deadline multiplier
    if (data.deadline && config.deadlineMultiplier[data.deadline]) {
      price *= config.deadlineMultiplier[data.deadline]
    }
    
    // Add feature prices
    if (data.features && Array.isArray(data.features)) {
      data.features.forEach(feature => {
        if (config.featurePrices[feature]) {
          price += config.featurePrices[feature]
        }
      })
    }
    
    // Round to nearest 50
    price = Math.round(price / 50) * 50
    
    return c.json({ 
      price: price,
      breakdown: {
        basePrice: config.basePrice,
        websiteType: data.websiteType,
        languages: data.languages,
        deadline: data.deadline,
        features: data.features || []
      }
    })
  } catch (error) {
    console.error('Price calculation error:', error)
    return c.json({ 
      success: false, 
      message: 'Viga hinna arvutamisel. Palun proovige hiljem uuesti.' 
    }, 400)
  }
})

// Component for the main page
function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        {/* Animated Background */}
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="floating-elements">
            <div className="floating-icon" style={{animationDelay: '0s'}}><i className="fas fa-code"></i></div>
            <div className="floating-icon" style={{animationDelay: '2s'}}><i className="fas fa-mobile-alt"></i></div>
            <div className="floating-icon" style={{animationDelay: '4s'}}><i className="fas fa-rocket"></i></div>
            <div className="floating-icon" style={{animationDelay: '6s'}}><i className="fas fa-chart-line"></i></div>
            <div className="floating-icon" style={{animationDelay: '8s'}}><i className="fas fa-palette"></i></div>
          </div>
        </div>

        <div className="container">
          <div className="hero-content">
            {/* Badge */}
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>16+ aastat kogemust • Premium kvaliteet</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-headline">
              <span className="headline-highlight">Veebilehe loomine</span><br/>
              <span className="headline-normal">ei maksa tänapäeval enam</span><br/>
              <span className="headline-price">tuhandeid eurosid</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-subheadline">
              <strong>Professionaalsed veebilehed alates 500€</strong><br/>
              Võtmed kätte lahendus koos kogu sinu ettevõtte infoga
            </p>

            {/* Key Benefits */}
            <div className="hero-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <span>24h esimene näidis</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <span>AI-toetatud arendus</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💎</div>
                <span>Premium disain</span>
              </div>
            </div>

            {/* Hook Box */}
            <div className="hero-hook">
              <div className="hook-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="hook-content">
                <h3>Samal ajal kui teised ootavad nädalaid pakkumist...</h3>
                <p>Saad sina juba <strong>homme näha</strong> oma tulevast veebilehte!</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta">
              <button className="btn btn-primary btn-mega glow-effect" onClick={() => window.scrollToSection('contact')}>
                <span className="btn-icon">🎨</span>
                <span className="btn-text">
                  <strong>SAA TASUTA NÄIDIS</strong>
                  <small>Oma tulevast veebilehest</small>
                </span>
                <div className="btn-shine"></div>
              </button>
              <button className="btn btn-secondary btn-large" onClick={() => window.scrollToSection('pricing')}>
                <i className="fas fa-calculator"></i>
                Arvuta hind
              </button>
            </div>

            {/* Social Proof */}
            <div className="hero-social-proof">
              <div className="social-stats">
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Projekti</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Rahulolu</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24h</span>
                  <span className="stat-label">Esimene näidis</span>
                </div>
              </div>
            </div>

            {/* AI Mention */}
            <div className="hero-ai-mention">
              <div className="ai-icon">
                <i className="fas fa-brain"></i>
              </div>
              <p>Powered by <strong>AI & 16-year expertise</strong> - tehniliselt täiuslik tulemus garanteeritud</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-arrow">
            <i className="fas fa-chevron-down"></i>
          </div>
          <span>Vaata meie teenuseid</span>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Meie teenused</h2>
            <p>Professionaalsed digitaalsed lahendused, mis viivad sinu äri edasi</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>Veebilehtede arendus</h3>
              <p>Moodsad, kiirgad ja kasutajasõbralikud veebilehed, mis konverteerivad külastajaid klientideks.</p>
              
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Responsive disain kõigile seadmetele</li>
                <li><i className="fas fa-check"></i> SEO optimeeritud struktuur</li>
                <li><i className="fas fa-check"></i> Kiire laadimine (&lt;3 sekundit)</li>
                <li><i className="fas fa-check"></i> Turvaline ja stabiilne</li>
                <li><i className="fas fa-check"></i> Google Analytics integratsioon</li>
              </ul>
              
              <div className="service-footer">
                <div className="service-price">
                  <span className="price-from">alates</span>
                  <span className="price-amount">500€</span>
                </div>
                <button className="btn btn-service" onClick={() => window.scrollToSection('pricing')}>
                  Arvuta hind
                </button>
              </div>
            </div>
            
            <div className="service-card featured">
              <div className="featured-badge">Populaarseim</div>
              <div className="service-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobiilirakendused</h3>
              <p>Native iOS ja Android rakendused, mis pakuvad suurepärast kasutajakogemust ja jõudlust.</p>
              
              <ul className="service-features">
                <li><i className="fas fa-check"></i> Native arendus iOS & Android</li>
                <li><i className="fas fa-check"></i> App Store optimeerimine</li>
                <li><i className="fas fa-check"></i> Push-teadete tugi</li>
                <li><i className="fas fa-check"></i> Offline funktsioonid</li>
                <li><i className="fas fa-check"></i> Analytics ja crash reporting</li>
              </ul>
              
              <div className="service-footer">
                <div className="service-price">
                  <span className="price-from">alates</span>
                  <span className="price-amount">1500€</span>
                </div>
                <button className="btn btn-service" onClick={() => window.scrollToSection('contact')}>
                  Konsultatsioon
                </button>
              </div>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Hooldus & tugi</h3>
              <p>Jooksev tehnilline tugi, uuendused ja optimeerimine, et sinu digitaalne lahendus toimiks tõrgeteta.</p>
              
              <ul className="service-features">
                <li><i className="fas fa-check"></i> 24/7 monitooring</li>
                <li><i className="fas fa-check"></i> Regulaarsed uuendused</li>
                <li><i className="fas fa-check"></i> Turvalisuse auditid</li>
                <li><i className="fas fa-check"></i> Jõudluse optimeerimine</li>
                <li><i className="fas fa-check"></i> Varundamine ja taastamine</li>
              </ul>
              
              <div className="service-footer">
                <div className="service-price">
                  <span className="price-from">alates</span>
                  <span className="price-amount">99€</span>
                  <span className="price-period">/kuu</span>
                </div>
                <button className="btn btn-service" onClick={() => window.scrollToSection('contact')}>
                  Vali pakett
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="services-stats">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Projekti lõpetatud</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">16+</div>
              <div className="stat-label">Aastat kogemust</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Klientide rahulolu</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24h</div>
              <div className="stat-label">Esimese näidise aeg</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Hinnakalkulaator</h2>
            <p>Saa täpne hinnapakkumine oma projektile</p>
          </div>
          
          <div className="pricing-calculator">
            <form id="pricing-form" className="pricing-form">
              <div className="form-group">
                <label htmlFor="website-type">Veebilehe struktuur:</label>
                <select id="website-type" name="websiteType" required>
                  <option value="">Vali...</option>
                  <option value="single_page">Üheleheline informatiivne</option>
                  <option value="multi_page">Vähemalt kolm eraldi lehte</option>
                  <option value="large_site">Rohkem kui viieleheline</option>
                  <option value="ecommerce">Veebileht koos e-poega</option>
                  <option value="custom">Muu</option>
                </select>
              </div>

              <div className="form-group">
                <label>Keelevalik:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="languages" value="single" checked />
                    <span>Ühekeelne (Eesti keel)</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="languages" value="multi" />
                    <span>Mitmekeelne</span>
                  </label>
                </div>
                <div id="language-count-group" className="form-group" style={{display: 'none'}}>
                  <label htmlFor="language-count">Mitu keelt?</label>
                  <input type="number" id="language-count" name="languageCount" min="2" max="5" />
                </div>
              </div>

              <div className="form-group">
                <label>Tähtaeg:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="deadline" value="fast" />
                    <span>Kiire (1-2 nädalat)</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="deadline" value="normal" checked />
                    <span>Tavaline (3-4 nädalat)</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="deadline" value="flexible" />
                    <span>Pole kiiret</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Lisafunktsioonid:</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="features" value="contact_form" />
                    <span>Kontakt vorm</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="features" value="gallery" />
                    <span>Galerii</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="features" value="blog" />
                    <span>Blog</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="features" value="booking" />
                    <span>Broneerimissüsteem</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="features" value="other" />
                    <span>Muu</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Hoolduspakett:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="maintenance" value="yes" />
                    <span>Jah, soovin</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="maintenance" value="no" checked />
                    <span>Ei, teen ise</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="maintenance" value="later" />
                    <span>Hiljem otsustan</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="freeSample" value="yes" />
                  <span>Soovin saada tasuta lehenäidist</span>
                </label>
              </div>

              <div id="free-sample-fields" className="free-sample-fields" style={{display: 'none'}}>
                <div className="form-group">
                  <label htmlFor="company-name">Ettevõtte nimi:</label>
                  <input type="text" id="company-name" name="companyName" />
                </div>
                <div className="form-group">
                  <label htmlFor="business-field">Valdkond:</label>
                  <input type="text" id="business-field" name="businessField" />
                </div>
                <div className="form-group">
                  <label htmlFor="preferences">Eelistused:</label>
                  <textarea id="preferences" name="preferences" rows={3}></textarea>
                </div>
              </div>

              <div className="pricing-result">
                <div id="price-display" className="price-display">
                  <span className="price-label">Orienteeruv hind:</span>
                  <span className="price-amount">500€</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-large">
                SAA TÄPNE HINNAPAKKUMINE
              </button>
            </form>

            <div className="pricing-disclaimer">
              <p><strong>Märkus:</strong> See on informatiivne hinnakalkulaator. Täpne hinnapakkumine tehakse individuaalse läbirääkimise käigus, arvestades kõiki sinu spetsiifilisi vajadusi ja soove.</p>
              <p>Lõplik hind võib erineda sõltuvalt projekti keerukusest, disaini nõuetest ja lisafunktsioonidest. Võta ühendust täpse pakkumise saamiseks!</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>Meist</h2>
            <p>Usaldusväärne partner sinu digitaalses arengus</p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <div className="about-highlight">
                <i className="fas fa-award"></i>
                <h3>16+ aastat kogemust tehnoloogia valdkonnas</h3>
              </div>
              
              <p>Oleme spetsialiseerunud mängude arendusele (Playflame) ja nüüd laiendame oma professionaalseid teenuseid ning teadmisi Baltikumi turule.</p>
              
              <div className="about-features">
                <div className="about-feature">
                  <i className="fas fa-users"></i>
                  <span>Kogenud ja usaldusväärne meeskond</span>
                </div>
                <div className="about-feature">
                  <i className="fas fa-handshake"></i>
                  <span>Sinu digitaalse edu partner</span>
                </div>
                <div className="about-feature">
                  <i className="fas fa-rocket"></i>
                  <span>Innovaatilised tehnoloogilised lahendused</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Võta ühendust</h2>
            <p>Alustame sinu projekti juba täna!</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-form-wrapper">
              <form id="contact-form" className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Nimi *</label>
                    <input type="text" id="contact-name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-company">Firma nimi</label>
                    <input type="text" id="contact-company" name="company" />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-email">Email *</label>
                    <input type="email" id="contact-email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">Telefon *</label>
                    <input type="tel" id="contact-phone" name="phone" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="contact-message">Sõnum</label>
                  <textarea id="contact-message" name="message" rows={5}></textarea>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="contactFreeSample" value="yes" />
                    <span>Soovin saada tasuta lehenäidist</span>
                  </label>
                </div>
                
                <div id="contact-free-sample-fields" className="free-sample-fields" style={{display: 'none'}}>
                  <div className="form-group">
                    <label htmlFor="contact-company-name">Ettevõtte nimi:</label>
                    <input type="text" id="contact-company-name" name="contactCompanyName" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-business-field">Valdkond:</label>
                    <input type="text" id="contact-business-field" name="contactBusinessField" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-preferences">Eelistused:</label>
                    <textarea id="contact-preferences" name="contactPreferences" rows={3}></textarea>
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary btn-large">
                  SAADA SÕNUM
                </button>
              </form>
            </div>
            
            <div className="contact-info">
              <div className="contact-info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:info@hansaweb.ee">info@hansaweb.ee</a></p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <i className="fas fa-phone"></i>
                <div>
                  <h4>Telefon</h4>
                  <p><a href="tel:+37255550000">+372 5555 0000</a></p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Aadress</h4>
                  <p>Koidula 33, Rakvere, Eesti</p>
                </div>
              </div>
              
              <div className="contact-info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Tööaeg</h4>
                  <p>E-R 9:00-18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default app
