import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Mock venue data
const venues = [
  { id: '1', name: 'Club Mexico', googleMapsUrl: 'https://maps.google.com/?q=Club+Mexico' },
  { id: '2', name: 'Bar Central', googleMapsUrl: 'https://maps.google.com/?q=Bar+Central' },
  { id: '3', name: 'La Fiesta', googleMapsUrl: 'https://maps.google.com/?q=La+Fiesta' },
  { id: '4', name: 'El Pub', googleMapsUrl: 'https://maps.google.com/?q=El+Pub' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filteredVenues = venues.filter(v =>
    v.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Search for a venue</Text>
      <TextInput
        placeholder="Type venue name..."
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 16 }}
      />
      <FlatList
        data={filteredVenues}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
            onPress={() => router.push({ pathname: '/(tabs)/venue-details', params: { id: item.id } })}
          >
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No venues found.</Text>}
      />
    </View>
  );
} 