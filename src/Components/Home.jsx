import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../assets/Style/style.css";
import video2 from "../assets/Image/vid2-small.mp4";
import video4 from "../assets/Image/vid4-small.mp4";

import image1 from "../assets/Image/beach1.jpg";
import image2 from "../assets/Image/beach2.jpg";
import image3 from "../assets/Image/beach3.webp";
import image4 from "../assets/Image/beachbot.png";
import image5 from "../assets/Image/beachtab.png";

gsap.registerPlugin(ScrollTrigger);

// Bottle table mela evlo ullaye ukkaranum (table width-la %)
// 0 = table-oda pinnadi edge, 0.05 = naduvula, 0.1 = munnadi edge
// Bottle konjam mela irundha number-a yethunga, table-kulla pona kuraiyunga
const SINK = 0.05;

// Booking form start aagum bodhu irukkura empty values
const emptyForm = {
  name: "",
  email: "",
  phone: "",
  checkin: "",
  checkout: "",
  guests: "2",
  room: "Garden Room",
  notes: "",
};

// 3 image rows (left image / right image / left image)
const stays = [
  {
    title: "Wake Up Facing the Sea",
    text: "Open your curtains to a wide blue horizon. Our rooms are placed so the first light of the day falls right on your bed.",
    image: image1,
  },
  {
    title: "Balconies Made for Sunsets",
    text: "Every balcony has soft seating and an open view of the water. Slow evenings start here.",
    image: image2,
  },
  {
    title: "Beach Stays, Your Way",
    text: "Step out of your room and onto the sand. Quiet mornings, long walks and calm waves, all within a few steps.",
    image: image3,
  },
];

const rooms = [
  {
    name: "Garden Room",
    text: "A calm room that opens onto our palm garden. Perfect for a quiet getaway.",
    details: ["28 sq m", "King bed", "Garden view"],
    price: "₹6,500",
  },
  {
    name: "Ocean View Suite",
    text: "Wake up to the sea from your private balcony. Sunrise starts right at your window.",
    details: ["45 sq m", "King bed", "Sea view balcony"],
    price: "₹11,000",
  },
  {
    name: "Beachfront Cottage",
    text: "A cottage just steps from the sand, with an outdoor sit-out and hammock.",
    details: ["55 sq m", "King bed", "Direct beach access"],
    price: "₹15,500",
  },
  {
    name: "Private Pool Villa",
    text: "Our finest stay. A villa with its own pool, lounge and open-air shower.",
    details: ["90 sq m", "2 bedrooms", "Private pool"],
    price: "₹24,000",
  },
];

// PNG-la mela and keezha irukkura transparent idam evlo nu kandupidikkum.
// Adhunaala bottle table mela crct-a land aagum.
function findEdges(src) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      // Chinna size-la scan pannuvom (vegama irukkum)
      const scale = Math.min(1, 400 / img.width);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height).data;

      // Intha row-la theriyura pixel iruka nu check
      const rowHasPixel = (row) => {
        for (let x = 0; x < width; x++) {
          const alpha = data[(row * width + x) * 4 + 3];
          if (alpha > 40) {
            return true;
          }
        }
        return false;
      };

      let top = 0;
      while (top < height - 1 && !rowHasPixel(top)) {
        top++;
      }

      let bottom = height - 1;
      while (bottom > 0 && !rowHasPixel(bottom)) {
        bottom--;
      }

      // 0 to 1 la sollrom (image height-la evlo %)
      resolve({ top: top / height, bottom: (bottom + 1) / height });
    };

    // Edhavadhu problem na default values
    img.onerror = () => resolve({ top: 0, bottom: 1 });
    img.src = src;
  });
}

// Instagram icon (SVG, install onnum venaam)
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

