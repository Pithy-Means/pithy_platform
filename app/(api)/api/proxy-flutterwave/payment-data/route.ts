import { getWHoUserPaid } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getWHoUserPaid();
    
    // Check if the data is empty or null
    if (!data) return NextResponse.json({
      message: "No payment data available",
      status: 404,
    });

    // console.log("Payment data:", data);

    return NextResponse.json({
      data: data,
      message: "Payment data retrieved successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return NextResponse.json({
      message: "Error fetching payment data",
      status: 500,
    });
  }
}
