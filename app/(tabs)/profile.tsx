import LoginScreen from '@/components/LoginScreen'
import React from 'react'
import { View } from 'react-native'

const profile = () => {
  return (
    <View className='bg-primary flex-1 px-10'>
      <LoginScreen isLogin={false} />
    </View>
  )
}

export default profile