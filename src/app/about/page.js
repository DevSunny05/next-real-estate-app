import Link from "next/link";
import { FaHome, FaUsers, FaAward, FaHandshake, FaChartLine, FaShieldAlt } from "react-icons/fa";

export default function About() {
  const stats = [
    { number: "10K+", label: "Properties Listed" },
    { number: "5K+", label: "Happy Clients" },
    { number: "500+", label: "Expert Agents" },
    { number: "15+", label: "Years Experience" },
  ];

  const features = [
    {
      icon: <FaHome className="text-4xl" />,
      title: "Wide Selection",
      description: "Browse thousands of properties from apartments to luxury estates",
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Secure Transactions",
      description: "Your safety and security are our top priorities in every transaction",
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Expert Team",
      description: "Work with experienced real estate professionals dedicated to your success",
    },
    {
      icon: <FaAward className="text-4xl" />,
      title: "Award Winning",
      description: "Recognized for excellence in customer service and property management",
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Market Insights",
      description: "Get expert market analysis and pricing guidance for informed decisions",
    },
    {
      icon: <FaHandshake className="text-4xl" />,
      title: "Trusted Service",
      description: "Building lasting relationships through transparency and integrity",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About Our Estate
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Our Estate is a leading real estate platform dedicated to helping you find
              your dream property. With years of experience in the industry, we've
              built a reputation for excellence, integrity, and customer satisfaction.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              We understand that buying, selling, or renting a property is one of the
              most significant decisions in your life. That's why we're committed to
              providing you with the best tools, resources, and support throughout your
              real estate journey.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform connects property seekers with verified listings, experienced
              agents, and comprehensive market insights to make informed decisions.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/rent.webp"
                alt="Modern real estate office"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <FaAward className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To simplify the real estate process and empower everyone to find their
                perfect home or investment property through innovative technology,
                exceptional service, and trusted partnerships.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and innovative real estate platform,
                transforming how people discover, evaluate, and secure their ideal
                properties while building lasting relationships with our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="py-6">
                <div className="text-4xl sm:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best real estate experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">
                We conduct business with honesty, transparency, and ethical practices
                in everything we do.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Customer First
              </h3>
              <p className="text-gray-600">
                Your needs and satisfaction are at the heart of every decision we make
                and action we take.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-blue-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in service quality, innovation, and continuous
                improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your real estate journey with us today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse Properties
            </Link>
            <Link
              href="/create-listing"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
