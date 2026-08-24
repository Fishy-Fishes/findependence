import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { ScaleProgressBar } from '@/components/scale-progress-bar';
import { useCurrent } from '@/contexts/current';

export default function HomeScreen() {
  const { current, goal } = useCurrent();

  const ratio = current / goal

  return (
    <LinearGradient
      style={styles.gradient}
      colors={['#0A3E56', '#09697E', '#56C978']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeTitle}>Welcome</Text>

            <View style={styles.goalTitleRow}>
              <Text style={styles.goalsTitle}>Findependence Goals</Text>
              <Text style={styles.pencilIcon}>✎</Text>
            </View>

            <Text style={styles.subtitle}>
              You'll need to save before you move
            </Text>
          </View>

          {/* Progress Bars Section */}
          <View style={styles.goalsSection}>
            {/* Bond Progress */}
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Bond</Text>
              <ScaleProgressBar
                progress={ratio}
                color="#94EB68"
                label={`$${goal.toFixed(0)}`}
              />
            </View>

            {/* Weekly income Progress with saving and spending segments */}
            <View style={styles.goalItem}>
              <View style={styles.weeklyIncomeLabelRow}>
                <Text style={styles.goalLabel}>Weekly income </Text>
                <Text style={styles.savingTag}>saving </Text>
                <Text style={styles.spendingTag}>spending</Text>
              </View>
              <ScaleProgressBar
                segments={[
                  { ratio: 0.35, color: '#E8EE42' },
                  { ratio: 0.25, color: '#94EB68' },
                ]}
                label="$650 avg"
              />
            </View>

            {/* Setup costs & emergency buffer */}
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Setup costs & emergency buffer</Text>
              <ScaleProgressBar
                progress={0.04}
                color="#94EB68"
                label="$4000"
              />
            </View>
          </View>

          {/* Daily Progress Section */}
          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Daily Progress</Text>
            <Text style={styles.dailySubtitle}>
              Make sure to log or learn every day
            </Text>

            {/* Day Numbers Row */}
            <View style={styles.daysRow}>
              <View style={[styles.dayBox, styles.greenDay]}>
                <Text style={styles.dayBoxTextDark}>9</Text>
              </View>
              <View style={[styles.dayBox, styles.redDay]}>
                <Text style={styles.dayBoxTextLight}>10</Text>
              </View>
              <View style={styles.dayBox}>
                <Text style={styles.dayBoxTextDark}>11</Text>
              </View>
              <View style={styles.dayBox}>
                <Text style={styles.dayBoxTextDark}>11</Text>
              </View>
              <View style={styles.dayBox}>
                <Text style={styles.dayBoxTextDark}>11</Text>
              </View>
              <View style={styles.dayBox}>
                <Text style={styles.dayBoxTextDark}>12</Text>
              </View>
              <View style={styles.dayBox}>
                <Text style={styles.dayBoxTextDark}>13</Text>
              </View>
            </View>

            {/* Today's Task Card */}
            <View style={styles.taskCard}>
              <View style={styles.taskIconCircle}>
                <Text style={styles.taskIconSymbol}>⌂</Text>
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskHeaderTag}>
                  Today's Task{' '}
                  <Text style={styles.taskXpTag}>90 XP · ~10 min</Text>
                </Text>
                <Text style={styles.taskTitle}>Learning about bonds</Text>
                <Text style={styles.taskSubtitle}>
                  Starting a new rental agreement
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: BottomTabInset + 40,
    gap: 20,
  },
  headerContainer: {
    gap: 4,
  },
  welcomeTitle: {
    fontSize: 38,
    fontWeight: '400',
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalsTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  pencilIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  goalsSection: {
    gap: 16,
  },
  goalItem: {
    gap: 8,
  },
  goalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weeklyIncomeLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  savingTag: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E8EE42',
  },
  spendingTag: {
    fontSize: 17,
    fontWeight: '700',
    color: '#94EB68',
  },
  dailySection: {
    marginTop: 8,
    gap: 12,
  },
  dailyTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dailySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -4,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  dayBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenDay: {
    backgroundColor: '#94EB68',
  },
  redDay: {
    backgroundColor: '#F25252',
  },
  dayBoxTextDark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2A20',
  },
  dayBoxTextLight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    padding: 16,
    gap: 14,
    marginTop: 6,
  },
  taskIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconSymbol: {
    color: '#FFFFFF',
    fontSize: 24,
    marginTop: -2,
  },
  taskInfo: {
    flex: 1,
    gap: 2,
  },
  taskHeaderTag: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  taskXpTag: {
    color: '#65E1E6',
    fontWeight: '700',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  taskSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
