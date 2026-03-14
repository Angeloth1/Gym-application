import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#007AFF',
        headerRight: () => (
          <Link href="/profile" asChild>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              <Text style={{ marginRight: 8, fontSize: 16, fontWeight: 'bold' }}>Profile</Text>
              <MaterialCommunityIcons name="account-circle" size={28} color="gray" />
            </Pressable>
          </Link>
        ),
      }}
    >
      
      {/* 1. ΑΡΙΣΤΕΡΑ: Stats */}
      <Tabs.Screen 
        name="stats" 
        options={{ 
          title: 'Stats', 
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" size={24} color={color} /> 
        }} 
      />

      {/* 2. ΚΕΝΤΡΟ: Main (index) */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Main', 
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weight-lifter" size={24} color={color} />
        }} 
      />
      
      {/* 3. ΔΕΞΙΑ: Challenges */}
      <Tabs.Screen 
        name="challenges" 
        options={{ 
          title: 'Challenges', 
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="trophy-outline" size={24} color={color} /> 
        }} 
      />

      {/* Κρυφή οθόνη Profile */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          href: null, 
          title: 'My Profile' 
        }} 
      />
      
    </Tabs>
  );
}