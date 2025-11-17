import listingModel from "@/lib/models/listingModel"
import { connect } from "@/lib/mongodb/mongoose"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export const POST=async(req)=>{
    const user=await currentUser()

    try {
        await connect()

        const data=await req.json()

        if(!user || user.publicMetadata.userMongoId != data.userMongoId){
            return new NextResponse("Unauthorized",{
                status:401
            })
        }


        const newPost=await listingModel.findByIdAndUpdate(data.listingId,{
            $set:{
                name:data.name,
                description:data.description,
                address:data.address,
                regularPrice:data.regularPrice,
                discountedPrice:data.discountedPrice,
                bathrooms:data.bathrooms,
                bedrooms:data.bedrooms,
                furnished:data.furnished,
                parking:data.parking,
                type:data.type,
                offer:data.offer,
                imageUrls:data.imageUrls
            }
        },{new:true})

        await newPost.save()
        return new NextResponse(JSON.stringify(newPost),{status:200})
    } catch (error) {
        console.log('Error creating post',error)
        return new NextResponse('Error creating post',{
            status:500
        })
    }
}