import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, FlatList, Image, ScrollView, Dimensions, StyleSheet, Animated } from 'react-native';
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
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH * 0.7;
const CAROUSEL_SIDE_WIDTH = (SCREEN_WIDTH - CAROUSEL_ITEM_WIDTH) / 2;

export default function VenueDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const venueId = Array.isArray(id) ? id[0] : id;
  const venue = venues.find(v => v.id === venueId);
  const venueReviews = venueId && reviews[venueId] ? reviews[venueId] : [];

  // Carousel state
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!venue) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Venue not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header: Venue Name */}
      <Text style={styles.venueName}>{venue.name}</Text>
      {/* Google Maps Link */}
      <TouchableOpacity onPress={() => Linking.openURL(venue.googleMapsUrl)}>
        <Text style={styles.mapsLink}>View on Google Maps</Text>
      </TouchableOpacity>
      {/* Bathroom Sub-scores */}
      <View style={styles.scoresContainer}>
        <Text style={styles.scoreLine}>Privacy: <Text style={styles.scoreValue}>{venue.scores.privacy} ⭐</Text></Text>
        <Text style={styles.scoreLine}>Availability: <Text style={styles.scoreValue}>{venue.scores.availability} ⭐</Text></Text>
        <Text style={styles.scoreLine}>Cleanliness: <Text style={styles.scoreValue}>{venue.scores.cleanliness} ⭐</Text></Text>
        <Text style={styles.scoreLine}>Vibe: <Text style={styles.scoreValue}>{venue.scores.vibe} ⭐</Text></Text>
        <Text style={styles.scoreLine}>Safety & Security: <Text style={styles.scoreValue}>{venue.scores.safety} ⭐</Text></Text>
      </View>
      {/* Photo Carousel */}
      <View style={styles.carouselWrapper}>
        <Animated.FlatList
          data={venue.photos}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CAROUSEL_ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{ paddingHorizontal: CAROUSEL_SIDE_WIDTH }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * CAROUSEL_ITEM_WIDTH,
              index * CAROUSEL_ITEM_WIDTH,
              (index + 1) * CAROUSEL_ITEM_WIDTH,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.85, 1, 0.85],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View style={{
                width: CAROUSEL_ITEM_WIDTH,
                alignItems: 'center',
                transform: [{ scale }],
              }}>
                <Image
                  source={{ uri: item }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              </Animated.View>
            );
          }}
        />
      </View>
      {/* Add Review Button */}
      <TouchableOpacity
        style={styles.addReviewButton}
        onPress={() => router.push({ pathname: '/(tabs)/add-review', params: { id: venue.id } })}
        activeOpacity={0.85}
      >
        <View style={styles.buttonLine} />
        <Text style={styles.addReviewButtonText}>Add review</Text>
      </TouchableOpacity>
      {/* Reviews */}
      <Text style={styles.reviewsHeader}>Reviews</Text>
      <FlatList
        data={venueReviews.sort((a, b) => b.timestamp.localeCompare(a.timestamp))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={{ fontWeight: 'bold' }}>{item.username} ({item.rating} ⭐)</Text>
            <Text style={{ color: '#888', fontSize: 12 }}>{item.timestamp}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginLeft: 16 }}>No reviews yet.</Text>}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  venueName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 4,
  },
  mapsLink: {
    color: '#1976D2',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 18,
    fontSize: 16,
  },
  scoresContainer: {
    marginBottom: 18,
    paddingHorizontal: 24,
  },
  scoreLine: {
    fontSize: 18,
    marginBottom: 4,
    textAlign: 'left',
  },
  scoreValue: {
    fontWeight: 'bold',
  },
  carouselWrapper: {
    marginBottom: 24,
    alignItems: 'center',
  },
  carouselImage: {
    width: CAROUSEL_ITEM_WIDTH - 16,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#eee',
  },
  addReviewButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 48,
    marginBottom: 24,
    marginTop: 8,
    height: 56,
    position: 'relative',
    overflow: 'hidden',
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 2,
  },
  buttonLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#fff',
    opacity: 0.7,
    zIndex: 1,
  },
  reviewsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
  },
  reviewCard: {
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fafafa',
  },
}); 