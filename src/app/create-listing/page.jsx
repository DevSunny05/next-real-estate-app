
const page = () => {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create a Listing</h1>

        <form className="w-full flex flex-col gap-8 lg:flex-row">
            {/* Left Column - Basic Information */}
            <div className="flex flex-col px-6 gap-6 lg:w-1/2 flex-1">
                {/* Name Input */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
                    <input 
                        type="text" 
                        id="name"
                        placeholder="Enter property name" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                </div>

                {/* Description Textarea */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
                    <textarea 
                        id="description"
                        placeholder="Describe your property..." 
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                    />
                </div>

                {/* Address Input */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</label>
                    <input 
                        type="text" 
                        id="address"
                        placeholder="Enter property address" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                </div>

                {/* Amenities Checkboxes */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">Amenities</label>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="sell" id="sell" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="sell" className="text-gray-700 cursor-pointer">Sell</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="rent" id="rent" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="rent" className="text-gray-700 cursor-pointer">Rent</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="parking" id="parking" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="parking" className="text-gray-700 cursor-pointer">Parking Spot</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="furnished" id="furnished" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="furnished" className="text-gray-700 cursor-pointer">Furnished</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="offers" id="offers" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="offers" className="text-gray-700 cursor-pointer">Offers</label>
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">Property Details</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="bedrooms" className="text-sm text-gray-600">Bedrooms</label>
                            <input 
                                type="number" 
                                id="bedrooms" 
                                min={1} 
                                max={10} 
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="bathrooms" className="text-sm text-gray-600">Bathrooms</label>
                            <input 
                                type="number" 
                                id="bathrooms" 
                                min={1} 
                                max={10} 
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="regularPrice" className="text-sm text-gray-600">Regular Price</label>
                            <input 
                                type="number" 
                                id="regularPrice" 
                                min={1} 
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            />
                            <span className="text-xs text-gray-500">($/Month)</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="discountedPrice" className="text-sm text-gray-600">Discounted Price</label>
                            <input 
                                type="number" 
                                id="discountedPrice" 
                                min={1} 
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                            />
                            <span className="text-xs text-gray-500">($/Month)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Images */}
            <div className="flex flex-col gap-6 lg:w-1/2 flex-1">
                <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Images</label>
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
                        />

                        <button 
                            type="button"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            Upload Images
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit"
                    className="w-full bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors font-semibold text-lg mt-auto"
                >
                    Create Listing
                </button>
            </div>
        </form>
    </main>
  ) 
}

export default page