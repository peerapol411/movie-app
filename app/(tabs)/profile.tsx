import LoginScreen from '@/components/LoginScreen';
import ProfileScreen from '@/components/ProfileScreen';
import React, { useState } from 'react';
import { View } from 'react-native';
const profile = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <View className='bg-primary flex-1 px-10'>
      { !isLogin && <LoginScreen setIsLogin={setIsLogin} />}
      { isLogin && <ProfileScreen />}
    </View>
  )
}

export default profile