import { Button } from "@/components/ui/button";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import axios from "axios";
import { CheckCircle, Loader2Icon, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import YouTube from "react-youtube";
import { toast } from "sonner";

function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();

  // accept both shapes: { enrollCourse } or { enroll_courses }
  const enroll = courseInfo?.enrollCourse ?? courseInfo?.enroll_courses ?? null;

  const courseContent = courseInfo?.courses?.courseContent ?? [];
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);

  // mirror server value into local state (for instant UI flip)
  const serverCompleted = useMemo(
    () => enroll?.completedChapters ?? [],
    [enroll]
  );
  const [completed, setCompleted] = useState(serverCompleted);

  useEffect(() => {
    setCompleted(serverCompleted);
  }, [serverCompleted]);

  const [loading, setLoading] = useState(false);

  const isDone = completed.includes(selectedChapterIndex);

  const markChapterCompleted = async () => {
    if (loading) return;
    setLoading(true);

    // optimistic update
    const next = Array.from(new Set([...completed, selectedChapterIndex]));
    setCompleted(next);

    try {
      await axios.put("/api/enroll-course", {
        courseId,
        completedChapter: next,
      });
      toast.success("Chapter marked as Completed!");
      refreshData?.();
    } catch (e) {
      // rollback on error
      setCompleted(completed);
      toast.error("Could not mark as completed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const markInCompleteChapter = async () => {
    if (loading) return;
    setLoading(true);

    const next = completed.filter((i) => i !== selectedChapterIndex);
    setCompleted(next);

    try {
      await axios.put("/api/enroll-course", {
        courseId,
        completedChapter: next,
      });
      toast.success("Chapter marked as Incomplete!");
      refreshData?.();
    } catch (e) {
      // rollback on error
      setCompleted(completed);
      toast.error("Could not mark as incomplete. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo ?? [];
  const topics =
    courseContent?.[selectedChapterIndex]?.courseData?.topics ?? [];

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">
          {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
        </h2>

        {!isDone ? (
          <Button onClick={markChapterCompleted} disabled={loading}>
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <CheckCircle />
            )}
            <span className="ml-2">Mark as Completed</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={markInCompleteChapter}
            disabled={loading}
          >
            {loading ? <Loader2Icon className="animate-spin" /> : <X />}
            <span className="ml-2">Mark Incomplete</span>
          </Button>
        )}
      </div>

      <h2 className="my-2 font-bold text-lg">Related Videos 🎬</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {videoData.slice(0, 2).map((video, index) => (
          <div key={index}>
            <YouTube
              videoId={video?.videoId}
              opts={{ height: "250", width: "400" }}
            />
          </div>
        ))}
      </div>

      <div>
        {topics.map((topic, index) => (
          <div key={index} className="mt-10 p-5 bg-secondary rounded-2xl">
            <h2 className="font-bold text-2xl text-primary">
              {index + 1}. {topic?.topic}
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: topic?.content }}
              style={{ lineHeight: "2.5" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterContent;
