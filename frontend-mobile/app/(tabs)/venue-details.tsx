import React from 'react';
import { View, Text, Button, Linking, FlatList, Image, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Example bathroom photo URLs
const bathroomPhotos = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
];

// Mock venue data (should match search.tsx)
const venues = [
  {
    id: '1',
    name: 'Club Mexico',
    googleMapsUrl: 'https://maps.google.com/?q=Club+Mexico',
    scores: {
      privacy: 4.5,
      availability: 4,
      cleanliness: 4.5,
      vibe: 4,
      safety: 4.5,
      doorman: 4,
      security: 4.5,
    },
    photos: bathroomPhotos,
  },
  {
    id: '2',
    name: 'Bar Central',
    googleMapsUrl: 'https://maps.google.com/?q=Bar+Central',
    scores: {
      privacy: 3,
      availability: 3.5,
      cleanliness: 3,
      vibe: 3.5,
      safety: 3,
      doorman: 3,
      security: 3.5,
    },
    photos: bathroomPhotos,
  },
  {
    id: '3',
    name: 'La Fiesta',
    googleMapsUrl: 'https://maps.google.com/?q=La+Fiesta',
    scores: {
      privacy: 4,
      availability: 4,
      cleanliness: 4,
      vibe: 4,
      safety: 4,
      doorman: 4,
      security: 4,
    },
    photos: bathroomPhotos,
  },
  {
    id: '4',
    name: 'El Pub',
    googleMapsUrl: 'https://maps.google.com/?q=El+Pub',
    scores: {
      privacy: 2,
      availability: 2.5,
      cleanliness: 2,
      vibe: 2.5,
      safety: 2,
      doorman: 2,
      security: 2.5,
    },
    photos: bathroomPhotos,
  },
];

// Mock reviews
type Review = { id: string; username: string; rating: number; text: string; timestamp: string };
const reviews: { [key: string]: Review[] } = {
  '1': [
    { id: 'r1', username: 'juan', rating: 4.5, text: 'Great bathroom, clean and private.', timestamp: '2024-06-01' },
    { id: 'r2', username: 'ana', rating: 5, text: 'Best club bathroom in town!', timestamp: '2024-06-02' },
  ],
  '2': [
    { id: 'r3', username: 'luis', rating: 3, text: 'Okay, but could be cleaner.', timestamp: '2024-06-01' },
  ],
  '3': [],
  '4': [
    { id: 'r4', username: 'sofia', rating: 2.5, text: 'Not great, long lines.', timestamp: '2024-06-01' },
  ],
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function VenueDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const venueId = Array.isArray(id) ? id[0] : id;
  const venue = venues.find(v => v.id === venueId);
  const venueReviews = venueId && reviews[venueId] ? reviews[venueId] : [];

  if (!venue) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Venue not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{venue.name}</Text>
          <Text style={{ color: 'blue', marginBottom: 8 }} onPress={() => Linking.openURL(venue.googleMapsUrl)}>
            View on Google Maps
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, alignItems: 'center', gap: 12 }}>
            <Text>Privacy: {venue.scores.privacy} ⭐</Text>
            <Text>Availability: {venue.scores.availability} ⭐</Text>
            <Text>Cleanliness: {venue.scores.cleanliness} ⭐</Text>
            <Text>Vibe: {venue.scores.vibe} ⭐</Text>
            <Text>Safety & Security: {venue.scores.safety} ⭐</Text>
          </View>
          <Text style={{ marginBottom: 4 }}>Doorman Score: {venue.scores.doorman} ⭐</Text>
          <Text style={{ marginBottom: 8 }}>Security Score: {venue.scores.security} ⭐</Text>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ width: SCREEN_WIDTH * 0.45, height: 180 }}
        >
          {venue.photos.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{ width: SCREEN_WIDTH * 0.45, height: 180, borderRadius: 12, marginRight: 8 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>
      <Button title="Add Review" onPress={() => router.push({ pathname: '/(tabs)/add-review', params: { id: venue.id } })} />
      <Text style={{ fontSize: 18, marginTop: 24, marginBottom: 8 }}>Reviews</Text>
      <FlatList
        data={venueReviews}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12, padding: 8, borderWidth: 1, borderColor: '#eee', borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.username} ({item.rating} ⭐)</Text>
            <Text style={{ color: '#888', fontSize: 12 }}>{item.timestamp}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No reviews yet.</Text>}
      />
    </View>
  );
} 