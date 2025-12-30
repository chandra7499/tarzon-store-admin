export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function GET(){
   try {
      const offerZoneRef = await admin.firestore().collection("offerZone").get();
      if(!offerZoneRef){
        const obj = {
           deliveryCharges:0.00,
           gst:0.00,
           offerName:"",
           promoCode:[],
           storeDiscount:0.00
        }
        return NextResponse.json({success:false,obj},{status:204})
      }
      const offerDocs = offerZoneRef.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))
      return NextResponse.json({success:true,offerDocs},{status:200})
   } catch (error) {
    return NextResponse.json({success:false,error},{status:503})
   }
}

export async function POST(request){
    try {
        const updatedData = await request.json();
        if(!updatedData) {
            const message = "No data found"
             return NextResponse.json({success:false,message},{status:204})
        }
        const docRef = await admin.firestore().collection("offerZone").get();
        if(!docRef){
            const message = "no related collection is found in database"
            return NextResponse.json({success:false,message},{status:404});
        } 
        await admin.firestore().collection("offerZone").doc(docRef.docs[0].id).update(updatedData)
        const message = "Data update successfully"
        return NextResponse.json({success:true,message},{status:200});
    } catch (error) {
        return NextResponse.json({success:true,error},{status:500})
    }
}