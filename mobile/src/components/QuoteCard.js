import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

// Requisito del proyecto: el texto de una cita siempre se muestra en cursiva.
export default function QuoteCard({ texto, titulo, autor, pagina, tono }) {
  return (
    <View style={styles.card}>
      <Text style={styles.quoteMark}>“</Text>
      <Text style={styles.quote}>{texto}</Text>
      <View style={styles.divider} />
      <Text style={styles.book}>{titulo}</Text>
      <Text style={styles.author}>
        {autor}
        {pagina ? ` · p. ${pagina}` : ''}
      </Text>
      {tono ? (
        <View style={styles.mood}>
          <Text style={styles.moodText}>{tono}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, marginBottom: 14, padding: 22 },
  quoteMark: { color: colors.accent, fontFamily: fonts.serif, fontSize: 42, height: 35 },
  quote: { color: colors.inkSoft, fontFamily: fonts.serif, fontSize: 18, fontStyle: 'italic', lineHeight: 27, marginTop: 4 },
  divider: { backgroundColor: '#E8DED0', height: 1, marginVertical: 17, width: 38 },
  book: { color: '#3B332A', fontSize: 14, fontWeight: '700' },
  author: { color: '#81766A', fontSize: 13, marginTop: 4 },
  mood: { alignSelf: 'flex-start', backgroundColor: colors.accentSoft, borderRadius: 20, marginTop: 14, paddingHorizontal: 11, paddingVertical: 6 },
  moodText: { color: colors.accentInk, fontSize: 11 },
});
