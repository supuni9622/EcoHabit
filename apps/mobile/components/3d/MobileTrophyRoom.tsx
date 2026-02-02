import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Badge } from '@ecohabit/shared';
import { getCapabilityInfo } from '@ecohabit/shared';

export interface MobileTrophyRoomProps {
  badges: Badge[];
  onBadgeSelect?: (badge: Badge) => void;
  style?: any;
}

/**
 * Mobile Trophy Room
 * 2D grid view optimized for mobile (3D can be added later if needed)
 */
export const MobileTrophyRoom: React.FC<MobileTrophyRoomProps> = ({
  badges,
  onBadgeSelect,
  style,
}) => {
  const capabilities = getCapabilityInfo();
  
  // For now, use 2D grid for mobile (3D can be added when expo-three is fully configured)
  // Mobile 3D requires more setup and testing
  
  return (
    <View style={[styles.container, style]}>
      <ScrollView contentContainerStyle={styles.grid}>
        {badges.map((badge) => (
          <TouchableOpacity
            key={badge.id}
            style={[
              styles.badgeCard,
              badge.unlockedAt ? styles.unlocked : styles.locked,
            ]}
            onPress={() => onBadgeSelect?.(badge)}
            activeOpacity={0.7}
          >
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text
              style={[
                styles.badgeName,
                badge.unlockedAt ? styles.unlockedText : styles.lockedText,
              ]}
              numberOfLines={2}
            >
              {badge.name}
            </Text>
            {badge.unlockedAt && (
              <Text style={styles.rarity}>{badge.rarity}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  badgeCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlocked: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  locked: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  unlockedText: {
    color: '#166534',
  },
  lockedText: {
    color: '#6b7280',
  },
  rarity: {
    fontSize: 10,
    color: '#059669',
    textTransform: 'capitalize',
  },
});

