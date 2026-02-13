import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { Colors } from '../../constants/Colors';

export default function LiveScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text} variant="heading" color={Colors.white}>District Live Coming Soon</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  }
});
