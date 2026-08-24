import { useState } from "react";
import { useRouter } from "expo-router";

import LessonEngine from "@/components/lesson-engine/LessonEngine";
import LessonEntry from "@/components/lesson-engine/LessonEntry";

/**
 * Lesson Engine flow: Entry screen -> interactive LessonEngine.
 * Matches the Figma "Lesson Engine — Entry" and "LessonEngine" frames.
 */
export default function Review() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <LessonEntry
        onBeginLesson={() => setStarted(true)}
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
      />
    );
  }

  return (
    <LessonEngine
      onClose={() => setStarted(false)}
      onFinish={() => setStarted(false)}
    />
  );
}

