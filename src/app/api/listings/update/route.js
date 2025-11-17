import listingModel from "@/lib/models/listingModel";
import { connect } from "@/lib/mongodb/mongoose";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    // Auth check
    const authResult = await auth();
    const { userId } = authResult || {};

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not authenticated" },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Could not retrieve user data" },
        { status: 401 }
      );
    }

    await connect();

    const data = await req.json();
    const { listingData, userMongoId, listingId } = data || {};

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Compare user IDs as strings
    const clerkUserMongoId = user.publicMetadata?.userMongoId;
    const clerkUserMongoIdStr = clerkUserMongoId ? String(clerkUserMongoId) : null;
    const requestUserMongoIdStr = userMongoId ? String(userMongoId) : null;

    if (!clerkUserMongoIdStr || clerkUserMongoIdStr !== requestUserMongoIdStr) {
      return NextResponse.json(
        { error: "Unauthorized: User ID mismatch" },
        { status: 401 }
      );
    }

    if (!listingData) {
      return NextResponse.json(
        { error: "Listing data is required" },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      address,
      regularPrice,
      discountedPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
    } = listingData;

    const updatedListing = await listingModel.findByIdAndUpdate(
      listingId,
      {
        $set: {
          name,
          description,
          address,
          regularPrice: Number(regularPrice),
          discountedPrice: Number(discountedPrice),
          bathrooms: Number(bathrooms),
          bedrooms: Number(bedrooms),
          furnished: Boolean(furnished),
          parking: Boolean(parking),
          type,
          offer: Boolean(offer),
          imageUrls,
        },
      },
      { new: true }
    );

    if (!updatedListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    await updatedListing.save();

    return NextResponse.json(
      {
        success: true,
        listing: updatedListing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating listing", error);
    return NextResponse.json(
      { error: "Error updating listing", details: error.message },
      { status: 500 }
    );
  }
};