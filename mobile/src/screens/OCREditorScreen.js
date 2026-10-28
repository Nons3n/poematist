import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';
import { booksApi, quotesApi } from '../services/apiClient';
import { extractText } from '../services/ocrService';
import { colors, fonts } from '../theme';

const NEW_BOOK = 'nuevo';
const pickerOptions = { mediaTypes: ['images'], allowsEditing: true, quality: 0.8 };

export default function OCREditorScreen({ onClose, onSaved }) {
  const [imageUri, setImageUri] = useState(null);
  const [texto, setTexto] = useState('');
  const [reading, setReading] = useState(false);
  const [books, setBooks] = useState([]);
  const [bookId, setBookId] = useState(NEW_BOOK);
  const [newBook, setNewBook] = useState({ titulo: '', autor: '' });
  const [pagina, setPagina] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    booksApi
      .list()
      .then((list) => {
        setBooks(list);
        if (list.length) setBookId(list[0].id);
      })
      .catch(() => {});
  }, []);

  async function pick(fromCamera) {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Activa el permiso en los ajustes del teléfono para continuar.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(pickerOptions)
      : await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (result.canceled) return;

    const asset = result.assets[0];
    setImageUri(asset.uri);
    setReading(true);
    try {
      const extracted = await extractText(asset);
      setTexto(extracted);
      if (!extracted) Alert.alert('Sin texto', 'No se detectó texto. Prueba con otra foto o escríbelo a mano.');
    } catch (error) {
      Alert.alert('No se pudo leer la foto', error.message);
    } finally {
      setReading(false);
    }
  }

  async function save() {
    const cita = texto.trim();
    if (!cita) return Alert.alert('Falta la cita', 'Deja al menos una frase antes de guardar.');
    if (bookId === NEW_BOOK && (!newBook.titulo.trim() || !newBook.autor.trim())) {
      return Alert.alert('Falta el libro', 'Escribe el título y el autor del libro.');
    }

    setSaving(true);
    try {
      const libroId =
        bookId === NEW_BOOK
          ? (await booksApi.create({ titulo: newBook.titulo.trim(), autor: newBook.autor.trim() })).id
          : bookId;
      await quotesApi.create({
        libro_id: libroId,
        texto: cita,
        pagina_exacta: pagina.trim() || null,
        origen: 'FOTO',
      });
      onSaved();
    } catch (error) {
      Alert.alert('No se pudo guardar', error.message);
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>← Volver</Text>
        </Pressable>
        <Text style={styles.title}>Nueva cita{'\n'}desde una foto</Text>

        <View style={styles.row}>
          <Button title="Tomar foto" onPress={() => pick(true)} disabled={reading} style={styles.flex} />
          <Button title="Galería" variant="secondary" onPress={() => pick(false)} disabled={reading} style={styles.flex} />
        </View>

        {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" /> : null}

        {reading ? <Text style={styles.hint}>Leyendo el texto de la foto…</Text> : null}

        {imageUri && !reading ? (
          <>
            <Text style={styles.label}>Texto de la cita</Text>
            <Text style={styles.hint}>Corrige errores y borra lo que no quieras guardar.</Text>
            <TextInput
              style={styles.quoteInput}
              value={texto}
              onChangeText={setTexto}
              multiline
              placeholder="Escribe o pega aquí la cita"
              placeholderTextColor={colors.subtle}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Libro</Text>
            <View style={styles.chips}>
              {books.map((book) => (
                <Chip key={book.id} label={book.titulo} active={bookId === book.id} onPress={() => setBookId(book.id)} />
              ))}
              <Chip label="+ Nuevo libro" active={bookId === NEW_BOOK} onPress={() => setBookId(NEW_BOOK)} />
            </View>
            {bookId === NEW_BOOK ? (
              <>
                <TextInput
                  style={styles.input}
                  value={newBook.titulo}
                  onChangeText={(titulo) => setNewBook((b) => ({ ...b, titulo }))}
                  placeholder="Título"
                  placeholderTextColor={colors.subtle}
                />
                <TextInput
                  style={styles.input}
                  value={newBook.autor}
                  onChangeText={(autor) => setNewBook((b) => ({ ...b, autor }))}
                  placeholder="Autor"
                  placeholderTextColor={colors.subtle}
                />
              </>
            ) : null}

            <Text style={styles.label}>Página</Text>
            <TextInput
              style={styles.input}
              value={pagina}
              onChangeText={setPagina}
              placeholder="Ej. 42"
              placeholderTextColor={colors.subtle}
              keyboardType="number-pad"
            />

            <Button title="Guardar cita" onPress={save} loading={saving} style={styles.save} />
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },
  back: { color: colors.accentInk, fontSize: 14 },
  title: { color: colors.ink, fontFamily: fonts.serif, fontSize: 30, lineHeight: 36, marginBottom: 22, marginTop: 14 },
  row: { flexDirection: 'row', gap: 10 },
  preview: { backgroundColor: colors.accentSoft, borderRadius: 14, height: 220, marginTop: 18, width: '100%' },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: 22 },
  hint: { color: colors.muted, fontSize: 13, marginBottom: 8, marginTop: 10 },
  quoteInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.inkSoft,
    fontFamily: fonts.serif,
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 25,
    minHeight: 160,
    padding: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: { borderColor: colors.border, borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: colors.surface },
  save: { marginTop: 26 },
});
