import { Tabs } from 'expo-router';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BlurView } from 'expo-blur';
import { ThemedText } from '../../components/ThemedText';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.floatingTabBar,
        tabBarBackground: () => (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarItemStyle: styles.tabItemContainer,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Delivery',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons name={focused ? "moped" : "moped-outline"} size={24} color={color} />
              <ThemedText style={[styles.tabLabel, { color }]} fontFamily="dmsans" weight="medium">Delivery</ThemedText>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="under25"
        options={{
          title: 'Under $25',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                 <MaterialCommunityIcons name={focused ? "tag-text" : "tag-text-outline"} size={20} color={focused ? Colors.white : color} />
              </View>
              <ThemedText style={[styles.tabLabel, { color }]} fontFamily="dmsans" weight="medium">Under $25</ThemedText>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dining"
        options={{
          title: 'Dining',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabItem}>
              <MaterialCommunityIcons name={focused ? "silverware-fork-knife" : "silverware-fork-knife"} size={24} color={color} />
              <ThemedText style={[styles.tabLabel, { color }]} fontFamily="dmsans" weight="medium">Dining</ThemedText>
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="live"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '90%', 
    left: '5%',
    borderRadius: 50,
    backgroundColor: 'rgba(30,30,30,0.9)',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: 'hidden',
    paddingVertical: 0, // Removed padding as requested
    paddingHorizontal: 0, // Removed padding as requested
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70, // Fixed height to maintain pill shape without padding
  },
  tabItemContainer: {
    padding: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
  },
  tabLabel: {
    fontSize: 11,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 32,
    height: 24, 
    marginBottom: -2,
    marginTop: -2,
  },
});
