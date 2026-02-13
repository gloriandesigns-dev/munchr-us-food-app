import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { 
  useFonts, 
  Outfit_400Regular, 
  Outfit_500Medium, 
  Outfit_700Bold 
} from '@expo-google-fonts/outfit';
import { 
  DMSans_400Regular, 
  DMSans_500Medium, 
  DMSans_700Bold 
} from '@expo-google-fonts/dm-sans';
import { View } from 'react-native';
import { GlobalProvider } from '../context/GlobalContext';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="verify-otp" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="enter-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="restaurant/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="category/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="order-tracking" options={{ animation: 'fade' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="payment-methods" options={{ animation: 'slide_from_right' }} />
      </Stack>
      <StatusBar style="light" />
    </GlobalProvider>
  );
}
