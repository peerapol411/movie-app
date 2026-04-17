import { Account, Client, Databases, ID, Query } from 'react-native-appwrite';
// track the search made by user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const COLLECTION_USERS_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_USERS_ID!;

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
                count: existingMovie.count + 1,
            });
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie?.id,
                count: 1,
                title: movie?.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
        throw error;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return undefined;
    }
}

export const saveUserRegister = async (username: string, email: string, password: string) => {
    try {
        const account = new Account(client);

        const resultDuplicateUsername = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('username', username)
        ]);
        const resultDuplicateEmail = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('email', email)
        ]);

        if (resultDuplicateUsername.documents.length > 0) {
            return 'Error:DuplicatedUsername'
        } else if (resultDuplicateEmail.documents.length > 0) {
            return 'Error:DuplicatedEmail'
        }

        const response = await account.create(
            ID.unique(),
            username,
            email,
            password,
        );

        return response.$id

    } catch (error) {
        console.log('Error registered: ', error);
        throw error;
    }
}