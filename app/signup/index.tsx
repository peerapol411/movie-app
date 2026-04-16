import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const index = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    return (
        <View className='bg-primary flex-1 px-10'>
            <View className='mt-20 gap-2'>
                <Text className='text-white text-4xl font-bold'>Join The</Text>
                <Text className='text-white text-4xl font-bold'>Community</Text>
            </View>
            <View className='mt-5'>
                <Text className='text-light-200 text-base'>
                    Discover your favorite movies, explore trending content, and save films for later. Join our community of movie enthusiasts.
                </Text>
            </View>
            <View className='mt-10 gap-5'>
                <View className='relative h-14'>
                    <View className='absolute left-4 h-14 justify-center z-10'>
                        <Ionicons name="person" size={20} color="black" />
                    </View>
                    <TextInput
                        placeholder='Username'
                        placeholderTextColor={'#999'}
                        className='bg-white rounded-full px-4 py-2 w-full h-14 pl-12 pr-12'
                    />
                </View>
                <View className='relative h-14'>
                    <View className='absolute left-4 h-14 justify-center z-10'>
                        <Ionicons name="mail" size={20} color="black" />
                    </View>
                    <TextInput
                        placeholder='Email'
                        placeholderTextColor={'#999'}
                        className='bg-white rounded-full px-4 py-2 w-full h-14 pl-12 pr-12'
                    />
                </View>
                <View className='relative h-14'>
                    <View className='absolute left-4 h-14 justify-center z-10'>
                        <Ionicons name="lock-closed" size={20} color="black" />
                    </View>
                    <TextInput
                        placeholder='Password'
                        placeholderTextColor={'#999'}
                        className='bg-white rounded-full px-4 py-2 w-full h-14 pl-12 pr-12'
                        secureTextEntry={!showPassword}
                        onChange={() => setShowPassword(false)}
                    />
                    <TouchableOpacity
                        className='absolute right-4 h-14 justify-center z-10'
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye" : "eye-off"}
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className='rounded-full h-14 w-full justify-center items-center bg-accent flex-row gap-2'>
                    <Text className='text-black font-bold text-xl'>Sign Up</Text>
                    <Ionicons name="arrow-forward" size={20} color="black" />
                </TouchableOpacity>
                <View className='flex-row items-center my-5'>
                    <View className='flex-1 h-px bg-gray-400' />
                    <Text className='mx-3 text-light-300 text-sm'>
                        OR CONTINUE WITH
                    </Text>
                    <View className='flex-1 h-px bg-gray-300' />
                </View>
                <TouchableOpacity className='bg-white rounded-full py-1 mb-5 items-center justify-center flex-row gap-2'>
                    <Image source={icons.google} className='size-12' />
                    <Text className='color-primary font-base text-xl'>
                        Login with Google
                    </Text>
                </TouchableOpacity>
                <Text className='text-light-200 text-center'>
                    Already have an account?
                    <Text
                        className='color-accent'
                        onPress={() => router.back()}
                    >
                        {' '}Log In
                    </Text>
                </Text>
            </View>
        </View>
    )
}

export default index