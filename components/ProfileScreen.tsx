import { getUserInformation } from '@/services/appwrite';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileScreenProps {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
}

const initUserData: userInfomationLogin = {
    username: '',
    email: '',
}

const ProfileScreen = ({ isLogin, setIsLogin, username }: ProfileScreenProps) => {
    const [userData, setUserData] = useState<userInfomationLogin>(initUserData);
    const [savedMovies, setSavedMovies] = useState<savedMovie[]>([])

    useEffect(() => {
        // Create an internal async function
        const fetchUserData = async () => {
            if (isLogin && username) {
                try {
                    const result = await getUserInformation(username);
                    setUserData(result as userInfomationLogin); // Save it to state to use in your UI
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };

        fetchUserData();
    }, [isLogin, username]); // Run when login status or username changes

    console.log('userData', userData?.email, userData?.username)

    const styles = StyleSheet.create({
        avatar: {
            width: 120,
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            borderWidth: 3,
            borderColor: '#AB8BFF',
        },
        align: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        favoriteMovies: {
            width: "100%",
            height: 120,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: "#1A1A24",
        },
        logout: {
            width: "100%",
            height: 70, // 80 might be a bit tall, 60 is standard
            alignItems: 'flex-start',
            justifyContent: 'center',
            borderRadius: 999,
            backgroundColor: "#1A1A24",
            marginTop: 28, // Add bottom margin instead of top
        },
        text: {
            fontSize: 18,
            color: 'blue',
        },
    });

    return (
        <View>
            <View className='items-center mt-20'>
                <View style={styles.avatar}>
                    <View
                        style={{
                            width: 110,
                            height: 110,
                            backgroundColor: "white",
                            borderRadius: 999,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <Ionicons name="person" size={60} color="black" />
                    </View>
                </View>
                <View style={styles.align} className='my-5'>
                    <Text className='text-white font-bold text-4xl'>{userData?.username}</Text>
                    <Text className='text-neutral-400 font-base text-lg mt-2'>{userData?.email}</Text>
                </View>
                <View style={styles.favoriteMovies}>
                    <Text style={{ fontSize: 48, color: "#AB8BFF" }}>{savedMovies.length ?? 0}</Text>
                    <Text className='text-neutral-400 font-bold text-xl'>SAVED</Text>
                </View>
                <TouchableOpacity style={styles.logout} onPress={() => {
                    setUserData(initUserData)
                    setIsLogin(false)
                }}>
                    <View style={{ flexDirection: "row", marginLeft: 24, }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            backgroundColor: "#262633",
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: "center"
                        }}>
                            <Ionicons name='log-out-outline' size={40} color={'#FF5C5C'} style={{marginLeft: 8}} />
                        </View>
                        <View style={{ flexDirection: "column", marginLeft: 16 }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, color: "#FF5C5C" }}>Logout</Text>
                            <Text className='text-neutral-400'>Sign out of your account</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default ProfileScreen