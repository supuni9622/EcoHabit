import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const QUICK_ACTIONS = [
  { type: 'plastic', icon: '🥤', label: 'Plastic', pts: 10 },
  { type: 'paper', icon: '📄', label: 'Paper', pts: 8 },
  { type: 'e-waste', icon: '💻', label: 'E-Waste', pts: 20 },
  { type: 'organic', icon: '🍎', label: 'Organic', pts: 5 },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Greeting */}
      <View style={styles.greetingCard}>
        <Text style={styles.greeting}>Good day, EcoHero! 🌱</Text>
        <Text style={styles.subtitle}>Ready to make a difference today?</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#16a34a' }]}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#f97316' }]}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>🔥 Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.statValue}>Lv.1</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      {/* Quick Log */}
      <Text style={styles.sectionTitle}>Quick Log</Text>
      <View style={styles.quickActions}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity key={action.type} style={styles.actionButton}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
            <Text style={styles.actionPts}>+{action.pts}pts</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Actions */}
      <Text style={styles.sectionTitle}>Recent Actions</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>♻️</Text>
        <Text style={styles.emptyText}>No actions logged yet.</Text>
        <Text style={styles.emptySubtext}>Tap a type above to get started!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 80 },
  greetingCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#14532d' },
  subtitle: { fontSize: 14, color: '#166534', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  actionIcon: { fontSize: 32, marginBottom: 6 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  actionPts: { fontSize: 12, color: '#16a34a', marginTop: 2 },
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
