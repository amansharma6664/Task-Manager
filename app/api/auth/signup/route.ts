// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "../../../lib/mongodb";
// import User from "../../../lib/models/User";

// export async function POST(req: Request) {
//   await connectDB();
//   const { username, email, password } = await req.json();

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return NextResponse.json({ error: "User already exists" }, { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ username, email, password: hashedPassword });

//   return NextResponse.json({ message: "User created", user: { email: user.email, username: user.username } });
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    return NextResponse.json({
      message: "User created",
      user: { email: user.email, username: user.username }
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
