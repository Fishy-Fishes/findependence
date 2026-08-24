import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BudgetAllocationStep,
  CategorySortItem,
  CategorySortStep,
  financialIndependenceCourse,
  LessonStep,
  MultipleChoiceStep,
} from "./lessonData";
import { GlassCard } from "./GlassCard";
import { LessonBackground, LessonColors } from "./LessonBackground";

interface LessonEngineProps {
  onClose?: () => void;
  onFinish?: () => void;
}

export default function LessonEngine({ onClose, onFinish }: LessonEngineProps = {}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [allocation, setAllocation] = useState<{ [key: string]: number }>({
    needs: 50,
    wants: 30,
    savings: 20,
  });
  const [sortedItems, setSortedItems] = useState<{
    [itemId: string]: "asset" | "liability";
  }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState("");
  const [lives, setLives] = useState(5);
  const [streak, setStreak] = useState(4);
  const [totalXp, setTotalXp] = useState(140);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const step: LessonStep = financialIndependenceCourse[currentIdx];
  const progressPercent = Math.min(
    100,
    Math.round((currentIdx / financialIndependenceCourse.length) * 100),
  );

  // Reset inputs when switching steps
  const resetStepInputs = () => {
    setSelectedChoiceId(null);
    setAllocation({ needs: 50, wants: 30, savings: 20 });
    setSortedItems({});
    setShowFeedback(false);
    setIsAnswerCorrect(false);
    setFeedbackExplanation("");
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setLives(5);
    setCorrectAnswersCount(0);
    setIsFinished(false);
    resetStepInputs();
  };

  const validateAnswer = () => {
    if (showFeedback) return;

    if (step.type === "multiple-choice" || step.type === "true-false") {
      const mcStep = step as MultipleChoiceStep;
      const chosen = mcStep.choices.find((c) => c.id === selectedChoiceId);
      if (!chosen) return;

      const correct = chosen.isCorrect;
      setIsAnswerCorrect(correct);
      setFeedbackExplanation(chosen.explanation);
      if (correct) {
        setCorrectAnswersCount((prev) => prev + 1);
        setTotalXp((prev) => prev + step.xpReward);
      } else {
        setLives((prev) => Math.max(0, prev - 1));
      }
      setShowFeedback(true);
    } else if (step.type === "budget-allocation") {
      const bStep = step as BudgetAllocationStep;
      const needsPct = allocation.needs ?? 0;
      const wantsPct = allocation.wants ?? 0;
      const savingsPct = allocation.savings ?? 0;
      const total = needsPct + wantsPct + savingsPct;

      const isBalanced =
        total === 100 &&
        needsPct >= 40 &&
        needsPct <= 60 &&
        wantsPct >= 20 &&
        wantsPct <= 40 &&
        savingsPct >= 15 &&
        savingsPct <= 35;

      setIsAnswerCorrect(isBalanced);
      setFeedbackExplanation(
        isBalanced
          ? `Superb! You balanced ${bStep.currency} ${bStep.totalIncome} into 50% Needs, 30% Wants, and 20% Savings! ` +
              bStep.explanation
          : `Budget not optimal (Total: ${total}%). Aim for ~50% Needs, ~30% Wants, and ~20% Savings for financial independence.`,
      );
      if (isBalanced) {
        setCorrectAnswersCount((prev) => prev + 1);
        setTotalXp((prev) => prev + step.xpReward);
      } else {
        setLives((prev) => Math.max(0, prev - 1));
      }
      setShowFeedback(true);
    } else if (step.type === "category-sort") {
      const sStep = step as CategorySortStep;
      let allCorrect = true;
      sStep.items.forEach((item) => {
        if (sortedItems[item.id] !== item.correctCategory) {
          allCorrect = false;
        }
      });

      setIsAnswerCorrect(allCorrect);
      setFeedbackExplanation(
        allCorrect
          ? "Fantastic! You correctly separated wealth-generating assets from cash-draining liabilities! " +
              sStep.explanation
          : "Some items were misplaced. Remember: Assets generate income, liabilities incur ongoing costs.",
      );
      if (allCorrect) {
        setCorrectAnswersCount((prev) => prev + 1);
        setTotalXp((prev) => prev + step.xpReward);
      } else {
        setLives((prev) => Math.max(0, prev - 1));
      }
      setShowFeedback(true);
    }
  };

  const handleNextStep = () => {
    if (currentIdx < financialIndependenceCourse.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      resetStepInputs();
    } else {
      setIsFinished(true);
    }
  };

  const isCheckDisabled = () => {
    if (showFeedback) return false;
    if (step.type === "multiple-choice" || step.type === "true-false") {
      return !selectedChoiceId;
    }
    if (step.type === "budget-allocation") {
      const total =
        (allocation.needs ?? 0) +
        (allocation.wants ?? 0) +
        (allocation.savings ?? 0);
      return total !== 100;
    }
    if (step.type === "category-sort") {
      const sStep = step as CategorySortStep;
      return Object.keys(sortedItems).length < sStep.items.length;
    }
    return false;
  };

  // Render Finished / Victory Screen
  if (isFinished) {
    const accuracy = Math.round(
      (correctAnswersCount / financialIndependenceCourse.length) * 100,
    );
    return (
      <View style={styles.root}>
        <LessonBackground />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.endScreenScroll}>
            <GlassCard radius={24} style={styles.endCard}>
              <View style={styles.victoryHeader}>
                <Text style={styles.victoryBadge}>LESSON COMPLETE!</Text>
                <Text style={styles.victoryTitle}>
                  Financial Independence Master
                </Text>
                <Text style={styles.victorySubtitle}>
                  You mastered cash flow, predatory debt shields, the 50/30/20
                  budget, and community ROSCAs!
                </Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>STREAK</Text>
                  <Text style={styles.statValue}>{streak + 1} Days</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>ACCURACY</Text>
                  <Text style={styles.statValue}>{accuracy}%</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>TOTAL XP</Text>
                  <Text style={styles.statValue}>{totalXp} XP</Text>
                </View>
              </View>

              <View style={styles.wisdomCard}>
                <Text style={styles.wisdomHeader}>Golden Takeaways:</Text>
                <Text style={styles.wisdomItem}>
                  • Pay future self first (20-30% emergency buffer stash).
                </Text>
                <Text style={styles.wisdomItem}>
                  • 50/30/20 balances living today while compounding wealth.
                </Text>
                <Text style={styles.wisdomItem}>
                  • Avoid high APR payday loans like the plague.
                </Text>
                <Text style={styles.wisdomItem}>
                  • Build assets that deposit money into your account regularly.
                </Text>
              </View>

              <View style={styles.actionButtonColumn}>
                <Pressable
                  style={({ pressed }) => [
                    styles.ctaButton,
                    styles.ctaSecondary,
                    pressed && styles.ctaPressed,
                  ]}
                  onPress={handleRestart}
                >
                  <Text style={styles.ctaTextSecondary}>Practice Again</Text>
                </Pressable>
                {(onFinish || onClose) && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.ctaButton,
                      styles.ctaPrimary,
                      pressed && styles.ctaPressed,
                    ]}
                    onPress={onFinish ?? onClose}
                  >
                    <Text style={styles.ctaText}>Finish Lesson</Text>
                  </Pressable>
                )}
              </View>
            </GlassCard>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Render Game Over (0 lives)
  if (lives <= 0 && showFeedback && !isAnswerCorrect) {
    return (
      <View style={styles.root}>
        <LessonBackground />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.endScreenCenter}>
            <GlassCard radius={24} style={styles.endCard}>
              <Text style={styles.gameOverTitle}>Out of Hearts!</Text>
              <Text style={styles.gameOverSubtitle}>
                Financial independence is built through patience and learning
                from mistakes. Take a breath and try again!
              </Text>
              <View style={styles.actionButtonColumn}>
                <Pressable
                  style={({ pressed }) => [
                    styles.ctaButton,
                    styles.ctaPrimary,
                    pressed && styles.ctaPressed,
                  ]}
                  onPress={handleRestart}
                >
                  <Text style={styles.ctaText}>Refill Hearts & Retry</Text>
                </Pressable>
                {onClose && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.ctaButton,
                      styles.ctaSecondary,
                      pressed && styles.ctaPressed,
                    ]}
                    onPress={onClose}
                  >
                    <Text style={styles.ctaTextSecondary}>Exit</Text>
                  </Pressable>
                )}
              </View>
            </GlassCard>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LessonBackground />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Top Gamification Bar */}
        <View style={styles.headerBar}>
          <Pressable onPress={onClose ?? handleRestart} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>

          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>

          <View style={styles.metricsPill}>
            <Text style={styles.metricItem}>Streak {streak}</Text>
            <Text style={styles.metricItem}>Lives {lives}</Text>
            <Text style={styles.metricItem}>XP {totalXp}</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question card (Figma "Glass Card") */}
          <GlassCard radius={20} bordered style={styles.questionCard}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.questionPrompt}>{step.prompt}</Text>
          </GlassCard>

          {/* Unit tag + scenario */}
          <View style={styles.unitTagContainer}>
            <Text style={styles.unitTagText}>{step.unit}</Text>
          </View>
          <View style={styles.mascotContainer}>
            <View style={styles.mascotAvatar}>
              <Text style={styles.mascotEmoji}>i</Text>
            </View>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>{step.scenario}</Text>
              {step.mentorTip && (
                <View style={styles.mentorTipBox}>
                  <Text style={styles.mentorTipText}>Tip: {step.mentorTip}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Dynamic Step Renderers */}
          {(step.type === "multiple-choice" || step.type === "true-false") && (
            <View style={styles.choicesList}>
              {(step as MultipleChoiceStep).choices.map((choice, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = selectedChoiceId === choice.id;

                const isCorrectChoice = choice.isCorrect;
                const isWrongSelection = isSelected && !choice.isCorrect;

                return (
                  <Pressable
                    key={choice.id}
                    disabled={showFeedback}
                    style={({ pressed }) => [
                      styles.choiceBtn,
                      isSelected && styles.choiceBtnSelected,
                      showFeedback && isCorrectChoice && styles.choiceBtnCorrect,
                      showFeedback && isWrongSelection && styles.choiceBtnWrong,
                      pressed && !showFeedback && styles.optionPressed,
                    ]}
                    onPress={() => setSelectedChoiceId(choice.id)}
                  >
                    <View
                      style={[
                        styles.choiceBadge,
                        isSelected && styles.choiceBadgeSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.choiceBadgeText,
                          isSelected && styles.choiceBadgeTextSelected,
                        ]}
                      >
                        {letter}
                      </Text>
                    </View>
                    <View style={styles.choiceTextWrapper}>
                      <Text
                        style={[
                          styles.choiceText,
                          isSelected && styles.choiceTextSelected,
                        ]}
                      >
                        {choice.label}
                      </Text>
                      {choice.sublabel && (
                        <Text style={styles.choiceSublabel}>
                          {choice.sublabel}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {step.type === "budget-allocation" && (
            <View style={styles.allocationCard}>
              <View style={styles.allocationHeader}>
                <Text style={styles.allocationTotalLabel}>
                  Weekly Income:{" "}
                  <Text style={styles.allocationTotalValue}>
                    ${(step as BudgetAllocationStep).totalIncome}{" "}
                    {(step as BudgetAllocationStep).currency}
                  </Text>
                </Text>
                <View
                  style={[
                    styles.totalPercentBadge,
                    allocation.needs + allocation.wants + allocation.savings ===
                    100
                      ? styles.totalPercentGood
                      : styles.totalPercentWarn,
                  ]}
                >
                  <Text style={styles.totalPercentText}>
                    Total Allocated:{" "}
                    {allocation.needs + allocation.wants + allocation.savings}%
                  </Text>
                </View>
              </View>

              {(step as BudgetAllocationStep).categories.map((cat) => {
                const currentVal = allocation[cat.id] ?? 0;
                const dollarAmount = Math.round(
                  (currentVal / 100) *
                    (step as BudgetAllocationStep).totalIncome,
                );

                return (
                  <View key={cat.id} style={styles.budgetRow}>
                    <View style={styles.budgetLabelRow}>
                      <Text
                        style={[styles.budgetCatTitle, { color: cat.color }]}
                      >
                        {cat.label}
                      </Text>
                      <Text style={styles.budgetAmount}>
                        {currentVal}% (${dollarAmount})
                      </Text>
                    </View>

                    <Text style={styles.budgetCatDesc}>{cat.description}</Text>

                    {/* Stepper Controls */}
                    <View style={styles.stepperContainer}>
                      <Pressable
                        disabled={showFeedback || currentVal <= 0}
                        style={({ pressed }) => [
                          styles.stepButton,
                          pressed && styles.optionPressed,
                        ]}
                        onPress={() =>
                          setAllocation((prev) => ({
                            ...prev,
                            [cat.id]: Math.max(0, (prev[cat.id] ?? 0) - 5),
                          }))
                        }
                      >
                        <Text style={styles.stepBtnText}>- 5%</Text>
                      </Pressable>

                      <View style={styles.sliderBarTrack}>
                        <View
                          style={[
                            styles.sliderBarFill,
                            {
                              width: `${Math.min(100, currentVal)}%`,
                              backgroundColor: cat.color,
                            },
                          ]}
                        />
                      </View>

                      <Pressable
                        disabled={showFeedback || currentVal >= 100}
                        style={({ pressed }) => [
                          styles.stepButton,
                          pressed && styles.optionPressed,
                        ]}
                        onPress={() =>
                          setAllocation((prev) => ({
                            ...prev,
                            [cat.id]: Math.min(100, (prev[cat.id] ?? 0) + 5),
                          }))
                        }
                      >
                        <Text style={styles.stepBtnText}>+ 5%</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {step.type === "category-sort" && (
            <View style={styles.sortContainer}>
              <Text style={styles.sortHint}>
                Tap an item, then select Asset or Liability:
              </Text>
              {(step as CategorySortStep).items.map((item: CategorySortItem) => {
                const currentAssignment = sortedItems[item.id];
                return (
                  <View key={item.id} style={styles.sortItemCard}>
                    <Text style={styles.sortItemText}>{item.text}</Text>
                    <View style={styles.sortBtnGroup}>
                      <Pressable
                        disabled={showFeedback}
                        style={[
                          styles.sortPill,
                          currentAssignment === "asset" &&
                            styles.sortPillAssetSelected,
                        ]}
                        onPress={() =>
                          setSortedItems((prev) => ({
                            ...prev,
                            [item.id]: "asset",
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.sortPillText,
                            currentAssignment === "asset" &&
                              styles.sortPillTextActive,
                          ]}
                        >
                          Asset
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={showFeedback}
                        style={[
                          styles.sortPill,
                          currentAssignment === "liability" &&
                            styles.sortPillLiabilitySelected,
                        ]}
                        onPress={() =>
                          setSortedItems((prev) => ({
                            ...prev,
                            [item.id]: "liability",
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.sortPillText,
                            currentAssignment === "liability" &&
                              styles.sortPillTextActive,
                          ]}
                        >
                          Liability
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Sticky Bottom Sheet & Action Button */}
        <View
          style={[
            styles.footerContainer,
            showFeedback &&
              (isAnswerCorrect ? styles.footerCorrect : styles.footerWrong),
          ]}
        >
          {showFeedback && (
            <View style={styles.feedbackInfo}>
              <View style={styles.feedbackHeaderRow}>
                <Text style={styles.feedbackIcon}>
                  {isAnswerCorrect ? "✓" : "✗"}
                </Text>
                <Text
                  style={[
                    styles.feedbackTitle,
                    { color: isAnswerCorrect ? "#4ADE80" : "#F87171" },
                  ]}
                >
                  {isAnswerCorrect ? "EXCELLENT!" : "KEEP IN MIND:"}
                </Text>
              </View>
              <Text style={styles.feedbackExplanationText}>
                {feedbackExplanation}
              </Text>
            </View>
          )}

          <Pressable
            disabled={isCheckDisabled()}
            style={({ pressed }) => [
              styles.ctaButton,
              showFeedback
                ? isAnswerCorrect
                  ? styles.ctaSuccess
                  : styles.ctaDanger
                : isCheckDisabled()
                  ? styles.ctaDisabled
                  : styles.ctaPrimary,
              pressed && !isCheckDisabled() && styles.ctaPressed,
            ]}
            onPress={showFeedback ? handleNextStep : validateAnswer}
          >
            <Text
              style={[
                styles.ctaText,
                isCheckDisabled() && !showFeedback && styles.ctaTextDisabled,
              ]}
            >
              {showFeedback ? "Continue" : "Check Answer"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LessonColors.glassFill,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  progressBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ACFA70",
    borderRadius: 99,
  },
  metricsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: LessonColors.glassFill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metricItem: {
    fontSize: 13,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  questionCard: {
    padding: 16,
    gap: 12,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  questionPrompt: {
    fontSize: 17,
    fontWeight: "600",
    color: LessonColors.textPrimary,
    lineHeight: 24,
  },
  unitTagContainer: {
    alignSelf: "flex-start",
    backgroundColor: LessonColors.glassFill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unitTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: LessonColors.accentBlue,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mascotContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  mascotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: LessonColors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotEmoji: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  speechBubble: {
    flex: 1,
    backgroundColor: LessonColors.glassFill,
    borderRadius: 16,
    padding: 14,
  },
  speechText: {
    fontSize: 15,
    lineHeight: 22,
    color: LessonColors.textPrimary,
    fontWeight: "500",
  },
  mentorTipBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.25)",
  },
  mentorTipText: {
    fontSize: 13,
    color: LessonColors.accentBlue,
    fontWeight: "600",
  },
  // Multiple choice
  choicesList: {
    gap: 12,
  },
  choiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: LessonColors.optionFill,
    gap: 14,
  },
  optionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  choiceBtnSelected: {
    backgroundColor: "#D8EEFF",
    borderWidth: 2,
    borderColor: "#38BDF8",
  },
  choiceBtnCorrect: {
    backgroundColor: "#DCFCE7",
    borderWidth: 2,
    borderColor: "#4ADE80",
  },
  choiceBtnWrong: {
    backgroundColor: "#FEE2E2",
    borderWidth: 2,
    borderColor: "#F87171",
  },
  choiceBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceBadgeSelected: {
    backgroundColor: "#0284C7",
  },
  choiceBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4B5563",
  },
  choiceBadgeTextSelected: {
    color: "#FFFFFF",
  },
  choiceTextWrapper: {
    flex: 1,
  },
  choiceText: {
    fontSize: 15,
    fontWeight: "600",
    color: LessonColors.optionText,
    lineHeight: 20,
  },
  choiceTextSelected: {
    color: "#0369A1",
  },
  choiceSublabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  // Budget Allocator
  allocationCard: {
    backgroundColor: LessonColors.glassFill,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  allocationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.25)",
    paddingBottom: 10,
  },
  allocationTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: LessonColors.textPrimary,
  },
  allocationTotalValue: {
    fontWeight: "800",
    color: LessonColors.textPrimary,
  },
  totalPercentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  totalPercentGood: {
    backgroundColor: "rgba(74, 222, 128, 0.35)",
  },
  totalPercentWarn: {
    backgroundColor: "rgba(250, 189, 47, 0.35)",
  },
  totalPercentText: {
    fontSize: 12,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  budgetRow: {
    gap: 6,
  },
  budgetLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetCatTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  budgetCatDesc: {
    fontSize: 12,
    color: LessonColors.textSecondary,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  stepButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: LessonColors.optionFill,
    borderRadius: 10,
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
  },
  sliderBarTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 99,
    overflow: "hidden",
  },
  sliderBarFill: {
    height: "100%",
    borderRadius: 99,
  },
  // Category Sort
  sortContainer: {
    gap: 12,
  },
  sortHint: {
    fontSize: 14,
    color: LessonColors.textSecondary,
    fontWeight: "600",
  },
  sortItemCard: {
    backgroundColor: LessonColors.glassFill,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  sortItemText: {
    fontSize: 15,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  sortBtnGroup: {
    flexDirection: "row",
    gap: 10,
  },
  sortPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: LessonColors.optionFill,
    alignItems: "center",
  },
  sortPillAssetSelected: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1.5,
    borderColor: "#22C55E",
  },
  sortPillLiabilitySelected: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1.5,
    borderColor: "#EF4444",
  },
  sortPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  sortPillTextActive: {
    color: "#0F172A",
  },
  // Sticky Footer & CTA
  footerContainer: {
    padding: 16,
    backgroundColor: LessonColors.glassFill,
    gap: 12,
  },
  footerCorrect: {
    backgroundColor: "rgba(22, 101, 52, 0.45)",
  },
  footerWrong: {
    backgroundColor: "rgba(127, 29, 29, 0.45)",
  },
  feedbackInfo: {
    gap: 4,
  },
  feedbackHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feedbackIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: LessonColors.textPrimary,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  feedbackExplanationText: {
    fontSize: 14,
    color: LessonColors.textPrimary,
    lineHeight: 20,
    fontWeight: "500",
  },
  ctaButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPrimary: {
    backgroundColor: LessonColors.ctaFill,
  },
  ctaSecondary: {
    backgroundColor: LessonColors.glassFill,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  ctaSuccess: {
    backgroundColor: "#16A34A",
  },
  ctaDanger: {
    backgroundColor: "#DC2626",
  },
  ctaDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  ctaTextSecondary: {
    fontSize: 16,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  ctaTextDisabled: {
    color: LessonColors.textSecondary,
  },
  actionButtonColumn: {
    width: "100%",
    gap: 10,
  },
  // End screens (Victory / Game Over)
  endScreenScroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  endScreenCenter: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  endCard: {
    padding: 24,
    alignItems: "center",
    gap: 20,
  },
  victoryHeader: {
    alignItems: "center",
    gap: 6,
  },
  victoryBadge: {
    fontSize: 14,
    fontWeight: "800",
    color: LessonColors.amber,
    letterSpacing: 1,
  },
  victoryTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: LessonColors.textPrimary,
    textAlign: "center",
  },
  victorySubtitle: {
    fontSize: 14,
    color: LessonColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  statBox: {
    flex: 1,
    backgroundColor: LessonColors.glassFill,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: LessonColors.textSecondary,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: LessonColors.textPrimary,
  },
  wisdomCard: {
    width: "100%",
    backgroundColor: LessonColors.glassFill,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  wisdomHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4ADE80",
    marginBottom: 4,
  },
  wisdomItem: {
    fontSize: 13,
    color: LessonColors.textPrimary,
    lineHeight: 18,
    fontWeight: "500",
  },
  gameOverTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F87171",
  },
  gameOverSubtitle: {
    fontSize: 14,
    color: LessonColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
