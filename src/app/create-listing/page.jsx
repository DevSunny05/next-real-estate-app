"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const page = () => {
  const [files, setFiles] = useState([]);

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, isSignedIn, isLoaded } = useUser();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formdata, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 1000,
    discountedPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    // Handle sell/rent checkboxes - mutually exclusive, set the type field
    if (id === "sell" || id === "rent") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          type: id,
        }));
      }
    }
    // Handle regular checkboxes (furnished, parking, offer)
    else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
    }
    // Handle text, textarea, and number inputs
    else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id]: value === "" ? 0 : Number(value),
      }));
    }
    // Handle text and textarea inputs
    else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setImageUploadError(true);
      setErrorMessage("Please select at least one image");
      return;
    }

    if (files.length + formdata.imageUrls.length > 6) {
      setImageUploadError(true);
      setErrorMessage("You can only upload a maximum of 6 images");
      return;
    }

    setImageUploadError(false);
    setUploading(true);
    setErrorMessage("");
    setUploadProgress(0);

    const promises = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      promises.push(storeImage(fileArray[i], i, fileArray.length));
    }

    try {
      const urls = await Promise.all(promises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
      setImageUploadError(false);
      setErrorMessage("");
      // Clear file input
      document.getElementById("images").value = "";
      setFiles([]);
    } catch (error) {
      setImageUploadError(true);
      setErrorMessage("Image upload failed: " + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const storeImage = async (file, index, total) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      // Update progress
      const progress = ((index + 1) / total) * 100;
      setUploadProgress(progress);

      return data.url;
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      // Wait for Clerk to load
      if (!isLoaded) {
        setError(true);
        setErrorMessage("Please wait, loading user data...");
        setLoading(false);
        return;
      }

      // Check if user is signed in
      if (!isSignedIn || !user) {
        setError(true);
        setErrorMessage("Please sign in to create a listing");
        setLoading(false);
        return;
      }

      // Validation
      if (formdata.imageUrls.length < 1) {
        setError(true);
        setErrorMessage("You must upload at least one image");
        setLoading(false);
        return;
      }

      if (!formdata.name || !formdata.description || !formdata.address) {
        setError(true);
        setErrorMessage(
          "Please fill in all required fields (Name, Description, Address)"
        );
        setLoading(false);
        return;
      }

      if (
        !formdata.type ||
        (formdata.type !== "sell" && formdata.type !== "rent")
      ) {
        setError(true);
        setErrorMessage("Please select either Sell or Rent");
        setLoading(false);
        return;
      }

      if (Number(formdata.regularPrice) < Number(formdata.discountedPrice)) {
        setError(true);
        setErrorMessage(
          "Regular price must be greater than or equal to discounted price"
        );
        setLoading(false);
        return;
      }

      // Get user's MongoDB ID from Clerk metadata
      const userMongoId = user.publicMetadata?.userMongoId;
      if (!userMongoId) {
        setError(true);
        setErrorMessage("User not found. Please try logging out and back in.");
        setLoading(false);
        return;
      }

      // Prepare listing data
      const listingData = {
        name: formdata.name.trim(),
        description: formdata.description.trim(),
        address: formdata.address.trim(),
        regularPrice: Number(formdata.regularPrice),
        discountedPrice: Number(formdata.discountedPrice),
        bathrooms: Number(formdata.bathrooms),
        bedrooms: Number(formdata.bedrooms),
        furnished: Boolean(formdata.furnished),
        parking: Boolean(formdata.parking),
        type: formdata.type,
        offer: Boolean(formdata.offer),
        imageUrls: formdata.imageUrls,
        userRef: userMongoId,
      };

      // Call API to create listing
      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify({
          listingData,
          userMongoId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      // Success - redirect to listing page or home
      if (data.listing && data.listing._id) {
        router.push(`/listing/${data.listing._id}`);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      setError(true);
      setErrorMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Create a Listing
      </h1>

      <form
        className="w-full flex flex-col gap-8 lg:flex-row"
        onSubmit={handleSubmit}
      >
        {/* Left Column - Basic Information */}
        <div className="flex flex-col px-6 gap-6 lg:w-1/2 flex-1">
          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formdata.name}
              onChange={handleChange}
              placeholder="Enter property name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              required
            />
          </div>

          {/* Description Textarea */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formdata.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
              required
            />
          </div>

          {/* Address Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-sm font-semibold text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formdata.address}
              onChange={handleChange}
              placeholder="Enter property address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              required
            />
          </div>

          {/* Amenities Checkboxes */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Amenities
            </label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="sell"
                  id="sell"
                  checked={formdata.type === "sell"}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="sell" className="text-gray-700 cursor-pointer">
                  Sell
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rent"
                  id="rent"
                  checked={formdata.type === "rent"}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="rent" className="text-gray-700 cursor-pointer">
                  Rent
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="parking"
                  id="parking"
                  checked={formdata.parking}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="parking"
                  className="text-gray-700 cursor-pointer"
                >
                  Parking Spot
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="furnished"
                  id="furnished"
                  checked={formdata.furnished}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="furnished"
                  className="text-gray-700 cursor-pointer"
                >
                  Furnished
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="offers"
                  id="offer"
                  checked={formdata.offer}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="offer" className="text-gray-700 cursor-pointer">
                  Offers
                </label>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Property Details
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="bedrooms" className="text-sm text-gray-600">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  value={formdata.bedrooms}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="bathrooms" className="text-sm text-gray-600">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={formdata.bathrooms}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="regularPrice" className="text-sm text-gray-600">
                  Regular Price
                </label>
                <input
                  type="number"
                  id="regularPrice"
                  value={formdata.regularPrice}
                  onChange={handleChange}
                  min={1}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  required
                />
                <span className="text-xs text-gray-500">($/Month)</span>
              </div>

              {formdata.offer && (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="discountedPrice"
                    className="text-sm text-gray-600"
                  >
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    value={formdata.discountedPrice}
                    onChange={handleChange}
                    min={0}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    required
                  />
                  <span className="text-xs text-gray-500">($/Month)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="flex flex-col gap-6 lg:w-1/2 flex-1">
          <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Images
              </label>
              <span className="text-sm text-gray-500">
                The first image will be the cover (max 6 images)
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  setFiles(Array.from(e.target.files || []));
                }}
              />

              <button
                type="button"
                disabled={uploading || files.length === 0}
                onClick={handleImageSubmit}
                className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium ${
                  uploading || files.length === 0
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {uploading
                  ? `Uploading... ${Math.round(uploadProgress)}%`
                  : "Upload Images"}
              </button>

              {imageUploadError && (
                <p className="text-red-600 text-sm font-medium">
                  {errorMessage}
                </p>
              )}

              {formdata.imageUrls.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Uploaded Images ({formdata.imageUrls.length}/6):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {formdata.imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Listing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors font-semibold text-lg mt-auto"
            disabled={loading || uploading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && (
            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
          )}
        </div>
      </form>
    </main>
  );
};

export default page;
