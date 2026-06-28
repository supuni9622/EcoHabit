import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const WASTE_TYPES = [
  { id: 'plastic', icon: '🥤', label: 'Plastic', pts: 10, color: '#3b82f6' },
  { id: 'paper', icon: '📄', label: 'Paper', pts: 8, color: '#22c55e' },
  { id: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20, color: '#8b5cf6' },
  { id: 'organic', icon: '🍎', label: 'Organic', pts: 5, color: '#f59e0b' },
  { id: 'glass', icon: '🍶', label: 'Glass', pts: 12, color: '#06b6d4' },
  { id: 'metal', icon: '🥫', label: 'Metal', pts: 14, color: '#6b7280' },
];

export default function HabitsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log Eco Action</Text>
      <Text style={styles.subtitle}>Tap a waste type to log it</Text>

      {/* Daily Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Today's Points</Text>
          <Text style={styles.progressValue}>0 / 500</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '0%' }]} />
        </View>
        <Text style={styles.progressHint}>500 points remaining today</Text>
      </View>

      {/* Waste Type Grid */}
      <View style={styles.grid}>
        {WASTE_TYPES.map((wt) => (
          <TouchableOpacity
            key={wt.id}
            style={[styles.wasteCard, { backgroundColor: wt.color }]}
          >
            <Text style={styles.wasteIcon}>{wt.icon}</Text>
            <Text style={styles.wasteLabel}>{wt.label}</Text>
            <Text style={styles.wastePts}>+{wt.pts}pts/item</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today's logs */}
      <Text style={styles.sectionTitle}>Today's Logs</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🌱</Text>
        <Text style={styles.emptyText}>Nothing logged today yet.</Text>
        <Text style={styles.emptySubtext}>Tap a type above to get started!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16, marginTop: 4 },
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },
  progressValue: { fontSize: 14, color: '#16a34a', fontWeight: 'bold' },
  progressBar: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 5,
  },
  progressHint: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  wasteCard: {
    width: '30%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  wasteIcon: { fontSize: 28, marginBottom: 6 },
  wasteLabel: { fontSize: 12, fontWeight: '700', color: '#fff' },
  wastePts: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  emptySubtext: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
});
