import { icons } from '@/constants/icons'
import { fetchMovieDetails } from '@/services/api'
import { getSavedMovies, saveFavoriteMovies } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface MovieInfoProps {
  label: string;
  value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className='flex-col items-start justify-center mt-5'>
      <Text className='text-light-200 font-normal text-sm'>{label}</Text>
      <Text className='text-light-100 font-bold text-sm mt-2'>{value ?? 'N/A'}</Text>
    </View>
  )
}

const MovieDetails = () => {
  const { id } = useLocalSearchParams()
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  const [userInfo, setUserInfo] = useState<{
    username: string,
    isLoggedIn: boolean,
    loginDate: Date | null
  }>({
    username: '',
    isLoggedIn: false,
    loginDate: null,
  });

  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([])

  useEffect(() => {
    // Create an internal async function
    const fetchUserData = async () => {
      const userSession = await AsyncStorage.getItem('user_session');
      if (userSession) {
        const parsedData = JSON.parse(userSession ?? '');
        setUserInfo({ username: parsedData.username, isLoggedIn: parsedData.isLoggedIn, loginDate: parsedData.loginDate })
      }
    };

    fetchUserData();
  }, []);

  const handleSavedMovies = async () => {
    const response = await getSavedMovies(userInfo.username);
    const result: SavedMovie[] = response?.map((v) => {
      return { movie_id: v.movie_id, title: v.title, poster_url: v.poster_url, total: response.length } as SavedMovie
    }) ?? [];
    setSavedMovies(result ?? [])
  }

  useFocusEffect(
    useCallback(() => {
      const fetchMovies = async () => {
        if (userInfo?.username) {
          handleSavedMovies();
        }
      };

      fetchMovies();
    }, [userInfo.username])
  );

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            className='w-full h-[550px]'
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
            }}
            resizeMode='stretch' />
        </View>
        <View className='flex-col items-start justify-center mt-5 px-5'>
          <View style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
            {userInfo.isLoggedIn && !loading &&
              <Ionicons name={savedMovies?.some((v) => v.movie_id.toString() === id) ? 'bookmark' : 'bookmark-outline'}
                color={'#AB8BFF'}
                size={30}
                onPress={async () => {
                  const result = await saveFavoriteMovies({
                    movie_id: movie?.id,
                    title: movie?.title,
                    poster_url: movie?.poster_path
                  } as SavedMovie);
                  
                  handleSavedMovies();
                }}
              />}
          </View>
          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light-200 text-sm'>
              {movie?.release_date?.split('-')[0]}
            </Text>
            <Text className='text-light-200 text-sm'>
              {movie?.runtime}m
            </Text>
          </View>
          <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
            <Image source={icons.star} className='size-4' />
            <Text className='text-white font-bold text-sm'>
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className='text-light-200 text-sm'>({movie?.vote_count} votes)</Text>
          </View>
          <MovieInfo label='Overview' value={movie?.overview ?? ''} />
          <MovieInfo
            label='Genres'
            value={movie?.genres.map((g) => g.name).join(' - ') ?? 'N/A'}
          />
          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo
              label='Budget'
              value={movie?.budget ? `$${movie?.budget}` : 'N/A'}
            />
            <MovieInfo
              label='Revenue'
              value={movie?.revenue ? `$${Math.round(movie?.revenue ?? 0)}` : 'N/A'} />
          </View>
          <MovieInfo
            label='Production Companies'
            value={movie?.production_companies.map((company) => company.name).join(' - ') ?? 'N/A'} />
        </View>
      </ScrollView>
      <TouchableOpacity
        className='h-12 absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3/5 flex flex-row items-center justify-center z-50'
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className='size-5 mr-1 mt-0.5 rotate-180'
          tintColor={'#fff'} />
        <Text className='text-white font-semibold text-base'>Go back</Text>
      </TouchableOpacity>
    </View >
  )
}

export default MovieDetails