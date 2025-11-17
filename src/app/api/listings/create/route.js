import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import listingModel from "@/lib/models/listingModel";
import { connect } from "@/lib/mongodb/mongoose";

export async function POST(req) {
  try {
    // Check authentication first
    const authResult = await auth();
    const { userId } = authResult || {};
    
    console.log("Auth check:", { userId, hasAuth: !!authResult });
    
    if (!userId) {
        console.error("No userId found in auth result");
        return NextResponse.json(
            { error: "Unauthorized: User not authenticated" },
            { status: 401 }
        );
    }

    // Get full user object
    const user = await currentUser();
    
    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized: Could not retrieve user data" },
            { status: 401 }
        );
    }

    // Connect to database
    await connect();

    const data = await req.json();

    // Extract listingData and userMongoId from request
    const { listingData, userMongoId } = data;

    // Get userMongoId from Clerk metadata and convert to string for comparison
    const clerkUserMongoId = user.publicMetadata?.userMongoId;
    const clerkUserMongoIdStr = clerkUserMongoId ? String(clerkUserMongoId) : null;
    const requestUserMongoIdStr = userMongoId ? String(userMongoId) : null;

    // Verify the userMongoId matches
    if (!clerkUserMongoIdStr || clerkUserMongoIdStr !== requestUserMongoIdStr) {
        console.error("Authorization failed:", {
            hasUser: !!user,
            clerkUserMongoId: clerkUserMongoIdStr,
            requestUserMongoId: requestUserMongoIdStr,
            publicMetadata: user.publicMetadata
        });
        return NextResponse.json(
            { error: "Unauthorized: User ID mismatch" },
            { status: 401 }
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
      userRef,
    } = listingData || {};

    // Validation
    if (!name || !description || !address) {
      return NextResponse.json(
        { error: "Name, description, and address are required" },
        { status: 400 }
      );
    }

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (imageUrls.length > 6) {
      return NextResponse.json(
        { error: "Maximum 6 images allowed" },
        { status: 400 }
      );
    }

    if (!type || (type !== "sell" && type !== "rent")) {
      return NextResponse.json(
        { error: "Listing type must be 'sell' or 'rent'" },
        { status: 400 }
      );
    }

    if (!userRef) {
      return NextResponse.json(
        { error: "User reference is required" },
        { status: 400 }
      );
    }

    

    // Create listing
    const listing = await listingModel.create({
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
      userRef,
    });

    await listing.save()

    return NextResponse.json(
      {
        success: true,
        listing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      {
        error: "Failed to create listing",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

