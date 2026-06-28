import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const LESSONS = [
  { day: 1, title: 'The Plastic Crisis', icon: '🥤', duration: '5 min', pts: 50, unlocked: true },
  { day: 2, title: 'Paper and Forests', icon: '📄', duration: '5 min', pts: 50, unlocked: false },
  { day: 3, title: 'E-Waste: The Hidden Danger', icon: '💻', duration: '6 min', pts: 50, unlocked: false },
  { day: 4, title: 'Composting Basics', icon: '🍎', duration: '5 min', pts: 50, unlocked: false },
  { day: 5, title: 'The Circular Economy', icon: '♻️', duration: '7 min', pts: 50, unlocked: false },
];

export default function LessonsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Eco Lessons</Text>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressText}>Progress: 0 / {LESSONS.length} lessons</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '0%' }]} />
        </View>
        <Text style={styles.progressHint}>Each lesson is worth 50 pts</Text>
      </View>

      {/* Lessons list */}
      {LESSONS.map((lesson) => (
        <TouchableOpacity
          key={lesson.day}
          style={[styles.lessonCard, !lesson.unlocked && styles.lessonLocked]}
          disabled={!lesson.unlocked}
        >
          <View style={[styles.lessonIcon, !lesson.unlocked && styles.iconLocked]}>
            <Text style={styles.lessonIconText}>
              {lesson.unlocked ? lesson.icon : '🔒'}
            </Text>
          </View>
          <View style={styles.lessonInfo}>
            <Text style={styles.lessonDay}>Day {lesson.day}</Text>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <View style={styles.lessonMeta}>
              <Text style={styles.metaText}>⏱ {lesson.duration}</Text>
              <Text style={styles.metaPts}>+{lesson.pts} pts</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 80 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  progressHint: { fontSize: 11, color: '#9ca3af', marginTop: 6 },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonLocked: { opacity: 0.6 },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLocked: { backgroundColor: '#f3f4f6' },
  lessonIconText: { fontSize: 24 },
  lessonInfo: { flex: 1 },
  lessonDay: { fontSize: 11, color: '#9ca3af' },
  lessonTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginTop: 1 },
  lessonMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  metaText: { fontSize: 12, color: '#9ca3af' },
  metaPts: { fontSize: 12, color: '#16a34a', fontWeight: '600' },
});
