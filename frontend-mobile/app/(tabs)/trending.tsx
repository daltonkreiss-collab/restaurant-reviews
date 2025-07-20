import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Mock venue data (should match other screens)
const venues = [
  { id: '1', name: 'Club Mexico', scores: { bathroom: 4.5 }, },
  { id: '2', name: 'Bar Central', scores: { bathroom: 3.5 }, },
  { id: '3', name: 'La Fiesta', scores: { bathroom: 4 }, },
  { id: '4', name: 'El Pub', scores: { bathroom: 2.5 }, },
];

// Mock reviews (should match other screens)
type Review = { id: string; rating: number; timestamp: string };
const reviews: { [key: string]: Review[] } = {
  '1': [
    { id: 'r1', rating: 4.5, timestamp: '2024-06-01' },
    { id: 'r2', rating: 5, timestamp: '2024-06-02' },
  ],
  '2': [
    { id: 'r3', rating: 3, timestamp: '2024-06-01' },
  ],
  '3': [],
  '4': [
    { id: 'r4', rating: 2.5, timestamp: '2024-06-01' },
  ],
};

// Calculate trending score (recent reviews, average rating, number of reviews)
function getTrendingScore(venueId: string) {
  const venueReviews = reviews[venueId] || [];
  const now = new Date('2024-06-03'); // Mock current date
  const recentReviews = venueReviews.filter((r: Review) => (now.getTime() - new Date(r.timestamp).getTime()) < 7 * 24 * 60 * 60 * 1000);
  const avgRating = venueReviews.length ? (venueReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / venueReviews.length) : 0;
  // Trending score: recent reviews count * 2 + avgRating * 3 + total reviews
  return recentReviews.length * 2 + avgRating * 3 + venueReviews.length;
}

const THUMBNAIL = 'https://placehold.co/100x100'; // Placeholder image

export default function TrendingScreen() {
  const router = useRouter();
  // Sort venues by trending score
  const sortedVenues = [...venues].sort((a, b) => getTrendingScore(b.id) - getTrendingScore(a.id));

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Trending Venues</Text>
      <FlatList
        data={sortedVenues}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const venueReviews = reviews[item.id] || [];
          const avgRating = venueReviews.length ? (venueReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / venueReviews.length).toFixed(1) : 'N/A';
          return (
            <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, flexDirection: 'row', alignItems: 'stretch', backgroundColor: 'white' }}>
              <Image
                source={{ uri: THUMBNAIL }}
                style={{ width: 90, borderRadius: 8, marginRight: 12, alignSelf: 'stretch' }}
                resizeMode="cover"
              />
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                  <Text>Average Rating: {avgRating} ⭐</Text>
                  <Text>Number of Reviews: {venueReviews.length}</Text>
                </View>
                <TouchableOpacity
                  style={{ marginTop: 12, backgroundColor: '#007AFF', padding: 8, borderRadius: 6, alignSelf: 'flex-start', minWidth: 120 }}
                  onPress={() => router.push({ pathname: '/(tabs)/venue-details', params: { id: item.id } })}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text>No trending venues found.</Text>}
      />
    </View>
  );
} 