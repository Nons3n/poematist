import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const featuredQuotes = [
  {
    quote: 'And, when you want something, all the universe conspires in helping you to achieve it.',
    book: 'The Alchemist',
    author: 'Paulo Coelho',
    mood: 'Esperanzador',
  },
  {
    quote: 'We are such stuff as dreams are made on.',
    book: 'The Tempest',
    author: 'William Shakespeare',
    mood: 'Contemplativo',
  },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.eyebrow}>TU BIBLIOTECA, EN SINTONÍA</Text>
        <Text style={styles.title}>Banda Sonora{ '\n' }Literaria</Text>
        <Text style={styles.intro}>Guarda las frases que te acompañan y vuelve a ellas cuando quieras.</Text>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Citas destacadas</Text>
          <Text style={styles.count}>02</Text>
        </View>

        {featuredQuotes.map((item) => (
          <View key={item.book} style={styles.card}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.quote}>{item.quote}</Text>
            <View style={styles.divider} />
            <Text style={styles.book}>{item.book}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <View style={styles.mood}><Text style={styles.moodText}>{item.mood}</Text></View>
          </View>
        ))}

        <Text style={styles.footer}>Un lugar para las palabras que se quedan.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F1E8' },
  page: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 48 },
  eyebrow: { color: '#8A7159', fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  title: { color: '#29251F', fontFamily: 'Georgia', fontSize: 38, lineHeight: 43, marginTop: 14 },
  intro: { color: '#70695F', fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: 310 },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 38, marginBottom: 14 },
  sectionTitle: { color: '#29251F', fontFamily: 'Georgia', fontSize: 22 },
  count: { color: '#9A846D', fontSize: 12, letterSpacing: 1 },
  card: { backgroundColor: '#FFFCF7', borderColor: '#E9E0D4', borderRadius: 18, borderWidth: 1, marginBottom: 14, padding: 22 },
  quoteMark: { color: '#BA8B5A', fontFamily: 'Georgia', fontSize: 42, height: 35 },
  quote: { color: '#383128', fontFamily: 'Georgia', fontSize: 18, fontStyle: 'italic', lineHeight: 27, marginTop: 4 },
  divider: { backgroundColor: '#E8DED0', height: 1, marginVertical: 17, width: 38 },
  book: { color: '#3B332A', fontSize: 14, fontWeight: '700' },
  author: { color: '#81766A', fontSize: 13, marginTop: 4 },
  mood: { alignSelf: 'flex-start', backgroundColor: '#F1E8DC', borderRadius: 20, marginTop: 14, paddingHorizontal: 11, paddingVertical: 6 },
  moodText: { color: '#806748', fontSize: 11 },
  footer: { color: '#A09587', fontFamily: 'Georgia', fontSize: 13, fontStyle: 'italic', marginTop: 15, textAlign: 'center' },
});
