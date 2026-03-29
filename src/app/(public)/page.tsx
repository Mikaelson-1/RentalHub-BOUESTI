import Link from "next/link";

const featuredListings = [
  {
    title: "Modern Self-Contain",
    location: "Uro",
    price: "₦160,000/year",
    distance: "0.7km",
    amenities: ["Borehole", "Prepaid Meter", "Fenced"],
  },
  {
    title: "Student Apartment (2 Units)",
    location: "Ikoyi Estate",
    price: "₦210,000/year",
    distance: "0.4km",
    amenities: ["Wardrobe", "Kitchen Cabinet", "Night Watchman"],
  },
  {
    title: "Budget Single Room",
    location: "Afao",
    price: "₦95,000/year",
    distance: "1.4km",
    amenities: ["Well Water", "Shared Meter", "Tiled Floors"],
  },
];

const schools = [
  { value: "BOUESTI - Ikere-Ekiti", label: "BOUESTI - Ikere-Ekiti" },
  { value: "University of Lagos (UNILAG)", label: "University of Lagos (UNILAG)" },
  { value: "Obafemi Awolowo University (OAU)", label: "Obafemi Awolowo University (OAU)" },
  { value: "University of Ibadan (UI)", label: "University of Ibadan (UI)" },
  { value: "University of Benin (UNIBEN)", label: "University of Benin (UNIBEN)" },
  { value: "Federal University of Technology Akure (FUTA)", label: "Federal University of Technology Akure (FUTA)" },
  { value: "University of Ilorin (UNILORIN)", label: "University of Ilorin (UNILORIN)" },
  { value: "Ahmadu Bello University (ABU)", label: "Ahmadu Bello University (ABU)" },
  { value: "University of Nigeria Nsukka (UNN)", label: "University of Nigeria Nsukka (UNN)" },
  { value: "Covenant University", label: "Covenant University" },
];

