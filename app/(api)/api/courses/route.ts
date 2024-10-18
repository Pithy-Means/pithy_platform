import { NextResponse, NextRequest } from "next/server";

// Dummy data for testing

const courses = [
  {
    id: '1',
    title: 'Entrepreneurship in East Africa - Case study UG',
    image: '/assets/development1.png',
    duration: '1hr - 13min',
    learners: 93,
    originalPrice: 'UGX80,000',
    price: 'Free',
  },
  {
    id: '2',
    title: 'Introduction to Web Development',
    image: '/assets/development2.png',
    duration: '2hr - 30min',
    learners: 150,
    originalPrice: 'UGX100,000',
    price: 'Free',
  },
]

export async function GET() {
  try {
    // return NextResponse.json(courses) as a JSON response
    return NextResponse.json(courses);  
  }  catch (error) {
    // return NextResponse.error(error) as an error response
    console.error('Error fetching courses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }

}

//POST request to add a new course
export async function POST(req: NextRequest) {
  try {
    const newCourse = await req.json();
    // Here you would add the logic to save the new course to your database.
    // For demonstration, we're pushing it to the array.
    // Make sure to assign a unique ID for each course (e.g., from a database).
    newCourse.id = String(courses.length + 1); //sample id
    courses.push(newCourse);
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error adding course:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// To handle unsupported methods in the route, export a default function
// export async function POST() {
//   return new NextResponse('Method Not Allowed', {
//     status: 405,
//     headers: { Allow: 'GET' },
//   });
// }