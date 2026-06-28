import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ emoji, label }: { emoji: string; label: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#16a34a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" />,
          headerTitle: '🌿 EcoHabit',
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Log',
          tabBarIcon: ({ focused }) => <TabIcon emoji="♻️" label="Log" />,
          headerTitle: 'Log Habits',
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" label="Learn" />,
          headerTitle: 'Eco Lessons',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}
