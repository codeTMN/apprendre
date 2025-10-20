import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
// import mime from "mime";
// import { writeFile } from "fs";

const PROMPT = `Genrate Learning Course depends on following details. In which Make sure to add Course Name, Description,Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, , Topic under each chapters , Duration for each chapters etc, in JSON format only

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",

"bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
     
      }
    ]
  }
}

, User Input: 

`;

export async function POST(req) {
  const formData = await req.json();
  const user = await currentUser();

  // function saveBinaryFile(fileName, content) {
  //   writeFile(fileName, content, "utf8", (err) => {
  //     if (err) {
  //       console.error(`Error writing file ${fileName}:`, err);
  //       return;
  //     }
  //     console.log(`File ${fileName} saved to file system.`);
  //   });
  // }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseModalities: ["IMAGE", "TEXT"],
  };
  const model = "gemini-2.5-flash-image";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  console.log("Response:", response.candidates[0].content.parts[0].text);

  // Save to Database
  // const result = await db.insert(coursesTable).values({
  //   ...formData,
  //   courseLayout: response.text(),
  //   userEmail: user?.primaryEmailAddress?.emailAddress,
  // });

  return NextResponse.json(response);

  // let fileIndex = 0;
  // for await (const chunk of response) {
  //   if (
  //     !chunk.candidates ||
  //     !chunk.candidates[0].content ||
  //     !chunk.candidates[0].content.parts
  //   ) {
  //     continue;
  //   }
  //   if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
  //     const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
  //     const inlineData = chunk.candidates[0].content.parts[0].inlineData;
  //     const fileExtension = mime.getExtension(inlineData.mimeType || "");
  //     const buffer = Buffer.from(inlineData.data || "", "base64");
  //     saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
  //   } else {
  //     console.log(chunk.text);
  //   }
  // }
}
