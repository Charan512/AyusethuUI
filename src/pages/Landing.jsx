import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import styles from "../styles/Landing.module.css";
import { MapPin, Cog, FlaskConical, Factory, Package, User, Mail, Phone, MapPin as MapPinIcon, Facebook, Twitter, Instagram, Linkedin, Play } from "lucide-react";

const videoFeedbacks = [
  { id: 1, title: "Ashwagandha Benefits", subtitle: "Dr. Meera Sharma", thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=700&fit=crop" },
  { id: 2, title: "Turmeric Healing Power", subtitle: "Ayurveda Expert", thumbnail: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=700&fit=crop" },
  { id: 3, title: "Herbal Purity Check", subtitle: "Lab Verified", thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=700&fit=crop" },
  { id: 4, title: "Farm to Formula", subtitle: "Supply Chain Story", thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=700&fit=crop" },
  { id: 5, title: "Natural Remedies", subtitle: "Customer Review", thumbnail: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=700&fit=crop" },
  { id: 6, title: "Triphala Benefits", subtitle: "Health Expert", thumbnail: "https://images.unsplash.com/photo-1505576399279-0d8e6b94e16b?w=400&h=700&fit=crop" },
  { id: 7, title: "Ayurvedic Lifestyle", subtitle: "Wellness Coach", thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=700&fit=crop" },
  { id: 8, title: "Organic Herbs", subtitle: "Farmer Testimonial", thumbnail: "https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?w=400&h=700&fit=crop" },
  { id: 9, title: "Quality Assurance", subtitle: "Lab Report Review", thumbnail: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=700&fit=crop" },
  { id: 10, title: "Brahmi for Memory", subtitle: "Neurologist Review", thumbnail: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=700&fit=crop" },
  { id: 11, title: "Neem Healing", subtitle: "Skin Specialist", thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=700&fit=crop" },
  { id: 12, title: "Sustainable Sourcing", subtitle: "Eco Initiative", thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=700&fit=crop" },
  { id: 13, title: "Amla Superfood", subtitle: "Nutrition Expert", thumbnail: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=700&fit=crop" },
  { id: 14, title: "Blockchain Tracking", subtitle: "Tech Innovation", thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=700&fit=crop" },
  { id: 15, title: "Customer Success", subtitle: "Happy Customer", thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=700&fit=crop" },
  { id: 16, title: "Shatavari Benefits", subtitle: "Women's Health", thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=700&fit=crop" },
  { id: 17, title: "GMP Certified", subtitle: "Factory Tour", thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=700&fit=crop" },
  { id: 18, title: "Herbal Tea Journey", subtitle: "Tea Master", thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=700&fit=crop" },
  { id: 19, title: "Moringa Magic", subtitle: "Superfood Guide", thumbnail: "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=400&h=700&fit=crop" },
  { id: 20, title: "AyuSethu Promise", subtitle: "Brand Story", thumbnail: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=700&fit=crop" },
];

const familyMembers = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1552058544-e2a2221ba29d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1541823709867-1b8599acbcaf?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=150&h=150&fit=crop"
];

const steps = [
  { icon: <MapPin size={34} />, title: "Farmer", text: "Geo-tagged harvesting with real-time capture of origin, species, and quality." },
  { icon: <Cog size={34} />, title: "Collector", text: "Centralized aggregation ensuring proper documentation, sorting, and authenticated handover." },
  { icon: <FlaskConical size={34} />, title: "Tester", text: "Laboratory validation of moisture, pesticides, DNA authentication, and purity metrics." },
  { icon: <Factory size={34} />, title: "Processing & Formulation", text: "Processed in certified facilities." },
  { icon: <Package size={34} />, title: "Manufacturer", text: "Processing, formulation, packaging, and final QR tagging powered by blockchain." },
  { icon: <User size={34} />, title: "Consumer", text: "Complete traceability access—origin, purity tests, sustainability, and batch details." }
];

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  
  const isAuthModalOpen = location.pathname === '/login' || location.pathname === '/register';
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const partners = [
    {
      name: "Ministry of AYUSH",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUPvl0I49rSjyNFVwwL5hT36Kts_96fNsmMw&s"
    },
    {
      name: "AICTE",
      logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/All_India_Council_for_Technical_Education_logo.png"
    },
    {
      name: "Ministry of Education",
      logo: "https://yt3.googleusercontent.com/ytc/AIdro_nvbN77Rr10PMOE14-VSDSpoobmph5fTY87bMyfCTg2twI=s900-c-k-c0x00ffffff-no-rj"
    },
    {
      name: "Smart India Hackathon",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk6H0AVFvn7QLD3oVo1RamBHA4sldUTQxYFw&s"
    },
    {
      name: "National Medical Board",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8ZbOlzYwzsI5WjOGJaY6QVKGSr2ka8V89nQ&s"
    }
  ];

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <div className={styles.navbar}>
        <nav>
          <img
            src="https://res.cloudinary.com/domogztsv/image/upload/v1765220874/WhatsApp_Image_2025-12-09_at_12.36.40_AM_bp8jxt.jpg"
            alt="logo"
            className={styles.logoImage}
          />
          <div className={styles.logo}>AyuSethu</div>
          <ul>
            <li onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}>About</li>
            <li onClick={() => {
              document.getElementById('how-we-work')?.scrollIntoView({ behavior: 'smooth' });
            }}>How We Work</li>
            <li onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>Contact</li>
          </ul>
        </nav>
      </div>

      {/* HERO SECTION */}
      <div className={styles.heroSection}>
        {/* IMAGE SLIDER */}
        <div className={styles.headerImage}>
          <img
            src="https://www.ayurorganic.com.au/cdn/shop/files/Ayurvedic_and_Organic_SIngle_and_Blended_Herbs_1.webp?v=1749389990&width=1500"
            className={styles.slide}
            alt="Herbs"
          />
          <img
            src="https://www.pharmamanch.in/wp-content/uploads/2024/09/Top-10-Herbal-Companies-In-India.jpg"
            className={styles.slide}
            alt="Herbal Companies"
          />
          <img
            src="https://t3.ftcdn.net/jpg/16/27/75/38/360_F_1627753819_TLWx2Fs1OZEc5BeHkA27IIsZkdUJerl8.jpg"
            className={styles.slide}
            alt="Ayurvedic Medicine"
          />
        </div>

        {/* HERO TEXT */}
        <div className={styles.heroText}>
          <h1>Track Every Herb</h1>
          <h2>From Farm to Formulation</h2>
          <p>Blockchain-powered traceability for authentic Ayurvedic formulations</p>
        </div>

        {/* LOGIN BUTTON */}
        <div className={styles.loginBtn}>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>

        {/* FEATURES SECTION */}
        <div className={styles.featuresSection}>
          <div className={styles.featureBox}>
            <MapPin size={42} className={styles.featureIcon} />
            <div>
              <h3 className={styles.featureTitle}>QR Code Product</h3>
              <p className={styles.featureSubtitle}>Verification</p>
            </div>
          </div>

          <div className={`${styles.featureBox} ${styles.darkBox}`}>
            <Cog size={42} className={styles.featureIcon} />
            <div>
              <h3 className={styles.featureTitle}>End-to-End</h3>
              <p className={styles.featureSubtitle}>Traceability Viewer</p>
            </div>
          </div>

          <div className={`${styles.featureBox} ${styles.greenBox}`}>
            <User size={42} className={styles.featureIcon} />
            <div>
              <h3 className={styles.featureTitle}>Multi-Language</h3>
              <p className={styles.featureSubtitle}>Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW WE WORK SECTION */}
      <section id="how-we-work" className={styles.workSection}>
        <h3 className={styles.workHeading}>How We Work</h3>
        <p className={styles.workTagline}>
          Ensuring transparency, purity, and trust at every stage.
        </p>

        <div className={styles.workContainer}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepWrapper}>
              <div className={styles.iconCircle}>{step.icon}</div>
              {i !== steps.length - 1 && <div className={styles.dash}></div>}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <div id="about" className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>Motive Of AyuSethu</h2>

        <div className={styles.aboutContentWrapper}>
          <div className={styles.aboutImageWrapper}>
            <img
              src="https://res.cloudinary.com/domogztsv/image/upload/v1765249221/WhatsApp_Image_2025-12-09_at_8.29.24_AM_um6q2w.jpg"
              className={styles.aboutImage}
              alt="Herbs"
            />
          </div>

          <div className={styles.aboutTextWrapper}>
            <p className={styles.aboutParagraph}>
              AYUSETHU aims to bring transparency, trust, and authenticity to the Ayurvedic herbal supply chain. Herbs pass through many hands—cultivators, mandis, labs, and manufacturers—and during this journey, information about origin, quality, and sustainability often gets lost.
              <br /><br />
              Our platform uses blockchain and geo-tagging to securely record every stage, from harvest to processing to the final product. Consumers can scan a QR code and see the herb's full journey, including lab tests, sustainability compliance, and fair-trade verification.
              <br /><br />
              With AYU SETHU, we ensure that every Ayurvedic product is pure, verifiable, and responsibly sourced, empowering both consumers and stakeholders with confidence in the medicine they use.
            </p>
          </div>
        </div>
      </div>

      {/* HEROIC INFO SECTION */}
      <section className={styles.heroicInfoSection}>
        <div className={styles.heroicInfoContainer}>
          <div className={styles.heroicInfoContent}>
            <h2 className={styles.heroicInfoTitle}>
              Ayurveda is one of the <span>most trusted</span> healing systems in the world.
            </h2>
            <p className={styles.heroicInfoSubtitle}>
              AyuSethu ensures a complex positive effect on trust. Daily use of verified Ayurvedic medicine is good for your health and peace of mind.
            </p>

            <div className={styles.heroicFeaturesGrid}>
              <div className={styles.heroicFeatureItem}>
                <div className={styles.hfIconWrapper}>
                  <MapPin size={20} />
                </div>
                <span>Improves source tracking</span>
              </div>
              <div className={styles.heroicFeatureItem}>
                <div className={styles.hfIconWrapper}>
                  <FlaskConical size={20} />
                </div>
                <span>Disinfects harmful substances</span>
              </div>
              <div className={styles.heroicFeatureItem}>
                <div className={styles.hfIconWrapper}>
                  <Factory size={20} />
                </div>
                <span>Promotes genuine formulation</span>
              </div>
              <div className={styles.heroicFeatureItem}>
                <div className={styles.hfIconWrapper}>
                  <Cog size={20} />
                </div>
                <span>Prolongs product shelf life</span>
              </div>
            </div>

            <button className={styles.heroicViewBtn}>
              View more <span className={styles.btnArrow}>&gt;</span>
            </button>
          </div>

          <div className={styles.heroicInfoVisuals}>
            <div className={styles.heroicMainImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=800&h=800&fit=crop"
                alt="Ayurvedic Bowl"
                className={styles.heroicMainImage}
              />
            </div>
            {/* Decorative smaller circles */}
            <div className={styles.heroicSideDeco1}></div>
            <div className={styles.heroicSideDeco2}>
              <div className={styles.colorWheel}>
                <span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div className={styles.heroicSideDeco3}></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialContainer}>
          <h2 className={styles.testimonialHeading}>What Our Customers Say</h2>
          <p className={styles.testimonialSubheading}>
            Hear from people who have trusted AyuSethu for their wellness journey.
          </p>
          <div className={styles.testimonialSlider}>
            <button className={styles.sliderBtn}>&lt;</button>
            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>”</div>
              <p className={styles.testimonialText}>
                "AyuSethu transformed my daily wellness routine. The natural formulations exceeded my expectations. Highly recommended!"
              </p>
              <div className={styles.testimonialAuthor}>
                <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop" alt="Dr. Meera Rao" />
                <div className={styles.authorInfo}>
                  <h4>Dr. Meera Rao</h4>
                  <span>Ayurveda Practitioner</span>
                </div>
              </div>
            </div>
            <button className={styles.sliderBtn}>&gt;</button>
          </div>
          <div className={styles.sliderDots}>
            <span className={`${styles.dot} ${styles.activeDot}`}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <img
                src="https://res.cloudinary.com/domogztsv/image/upload/v1765220874/WhatsApp_Image_2025-12-09_at_12.36.40_AM_bp8jxt.jpg"
                alt="AyuSethu Logo"
                className={styles.footerLogoImage}
              />
              <h3 className={styles.footerLogoText}>AyuSethu</h3>
            </div>
            <p className={styles.footerDescription}>
              Blockchain-powered traceability for authentic Ayurvedic formulations from farm to formulation.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#work">How We Work</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#login">Login</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Contact Us</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPinIcon size={18} />
                <span>123 Ayurveda Street, Haridwar, Uttarakhand, India 249401</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={18} />
                <span>info@ayusethu.com</span>
              </div>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Follow Us</h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon}><Facebook size={24} /></a>
              <a href="#" className={styles.socialIcon}><Twitter size={24} /></a>
              <a href="#" className={styles.socialIcon}><Instagram size={24} /></a>
              <a href="#" className={styles.socialIcon}><Linkedin size={24} /></a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} AyuSethu. All rights reserved.</p>
          <div className={styles.footerLegal}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* GLASSMORPHIC OVERLAY FOR AUTH */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4 sm:pt-20 sm:pb-10">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Landing;