import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LibraryScreen from './src/screens/LibraryScreen';
import OCREditorScreen from './src/screens/OCREditorScreen';
import { colors } from './src/theme';

// Navegación mínima por estado; se reemplazará por React Navigation (Stack/Tabs).
export default function App() {
  const [screen, setScreen] = useState('library');
  const [libraryKey, setLibraryKey] = useState(0);

  function showLibrary(reload) {
    if (reload) setLibraryKey((key) => key + 1);
    setScreen('library');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {screen === 'capture' ? (
          <OCREditorScreen onClose={() => showLibrary(false)} onSaved={() => showLibrary(true)} />
        ) : (
          <LibraryScreen key={libraryKey} onCapture={() => setScreen('capture')} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
});
