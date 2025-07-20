import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Simple star rating component (half-stars allowed)
function StarRating({ rating, setRating }: { rating: number; setRating: (r: number) => void }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isHalf = rating + 0.5 === i;
    stars.push(
      <Text
        key={i}
        style={{ fontSize: 32, color: i <= rating ? '#FFD700' : '#ccc', marginRight: 4 }}
        onPress={() => setRating(isHalf ? i - 0.5 : i)}
      >
        {i <= rating ? '★' : isHalf ? '⯨' : '☆'}
      </Text>
    );
  }
  return <View style={{ flexDirection: 'row', marginBottom: 16 }}>{stars}</View>;
}

export default function AddReviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null); // Mock photo upload for MVP

  const handleSubmit = () => {
    if (!rating || !text.trim()) {
      Alert.alert('Please provide a rating and review text.');
      return;
    }
    // For MVP, just show a confirmation and go back
    Alert.alert('Review submitted!', 'Your review has been submitted for approval.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Add Review</Text>
      <Text style={{ marginBottom: 8 }}>Your Rating:</Text>
      <StarRating rating={rating} setRating={setRating} />
      <TextInput
        placeholder="Write your review..."
        value={text}
        onChangeText={setText}
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, minHeight: 80, marginBottom: 16 }}
      />
      {/* Mock photo upload button for MVP */}
      <Button title="Upload Photo (MVP: not implemented)" onPress={() => Alert.alert('Photo upload coming soon!')} />
      <View style={{ height: 16 }} />
      <Button title="Submit Review" onPress={handleSubmit} />
    </View>
  );
} 