import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [input, setInput] = useState('');

  const handleLogin = () => {
    if (input.trim()) {
      setUsername(input.trim());
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setUsername('');
    setLoggedIn(false);
    setInput('');
  };

  if (!loggedIn) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 16 }}>Login / Signup</Text>
        <TextInput
          placeholder="Enter username"
          value={input}
          onChangeText={setInput}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, width: 200, marginBottom: 16, borderRadius: 8 }}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Welcome, {username}!</Text>
      <Button title="Logout" onPress={handleLogout} />
      {/* Admin moderation tools will go here in the future */}
    </View>
  );
} 