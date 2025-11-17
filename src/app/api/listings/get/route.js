import { NextResponse } from "next/server";
import mongoose from "mongoose";

import listingModel from "@/lib/models/listingModel";
import { connect } from "@/lib/mongodb/mongoose";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 12;

export async function GET(req) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);

    const listingId = searchParams.get("id");
    const userRef = searchParams.get("userRef");
    const type = searchParams.get("type");
    const offer = searchParams.get("offer");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const furnished = searchParams.get("furnished");
    const parking = searchParams.get("parking");

    const page = Math.max(Number.parseInt(searchParams.get("page") || "1", 10), 1);
    const limitRaw = Number.parseInt(
      searchParams.get("limit") || String(DEFAULT_PAGE_SIZE),
      10
    );
    const limit = Math.min(Math.max(limitRaw, 1), MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Single listing by id
    if (listingId) {
      if (!mongoose.Types.ObjectId.isValid(listingId)) {
        return NextResponse.json(
          { error: "Invalid listing id" },
          { status: 400 }
        );
      }

      const listing = await listingModel.findById(listingId);

      if (!listing) {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          listing,
        },
        { status: 200 }
      );
    }

    // Build filters
    const filters = {};
    if (userRef) {
      filters.userRef = userRef;
    }
    if (type && ["rent", "sell"].includes(type)) {
      filters.type = type;
    }
    if (offer === "true") {
      filters.offer = true;
    } else if (offer === "false") {
      filters.offer = false;
    }
    if (furnished === "true") {
      filters.furnished = true;
    } else if (furnished === "false") {
      filters.furnished = false;
    }
    if (parking === "true") {
      filters.parking = true;
    } else if (parking === "false") {
      filters.parking = false;
    }
    if (bedrooms) {
      filters.bedrooms = { $gte: Number(bedrooms) };
    }
    if (bathrooms) {
      filters.bathrooms = { $gte: Number(bathrooms) };
    }
    if (minPrice || maxPrice) {
      filters.regularPrice = {};
      if (minPrice) {
        filters.regularPrice.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filters.regularPrice.$lte = Number(maxPrice);
      }
    }

    const [listings, total] = await Promise.all([
      listingModel
        .find(filters)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      listingModel.countDocuments(filters),
    ]);

    return NextResponse.json(
      {
        success: true,
        total,
        count: listings.length,
        page,
        limit,
        listings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch listings",
        details: error.message,
      },
      { status: 500 }
    );
  }
}