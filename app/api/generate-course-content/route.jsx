import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

const PROMPT = `Depends on Chapter name and Topic Generate content for each topic in HTML 

and give response in JSON format. 

Schema:{

chapterName:<>,

{

topic:<>,

content:<>

}

}

: User Input:

`;

export async function POST(req) {
  const { courseJson, courseTitle, courseId } = await req.json();

  const promises = courseJson?.chapters?.map(async (chapter) => {
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
    };
    const model = "gemini-flash-latest";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: PROMPT + JSON.stringify(chapter),
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
    // console.log("Response:", response.candidates[0].content.parts[0].text);
    const RawResp = response.candidates[0].content.parts[0].text;
    const RawJson = RawResp.replace("```json", "").replace("```", "");
    const JSONResp = JSON.parse(RawJson);

    // GET Youtube Videos
    const youtubeData = await GetYoutbeVideo(chapter?.chapterName);
    console.log({
      youtubeVideo: youtubeData,
      courseData: JSONResp,
    });
    return {
      youtubeVideo: youtubeData,
      courseData: JSONResp,
    };

    return JSONResp;
  });
  const CourseContent = await Promise.all(promises);

  // Save Course Content to Database
  const dbResp = await db
    .update(coursesTable)
    .set({
      courseContent: CourseContent,
    })
    .where(eq(coursesTable.cid, courseId));

  return NextResponse.json({
    courseName: courseTitle,
    CourseContent: CourseContent,
  });
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
const GetYoutbeVideo = async (topic) => {
  const params = {
    part: "snippet",
    q: topic,
    maxResults: 4,
    type: "video",
    key: process.env.YOUTUBE_API_KEY,
  };
  const resp = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoListResp = resp.data.items;
  const youtubeVideoList = [];
  youtubeVideoListResp.forEach((item) => {
    const data = {
      videoId: item.id?.videoId,
      title: item.snippet?.title,
    };
    youtubeVideoList.push(data);
  });
  console.log("Youtube Video List:", youtubeVideoList);
  return youtubeVideoList;
};
