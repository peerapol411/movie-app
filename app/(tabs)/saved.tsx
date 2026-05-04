import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { getSavedMovies } from '@/services/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const saved = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([])

  useFocusEffect(
    useCallback(() => {
      const checkAuthAndFetch = async () => {
        const userSession = await AsyncStorage.getItem('user_session');

        if (!userSession) {
          setIsLogin(false);
          setSavedMovies([]);
          return;
        }

        const parsedData = JSON.parse(userSession);
        
        if (parsedData?.username) {
          setIsLogin(true);
          
          try {
            const response = await getSavedMovies(parsedData.username);
            const result: SavedMovie[] = response?.map((v) => ({
              movie_id: v.movie_id,
              title: v.title,
              poster_url: v.poster_url,
              total: response.length,
            })) ?? [];
            setSavedMovies(result);
          } catch (error) {
            console.error('Failed to fetch movies:', error);
          }
        }
      };

      checkAuthAndFetch();
    }, [])
  );

  return (
    isLogin ? (

      <View className='bg-primary flex-1'>
        <Image source={images.bg} className='absolute w-full z-0' resizeMode='cover' />
        <View className='flex justify-center items-start flex-1 flex-col gap- mt-20'>
          <Text className="text-lg text-white font-bold my-5">Lastest Saved Movies</Text>
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => (<Link href={`/movie/${item.movie_id}`} asChild>
              <TouchableOpacity className="w-[30%]">
                <Image source={{
                  uri: item.poster_url
                    ? `https://image.tmdb.org/t/p/w500${item.poster_url}`
                    : 'https://placehold.co600x400/1a1a1a/ffffff.png'
                }}
                  className='w-full h-52 rounded-lg'
                  resizeMode='cover'
                />
                <Text className='text-sm font-bold text-white' numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Link>)}
            keyExtractor={(item) => item.movie_id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              paddingBottom: 10,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        </View>
      </View>
    ) : (
      <View className='bg-primary flex-1 px-10'>
        <View className='flex justify-center items-center flex-1 flex-col gap-5'>
          <Image source={icons.save} className='size-10' tintColor={'#Fff'} />
          <Text className='text-gray-500 font-base'>Please log in to view saved movies</Text>
        </View>
      </View>
    ))
}

export default saved