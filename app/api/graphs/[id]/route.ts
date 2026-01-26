import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import graph from "@/app/models/graph";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const verifyToken = (req: NextRequest): JwtPayload | null => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; 
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload; 
    return decoded;
  } catch (err) {
    return null;
  }
};

export async function GET(
         req: NextRequest,
         { params }: { params: Promise<{ id: string }> },
       ) {
         await connectDB();

         const { id: projectId } = await params;

         const user = verifyToken(req);
         if (!user) {
           return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
         }

         try {
           const project = await graph
             .findOne({
               projectId: projectId,
               owner: user.id,
             })
             .select("nodes edges");

           if (!project) {
             return NextResponse.json(
               { success: true, message: "Project not found" },
               { status: 200 },
             );
           }

           return NextResponse.json({
             success: true,
             nodes: project.nodes || [],
             edges: project.edges || [],
           });
         } catch (error) {
           console.error("Error loading diagram:", error);
           return NextResponse.json({ error: "Server error" }, { status: 500 });
         }
       }

export async function POST(
         req: NextRequest,
         { params }: { params: Promise<{ id: string }> },
       ) {
         await connectDB();

         const user = verifyToken(req);
         const { id: projectId } = await params;

         console.log("Saving diagram for projectId:", projectId);

         if (!user) {
           return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
         }

         try {
           const { nodes, edges } = await req.json();

           if (!Array.isArray(nodes) || !Array.isArray(edges)) {
             return NextResponse.json(
               { error: "Invalid data" },
               { status: 400 },
             );
           }

           const graphResponse = await graph.findOneAndUpdate(
             { projectId: projectId, owner: user.id },
             {
               nodes,
               edges,
               owner: user.id,
               projectId: projectId,
               createdAt: new Date(),
               updatedAt: new Date(),
             },
             {
               new: true,
               upsert: true,
               setDefaultsOnInsert: true,
             },
           );

           return NextResponse.json({
             success: true,
             message: graphResponse
               ? "Graph saved successfully"
               : "Graph created",
             graph: graphResponse,
           });
         } catch (error) {
           console.error("Error saving diagram:", error);
           return NextResponse.json({ error: "Server error" }, { status: 500 });
         }
       }
