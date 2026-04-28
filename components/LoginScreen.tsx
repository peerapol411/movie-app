import { icons } from '@/constants/icons'
import { loginWithUsername } from '@/services/appwrite'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'


interface LoginScreenProps {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    usernameCallback: (username: string) => void 
}

const initUserLogin: userLogin = {
    username: '',
    password: '',
}

const LoginScreen = ({ setIsLogin, usernameCallback }: LoginScreenProps) => {
    const [userLogin, setUserLogin] = React.useState<userLogin>(initUserLogin);
    const [showPassword, setShowPassword] = React.useState(false)

    const handleLogin = async () => {
        try {
            const result = await loginWithUsername(userLogin);
            if (result === "OK") {
                usernameCallback(userLogin.username);
                setIsLogin(true);
            } else {
                alert(result);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    return (
        <View>
            <View className='items-center mt-20'>
                <Image source={icons.logo} className='size-15' />
                <Text className='color-accent font-bold text-4xl mt-10'>
                    Movies App
                </Text>
                <Text className='text-light-200 font-base text-xl mt-2'>
                    Welcome
                </Text>
            </View>
            <View className='mt-20'>
                <View className='relative h-14'>
                    <View className='absolute left-4 h-14 justify-center z-10'>
                        <Ionicons name="person" size={20} color="black" />
                    </View>
                    <TextInput
                        placeholder='Username'
                        placeholderTextColor={'#999'}
                        className='bg-white rounded-lg px-4 py-2 w-full h-14 pl-12 pr-12'
                        onChangeText={(text) => {
                            setUserLogin((prev) => {
                                return {
                                    ...prev,
                                    username: text,
                                }
                            })
                        }}
                    />
                </View>
                <View className='mt-4'>
                    <View className='relative h-14'>
                        <View className='absolute left-4 h-14 justify-center z-10'>
                            <Ionicons name="lock-closed" size={20} color="black" />
                        </View>
                        <TextInput
                            placeholder='Password'
                            placeholderTextColor={'#999'}
                            className='bg-white rounded-lg px-4 py-2 w-full h-14 pl-12 pr-12'
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => {
                                setUserLogin((prev) => {
                                    return {
                                        ...prev,
                                        password: text,
                                    }
                                })
                            }}
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
                </View>
            </View>
            <TouchableOpacity
                className='bg-accent rounded-lg py-3 mt-5 items-center justify-center flex-row gap-2'
                onPress={handleLogin}
            >
                <Text className='color-primary font-bold text-xl'>
                    Login
                </Text>
                <Ionicons name="arrow-forward" size={20} color="black" />
            </TouchableOpacity>
            <View className='flex-row items-center my-10'>
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
                Don't have an account?
                <Text
                    className='color-accent'
                    onPress={() => router.push('/signup')}
                >
                    {' '}Sign Up
                </Text>
            </Text>
        </View>
    )
}

export default LoginScreen