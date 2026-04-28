import LoginScreen from '@/components/LoginScreen';
import ProfileScreen from '@/components/ProfileScreen';
import React, { useState } from 'react';
import { View } from 'react-native';
const profile = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  return (
    <View className='bg-primary flex-1 px-10'>
      {!isLogin && <LoginScreen usernameCallback={(value) => setUserName(value)} setIsLogin={setIsLogin} />}
      {isLogin && <ProfileScreen username={userName} setIsLogin={setIsLogin} isLogin={isLogin} />}
    </View>
  )
}

export default profile