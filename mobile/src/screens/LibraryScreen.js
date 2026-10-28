import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import QuoteCard from '../components/QuoteCard';
import { sampleQuotes } from '../database/sampleData';
import { booksApi, quotesApi } from '../services/apiClient';
import { colors, fonts } from '../theme';

async function loadQuotes() {
  const [books, quotes] = await Promise.all([booksApi.list(), quotesApi.list()]);
  const byId = Object.fromEntries(books.map((book) => [book.id, book]));
  return quotes.map((quote) => ({
    id: quote.id,
    texto: quote.texto,
    pagina: quote.pagina_exacta,
    titulo: byId[quote.libro_id]?.titulo,
    autor: byId[quote.libro_id]?.autor,
  }));
}

export default function LibraryScreen({ onCapture }) {
  const [quotes, setQuotes] = useState(sampleQuotes);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    loadQuotes()
      .then((list) => {
        if (list.length) setQuotes(list);
      })
      .catch(() => setOffline(true));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>TU BIBLIOTECA, EN SINTONÍA</Text>
      <Text style={styles.title}>Banda Sonora{'\n'}Literaria</Text>
      <Text style={styles.intro}>Guarda las frases que te acompañan y vuelve a ellas cuando quieras.</Text>

      <Button title="Nueva cita desde foto" onPress={onCapture} style={styles.capture} />
      {offline ? <Text style={styles.offline}>Sin conexión con la API: mostrando citas de ejemplo.</Text> : null}

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Tus citas</Text>
        <Text style={styles.count}>{String(quotes.length).padStart(2, '0')}</Text>
      </View>

      {quotes.map((quote) => (
        <QuoteCard key={quote.id} {...quote} />
      ))}

      <Text style={styles.footer}>Un lugar para las palabras que se quedan.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 48 },
  eyebrow: { color: '#8A7159', fontSize: 11, letterSpacing: 2, fontWeight: '700' },
  title: { color: colors.ink, fontFamily: fonts.serif, fontSize: 38, lineHeight: 43, marginTop: 14 },
  intro: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: 310 },
  capture: { marginTop: 24 },
  offline: { color: colors.accentInk, fontSize: 12, marginTop: 10 },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 34, marginBottom: 14 },
  sectionTitle: { color: colors.ink, fontFamily: fonts.serif, fontSize: 22 },
  count: { color: '#9A846D', fontSize: 12, letterSpacing: 1 },
  footer: { color: colors.subtle, fontFamily: fonts.serif, fontSize: 13, fontStyle: 'italic', marginTop: 15, textAlign: 'center' },
});
