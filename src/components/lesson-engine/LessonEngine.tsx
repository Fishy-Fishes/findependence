import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { financialInclusionLesson, LessonStep } from "./lessonData";

export default function LessonEngine() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const step: LessonStep = financialInclusionLesson[currentIdx];

  const handleChoice = (choiceIdx: number) => {
    setSelectedId(`${currentIdx}-${choiceIdx}`);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedId(null);
    if (currentIdx < financialInclusionLesson.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const chosen = step.choices[Number(selectedId?.split("-")[1] ?? -1)];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.prompt}>{step.prompt}</Text>
      {step.choices.map((c, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.choice,
            selectedId === `${currentIdx}-${i}` && styles.selectedChoice,
          ]}
          onPress={() => handleChoice(i)}
          disabled={showFeedback}
        >
          <Text style={styles.choiceLabel}>{c.label}</Text>
        </TouchableOpacity>
      ))}
      {showFeedback && chosen && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>
            {chosen.isCorrect ? "Correct!" : "Incorrect."}
          </Text>
          {chosen.explanation && (
            <Text style={styles.explanation}>{chosen.explanation}</Text>
          )}
        </View>
      )}
      {showFeedback && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", borderRadius: 12 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#111" },
  prompt: { fontSize: 16, marginBottom: 16, color: "#333", lineHeight: 22 },
  choice: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  selectedChoice: { backgroundColor: "#e0f2fe", borderColor: "#0284c7" },
  choiceLabel: { fontSize: 15, color: "#1f2937" },
  feedbackBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  feedbackText: { fontSize: 16, fontWeight: "600", color: "#111827" },
  explanation: { marginTop: 6, fontSize: 14, color: "#4b5563", lineHeight: 20 },
  nextButton: {
    marginTop: 16,
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
});
