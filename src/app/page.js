import { headers } from "next/headers";
import Link from "next/link";
import { FaMapMarkedAlt, FaBed, FaBath } from "react-icons/fa";

const LOCAL_HOST_PATTERNS = ["localhost", "127.0.0.1"];

async function resolveBaseUrl() {
  const envBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.URL ||
    process.env.VERCER_URL ||
    process.env.VERCEL_URL ||
    "";

  if (
    envBase &&
    !LOCAL_HOST_PATTERNS.some((pattern) => envBase.includes(pattern))
  ) {
    return envBase.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("host") || "localhost:3000";
  const protocol = LOCAL_HOST_PATTERNS.some((pattern) => host.includes(pattern))
    ? "http"
    : "https";
  return `${protocol}://${host}`;
}

function formatPrice(value = 0) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function ListingCard({ listing }) {
  const price = listing.offer && listing.discountedPrice
    ? listing.discountedPrice
    : listing.regularPrice;

  return (
    <Link
      href={`/listing/${listing._id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.imageUrls?.[0] || "/placeholder.jpg"}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {listing.offer && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Special Offer
          </span>
        )}
        <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {listing.name}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <FaMapMarkedAlt className="mr-1 text-blue-600" />
          <span className="line-clamp-1">{listing.address}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaBed className="text-blue-600" />
              {listing.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <FaBath className="text-blue-600" />
              {listing.bathrooms}
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </p>
            {listing.type === "rent" && (
              <p className="text-xs text-gray-500">/ month</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ListingSection({ title, listings, viewAllLink, viewAllText = "View All" }) {
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <Link
          href={viewAllLink}
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          {viewAllText} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const baseUrl = await resolveBaseUrl();
  let rentListing = null;
  let sellListing = null;
  let offerListing = null;

  // Fetch all listings in parallel
  const [rentRes, sellRes, offerRes] = await Promise.allSettled([
    fetch(`${baseUrl}/api/listings/get?limit=4&page=1&type=rent&order=asc`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/listings/get?limit=4&page=1&type=sell&order=asc`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/listings/get?limit=4&page=1&offer=true&order=asc`, {
      cache: "no-store",
    }),
  ]);

  if (rentRes.status === "fulfilled") {
    try {
      const data = await rentRes.value.json();
      if (rentRes.value.ok && data?.listings) {
        rentListing = data.listings;
      }
    } catch (error) {
      console.error("Error parsing rent listings:", error);
    }
  }

  if (sellRes.status === "fulfilled") {
    try {
      const data = await sellRes.value.json();
      if (sellRes.value.ok && data?.listings) {
        sellListing = data.listings;
      }
    } catch (error) {
      console.error("Error parsing sell listings:", error);
    }
  }

  if (offerRes.status === "fulfilled") {
    try {
      const data = await offerRes.value.json();
      if (offerRes.value.ok && data?.listings) {
        offerListing = data.listings;
      }
    } catch (error) {
      console.error("Error parsing offer listings:", error);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Find your next <span className="text-blue-600">perfect</span> property with ease
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Our Estate is the best place to find your next place to live
        </p>
        <Link
          href="/search"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Let's Get Started
        </Link>
      </section>

      {/* Hero Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop"
            alt="Beautiful home"
            className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
          />
        </div>
      </section>

      {/* Special Offers Section */}
      {offerListing && offerListing.length > 0 && (
        <ListingSection
          title="Special Offers"
          listings={offerListing}
          viewAllLink="/search?offer=true"
          viewAllText="View All Offers"
        />
      )}

      {/* Recent Rent Listings */}
      {rentListing && rentListing.length > 0 && (
        <ListingSection
          title="Recent Rent Listings"
          listings={rentListing}
          viewAllLink="/search?type=rent"
          viewAllText="View All Rentals"
        />
      )}

      {/* Recent Sell Listings */}
      {sellListing && sellListing.length > 0 && (
        <ListingSection
          title="Recent Properties for Sale"
          listings={sellListing}
          viewAllLink="/search?type=sell"
          viewAllText="View All Properties"
        />
      )}

      {/* Empty State */}
      {(!offerListing || offerListing.length === 0) &&
        (!rentListing || rentListing.length === 0) &&
        (!sellListing || sellListing.length === 0) && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-gray-600 text-lg">
              No listings available at the moment. Check back soon!
            </p>
          </section>
        )}
    </main>
  );
}
