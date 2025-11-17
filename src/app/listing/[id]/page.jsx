import { FaBath, FaBed, FaMapMarkedAlt, FaParking, FaHome } from "react-icons/fa";

import { headers } from "next/headers";

function resolveBaseUrl() {
  const envBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.URL ||
    process.env.VERCER_URL ||
    process.env.VERCEL_URL ||
    "";

  if (envBase) {
    return envBase.replace(/\/$/, "");
  }

  const headerStore = headers();
  const host = headerStore.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

function formatPrice(value = 0) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function Listing({ params }) {
  let data;

  try {
    const baseUrl = resolveBaseUrl();
    const res = await fetch(`${baseUrl}/api/listings/get?id=${params.id}`, {
      cache: "no-store",
    });

    data = await res.json();

    if (!res.ok || !data?.listing) {
      throw new Error(data?.error || "Listing not found");
    }
  } catch (error) {
    return (
      <main className="p-6 flex flex-col max-w-6xl mx-auto min-h-screen justify-center items-center text-center">
        <h2 className="text-2xl font-semibold mb-2">Listing not found</h2>
        <p className="text-gray-500">We couldn’t load this listing. Please try again later.</p>
      </main>
    );
  }

  const listing = data.listing;
  const coverImage = listing.imageUrls?.[0];
  const galleryImages = listing.imageUrls?.slice(1) || [];
  const showDiscount = listing.offer && listing.discountedPrice;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.name}
            className="w-full h-[420px] object-cover"
          />
        ) : (
          <div className="w-full h-[420px] bg-gray-200 flex items-center justify-center text-gray-500">
            No image available
          </div>
        )}
      </div>

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-800">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            {listing.offer && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-green-100 text-green-700">
                Special Offer
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkedAlt className="text-blue-600" />
            <span>{listing.address}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-extrabold text-gray-900">
              {showDiscount ? formatPrice(listing.discountedPrice) : formatPrice(listing.regularPrice)}
            </span>
            {listing.type === "rent" && (
              <span className="text-gray-500 text-lg font-medium">/ month</span>
            )}
            {showDiscount && (
              <span className="text-gray-500 line-through">
                {formatPrice(listing.regularPrice)}
              </span>
            )}
          </div>
        </header>

        <section className="grid gap-6 text-gray-700">
          <article className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Description</h2>
            <p className="leading-relaxed">{listing.description}</p>
          </article>

          <article className="bg-white rounded-xl shadow-sm p-6 grid gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DetailCard icon={<FaBed />} label="Bedrooms" value={listing.bedrooms} />
              <DetailCard icon={<FaBath />} label="Bathrooms" value={listing.bathrooms} />
              <DetailCard
                icon={<FaParking />}
                label="Parking"
                value={listing.parking ? "Available" : "No"}
              />
              <DetailCard
                icon={<FaHome />}
                label="Furnished"
                value={listing.furnished ? "Yes" : "No"}
              />
            </div>
          </article>

          {galleryImages.length > 0 && (
            <article className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${listing.name} image ${index + 2}`}
                    className="w-full h-56 object-cover rounded-lg"
                  />
                ))}
              </div>
            </article>
          )}
        </section>
      </section>
    </main>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
      <span className="text-xl text-blue-600">{icon}</span>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-lg font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}