// WhatsApp icon (SVG)
function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Home() {
  // Refs = JS-la indha elements-a thotta use aagum
  const journeyRef = useRef(null);
  const bottleRef = useRef(null);
  const tableRef = useRef(null);

  // Booking form states
  const [showForm, setShowForm] = useState(false); // form open aagiducha
  const [sent, setSent] = useState(false); // submit pannittaanga na true
  const [formData, setFormData] = useState(emptyForm);

  // Check-in date-ku innaiku-ku munnadi select panna mudiyaadhu
  const today = new Date().toISOString().split("T")[0];

  // Form close pannumbodhu ellam reset
  const closeForm = () => {
    setShowForm(false);
    setSent(false);
    setFormData(emptyForm);
  };

  // Input type panna state update aagum
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit click panna
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    let mm;
    let cancelled = false;

    // Rendu image-oda transparent edges-a kandupidichittu animation start
    Promise.all([findEdges(image4), findEdges(image5)]).then(
      ([bottleEdge, tableEdge]) => {
        if (cancelled) {
          return;
        }

        const journey = journeyRef.current;
        const bottle = bottleRef.current;
        const table = tableRef.current;

        // Bottle evlo px keezha poganum nu calculate pannum
        const getDistance = () => {
          const journeyRect = journey.getBoundingClientRect();
          const tableRect = table.getBoundingClientRect();

          // Table image journey-la evlo keezha irukku
          const tableTop = tableRect.top - journeyRect.top;

          // Tabletop-oda surface yengaye irukku (transparent idam vittutu)
          const landingY =
            tableTop +
            tableRect.height * tableEdge.top +
            tableRect.width * SINK;

          // Bottle image-la bottle-oda adi evlo keezha irukku
          const bottleBase = bottle.offsetHeight * bottleEdge.bottom;

          // Bottle start idam = bottle.offsetTop
          return landingY - bottleBase - bottle.offsetTop;
        };

        mm = gsap.matchMedia();

        // Computer / big screen: scroll pannum bodhu bottle keezha varum
        mm.add("(min-width: 901px)", () => {
          gsap.set(bottle, { opacity: 1 });

          gsap.fromTo(
            bottle,
            { y: 0 },
            {
              y: () => getDistance(),
              ease: "none",
              scrollTrigger: {
                trigger: journey,
                start: "top top",
                end: () => "+=" + Math.max(1, getDistance()),
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        // Mobile: animation illa, bottle direct-a table mela nikkum
        mm.add("(max-width: 900px)", () => {
          const place = () => {
            gsap.set(bottle, { opacity: 1, y: getDistance() });
          };

          place();
          window.addEventListener("resize", place);

          return () => window.removeEventListener("resize", place);
        });

        ScrollTrigger.refresh();
      }
    );

    return () => {
      cancelled = true;
      if (mm) {
        mm.revert();
      }
    };
  }, []);

  return (
    <div className="resort-page">
      <nav className="resort-nav">
        <div className="resort-logo">Beach Stay</div>

        <ul className="resort-nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#rooms">Rooms</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ---------- HERO (video2 background) ---------- */}
      <section className="resort-hero" id="home">
        <video
          className="resort-video"
          src={video2}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="resort-hero-overlay"></div>

        <div className="resort-hero-content">
          <h1 className="resort-hero-title mt-5">Where the Ocean Becomes Home</h1>
          <p className="resort-hero-text">
            Private beach, quiet villas and sunsets you will not forget.
            Book your seaside escape with Azure Bay Resort.
          </p>

          <div className="resort-hero-buttons">
            <a href="#" className="resort-btn resort-btn-fill">
              Explore Rooms
            </a>
            <a href="#" className="resort-btn resort-btn-line">
              Book Your Stay
            </a>
          </div>
        </div>
      </section>

      {/* ---------- BOTTLE + IMAGES + TABLE (white) ---------- */}
      <section className="resort-journey" ref={journeyRef}>
        {/* The bottle. GSAP scroll pannumbothu keezha kondu varum */}
        <img
          ref={bottleRef}
          className="resort-bottle"
          src={image4}
          alt="Chilled beach drink bottle"
        />

        {/* Part 1: bottle comes down through this part */}
        <div className="resort-fall-zone">
          {/* Bottle in the center, small content left and right */}
          <div className="resort-bottle-intro">
            <div className="resort-side-text resort-side-left">
              <h3 className="resort-side-title">Fresh From the Shore</h3>
              <p>
                Tender coconut, cold pressed juices and chilled coolers,
                served right on the sand.
              </p>
            </div>

            <div className="resort-gap"></div>

            <div className="resort-side-text resort-side-right">
              <h3 className="resort-side-title">Sunset Sips</h3>
              <p>
                Mocktails and sunset specials made fresh at our beach bar,
                from noon until late.
              </p>
            </div>
          </div>

          {/* 3 rows: image left / image right / image left */}
          {stays.map((item, index) => (
            <div
              key={item.title}
              className={
                index % 2 === 0 ? "resort-row" : "resort-row resort-row-reverse"
              }
            >
              <img className="resort-row-image" src={item.image} alt={item.title} />

              <div className="resort-row-text">
                <h3 className="resort-row-title">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Part 2: table. Bottle inge land aagum */}
        <div className="resort-table-area">
          <div className="resort-side-text resort-side-left">
            <h3 className="resort-side-title">The Beach Bar</h3>
            <p>
              Pull up a seat at our table by the water. Every drink is
              made fresh to order.
            </p>
          </div>

          <div className="resort-table-center">
            <img
              ref={tableRef}
              className="resort-table-img"
              src={image5}
              alt="Beach bar table"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>

          <div className="resort-side-text resort-side-right">
            <h3 className="resort-side-title">Open All Day</h3>
            <p>
              From morning coconut water to evening coolers, the bar is
              open from 9 am to 11 pm.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- BOOKING AREA (white) ---------- */}
      <section className="resort-booking" id="booking">
        <div className="resort-booking-card">
          <h2 className="resort-booking-title">Ready for Your Seaside Escape?</h2>
          <p className="resort-booking-text">
            Pick your dates, choose your room and we will take care of the
            rest. Booking takes less than a minute.
          </p>

          <div className="resort-booking-facts">
            <div className="resort-booking-fact">
              <strong>Check-in</strong>
              <span>From 2 pm</span>
            </div>
            <div className="resort-booking-fact">
              <strong>Check-out</strong>
              <span>Until 11 am</span>
            </div>
            <div className="resort-booking-fact">
              <strong>Airport pickup</strong>
              <span>On request</span>
            </div>
          </div>

          <button className="resort-book-btn" onClick={() => setShowForm(true)}>
            Book Now
          </button>
        </div>
      </section>

      {/* ---------- BOOKING FORM (Book Now click panna varum) ---------- */}
      {showForm && (
        <div className="resort-modal-overlay" onClick={closeForm}>
          {/* Form box kulla click panna close aagaadhu */}
          <div className="resort-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="resort-modal-close"
              onClick={closeForm}
              aria-label="Close booking form"
            >
              ×
            </button>

            {sent ? (
              // Submit aanadhukku apram success message
              <div className="resort-success">
                <h3 className="resort-modal-title">Thank you, {formData.name}!</h3>
                <p className="resort-modal-text">
                  We have received your request. Our team will contact you
                  shortly to confirm your stay.
                </p>
                <button className="resort-book-btn" onClick={closeForm}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="resort-modal-title">Book Your Stay</h3>
                <p className="resort-modal-text">
                  Fill in your details and we will get back to you.
                </p>

                <form className="resort-form" onSubmit={handleSubmit}>
                  <div className="resort-field resort-field-full">
                    <label htmlFor="name">Full name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="resort-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="resort-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="resort-field">
                    <label htmlFor="checkin">Check-in</label>
                    <input
                      id="checkin"
                      name="checkin"
                      type="date"
                      min={today}
                      value={formData.checkin}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="resort-field">
                    <label htmlFor="checkout">Check-out</label>
                    <input
                      id="checkout"
                      name="checkout"
                      type="date"
                      min={formData.checkin || today}
                      value={formData.checkout}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="resort-field">
                    <label htmlFor="guests">Guests</label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                    >
                      {[1, 2, 3, 4, 5, 6].map((number) => (
                        <option key={number} value={number}>
                          {number} {number === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="resort-field">
                    <label htmlFor="room">Room type</label>
                    <select
                      id="room"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                    >
                      {rooms.map((room) => (
                        <option key={room.name} value={room.name}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="resort-field resort-field-full">
                    <label htmlFor="notes">Special requests (optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      placeholder="Anything we should know?"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="resort-submit-btn">
                    Confirm Booking Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------- ABOUT + ROOMS (white) ---------- */}
      <section className="resort-rooms-section">
        <div className="resort-intro" id="about">
          <h2 className="resort-section-title">Stay Where the Waves Begin</h2>
          <p className="resort-section-text">
            Azure Bay is a quiet beach resort with four types of stays, each
            built around the sea, the sand and the sky.
          </p>
        </div>

        <div className="resort-room-list" id="rooms">
          {rooms.map((room, index) => (
            <div
              key={room.name}
              // Even index = left (pink), odd index = right (blue)
              className={
                index % 2 === 0
                  ? "resort-room resort-room-left"
                  : "resort-room resort-room-right"
              }
            >
              <h3 className="resort-room-name">{room.name}</h3>
              <p className="resort-room-text">{room.text}</p>

              <ul className="resort-room-details">
                {room.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="resort-room-bottom">
                <div className="resort-room-price">
                  {room.price} <span>per night</span>
                </div>
                <a href="#" className="resort-room-link">
                  Book this room
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FOOTER (video4 background) ---------- */}
      <footer className="resort-footer" id="contact">
        <video
          className="resort-video"
          src={video4}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="resort-footer-overlay"></div>

        <div className="resort-footer-content">
          <h2 className="resort-footer-title">Your Seaside Escape Awaits</h2>

          {/* 3 line slogan */}
          <div className="resort-slogan">
            <p>Salt air in the morning.</p>
            <p>Golden sunsets by evening.</p>
            <p>Memories that stay long after you leave.</p>
          </div>

          {/* Glass panel - points, links, contact */}
          <div className="resort-footer-panel">
            <div className="resort-footer-col">
              <h3>Why guests love us</h3>
              <div className="resort-point">
                <strong>Private beach</strong>
                <span>Just 50 steps from every room.</span>
              </div>
              <div className="resort-point">
                <strong>Dining by the sea</strong>
                <span>Fresh seafood served all day.</span>
              </div>
            </div>

            <div className="resort-footer-col">
              <h3>Quick links</h3>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#rooms">Rooms</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="resort-footer-col">
              <h3>Contact us</h3>
              <p>12 Beach Road, Varkala, Kerala, India</p>
              <p>+91 98765 43210</p>
              <p>stay@azurebayresort.com</p>

              <div className="resort-social">
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="resort-social-icon resort-insta"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://wa.me/919363654435"
                  target="_blank"
                  rel="noreferrer"
                  className="resort-social-icon resort-whatsapp"
                  aria-label="WhatsApp"
                >
                  <WhatsappIcon />
                </a>
              </div>
            </div>
          </div>

          <p className="resort-copy">
            © 2026 Beach Stay Resort. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;