const faqs = [
  {
    q: "How do I know a listing is real?",
    a: "Each approved listing passes platform checks and is tied to a verified landlord profile.",
  },
  {
    q: "Can landlords list immediately after signup?",
    a: "Landlords can create accounts immediately, but property listings go live only after admin review.",
  },
  {
    q: "Can students contact landlords directly?",
    a: "Yes. Once you identify a property, you can proceed through booking flow and outreach options.",
  },
  {
    q: "Are there hidden fees?",
    a: "RentalHub emphasizes transparent rent and charge disclosure before booking decisions.",
  },
  {
    q: "What if I spot a suspicious listing?",
    a: "Report it through support, and our admin team will investigate and take action quickly.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-[#192F59] leading-[0.95] tracking-tight">
                YOUR
                <br />
                CAMPUS
                <br />
                HOME
              </h1>

              <p className="font-sans text-base text-gray-500 mt-6 ml-1">
                / Verified off-campus student housing /
              </p>

              <form action="/properties" method="GET" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                <div className="relative flex-1">
                  <select
                    name="school"
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 font-sans text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/20 focus:border-[#E67E22] cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">Select school...</option>
                    {schools.map((school) => (
                      <option key={school.value} value={school.value}>
                        {school.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#E67E22] hover:bg-[#D35400] text-white font-sans text-sm font-semibold px-8 py-3.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="relative">
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-6 lg:p-8">
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-4 py-1.5 border border-gray-200 rounded-full font-sans text-xs text-gray-600">
                    Verified
                  </span>
                  <span className="px-4 py-1.5 border border-gray-200 rounded-full font-sans text-xs text-gray-600">
                    Secure
                  </span>
                  <span className="px-4 py-1.5 bg-[#192F59] rounded-full font-sans text-xs text-white">
                    Close to Campus
                  </span>
                </div>

                <h2 className="font-sans text-2xl font-semibold text-[#192F59] mb-1">
                  Premium Student Living
                </h2>
                <p className="font-sans text-sm text-gray-500 mb-6">
                  From single rooms to shared apartments.
                </p>

                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-[280px] overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-40 h-40 text-gray-300" viewBox="0 0 200 160" fill="none">
                        <rect x="30" y="60" width="140" height="80" fill="#e5e5e5" stroke="#d4d4d4" strokeWidth="2"/>
                        <rect x="20" y="50" width="160" height="15" fill="#d4d4d4" stroke="#c4c4c4" strokeWidth="2"/>
                        <rect x="45" y="75" width="25" height="35" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                        <rect x="87" y="75" width="25" height="35" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                        <rect x="130" y="75" width="25" height="35" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                        <rect x="45" y="120" width="25" height="15" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                        <rect x="87" y="120" width="25" height="15" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                        <rect x="130" y="120" width="25" height="15" fill="#f0f0f0" stroke="#d4d4d4" strokeWidth="1"/>
                        <rect x="85" y="110" width="30" height="30" fill="#c4c4c4" stroke="#b4b4b4" strokeWidth="1"/>
                        <path d="M10 50 L100 20 L190 50" fill="none" stroke="#b4b4b4" strokeWidth="3"/>
                      </svg>
                    </div>
                    <div className="absolute top-4 left-4 w-3 h-3 bg-[#E67E22] rounded-full" />
                    <div className="absolute top-8 right-8 w-2 h-2 bg-[#192F59] rounded-full" />
                  </div>

                  <div className="absolute bottom-2 right-2 sm:-bottom-4 sm:-right-4 bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                    <p className="font-sans text-[10px] font-bold text-[#192F59] tracking-wider mb-2">VIRTUAL TOUR</p>
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 bg-[#E67E22] rounded-full flex items-center justify-center hover:bg-[#D35400] transition-colors">
                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#E67E22] uppercase">Approved Listings</p>
            <h2 className="text-3xl font-serif text-[#192F59] mt-2">Featured Properties</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <div key={listing.title} className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-sm text-gray-500">{listing.location}</p>
                <h3 className="text-xl font-semibold text-[#192F59] mt-1">{listing.title}</h3>
                <p className="text-[#00A553] font-bold text-lg mt-3">{listing.price}</p>
                <p className="text-sm text-gray-500 mt-1">{listing.distance} to campus</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {listing.amenities.map((amenity) => (
                    <span key={amenity} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>

                <Link
                  href="/properties"
                  className="inline-block mt-5 text-sm font-semibold text-[#192F59] hover:text-[#E67E22] transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest text-[#E67E22] uppercase text-center">How It Works</p>
          <h2 className="text-3xl font-serif text-[#192F59] mt-2 text-center">Simple for Students. Efficient for Landlords.</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
              <h3 className="text-xl font-semibold text-[#192F59]">For Students</h3>
              <ol className="mt-4 space-y-3 text-sm text-gray-700">
                <li>1. Browse verified hostels by area, rent, and distance.</li>
                <li>2. Compare amenities and short-list your best options.</li>
                <li>3. Book confidently and follow up with property owners.</li>
              </ol>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
              <h3 className="text-xl font-semibold text-[#192F59]">For Landlords</h3>
              <ol className="mt-4 space-y-3 text-sm text-gray-700">
                <li>1. Register and complete landlord profile verification.</li>
                <li>2. Submit listings with clear rent, fees, and amenities.</li>
                <li>3. Get reviewed and connect with serious student renters.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest text-[#E67E22] uppercase text-center">FAQ</p>
          <h2 className="text-3xl font-serif text-[#192F59] mt-2 text-center">Questions students and landlords ask most</h2>

          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="group bg-gray-50 border border-gray-200 rounded-xl p-5">
                <summary className="cursor-pointer font-semibold text-[#192F59] list-none">
                  {item.q}
                </summary>
                <p className="text-sm text-gray-600 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#192F59] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs font-bold text-[#F39C12] uppercase tracking-widest mb-4">Get Started Today</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
            Ready to Find Your
            <br />
            <span className="italic">Perfect Hostel?</span>
          </h2>
          <p className="font-sans text-gray-300 text-base mb-10 max-w-lg mx-auto">
            Join students and landlords already using RentalHub NG to make housing decisions easier and safer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="bg-[#E67E22] hover:bg-[#D35400] text-white font-sans text-sm font-semibold px-10 py-4 rounded-xl transition-colors"
            >
              FIND A HOSTEL
            </Link>
            <Link
              href="/register?role=LANDLORD"
              className="border border-white/30 hover:border-white text-white font-sans text-sm font-semibold px-10 py-4 rounded-xl transition-colors"
            >
              LIST YOUR PROPERTY
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
