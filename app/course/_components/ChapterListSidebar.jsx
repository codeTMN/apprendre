import React, { useContext, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";

function ChapterListSidebar({ courseInfo }) {
  const courseContent = courseInfo?.courses?.courseContent ?? [];
  // accept both shapes from the API
  const enroll = courseInfo?.enrollCourse ?? courseInfo?.enroll_courses ?? null;

  // make membership checks O(1) and normalize to numbers
  const completedSet = useMemo(
    () => new Set((enroll?.completedChapters ?? []).map(Number)),
    [enroll]
  );

  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectedChapterIndexContext
  );

  return (
    <div className="w-80 bg-secondary h-screen p-5">
      <h2 className="my-3 font-bold text-xl">
        Chapters ({courseContent.length})
      </h2>

      <Accordion type="single" collapsible>
        {courseContent.map((chapter, index) => {
          const isCompleted = completedSet.has(index);
          return (
            <AccordionItem
              value={chapter?.courseData?.chapterName ?? `chapter-${index}`}
              key={index}
              onClick={() => setSelectedChapterIndex(index)}
            >
              <AccordionTrigger
                className={`text-lg font-medium px-5 ${
                  isCompleted ? "bg-green-100 text-green-800" : ""
                }`}
              >
                {index + 1}. {chapter?.courseData?.chapterName}
              </AccordionTrigger>

              <AccordionContent asChild>
                <div>
                  {chapter?.courseData?.topics?.map((topic, idx) => (
                    <h2
                      key={idx}
                      className={`p-3 my-1 rounded-lg ${
                        isCompleted ? "bg-green-100 text-green-800" : "bg-white"
                      }`}
                    >
                      {topic?.topic}
                    </h2>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default ChapterListSidebar;
