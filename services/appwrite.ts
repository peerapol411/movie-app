import CryptoJS from 'crypto-js';
import { Client, Databases, ID, Permission, Query, Role } from 'react-native-appwrite';
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

export const getUserInformation = async (username: string): Promise<userInfomationLogin | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_USERS_ID, [
            Query.equal('username', username)
        ]);

        // 1. Check if we actually found a user
        if (result.documents.length === 0) {
            console.log('No user found for username:', username);
            return undefined;
        }

        // 2. Return the FIRST document in the array
        // We cast it to 'any' then to your type to satisfy TypeScript
        return result.documents[0] as unknown as userInfomationLogin;

    } catch (error) {
        console.log('Error get user information: ', error);
        return undefined;
    }
}

export const saveUserRegister = async (register: userInfo) => {
    try {
        if (!register.password || typeof register.password !== 'string') {
            return 'Error:InvalidPassword';
        }
        if (!register.email || typeof register.email !== 'string') {
            return 'Error:InvalidEmail';
        }
        if (!register.username || typeof register.username !== 'string') {
            return 'Error:InvalidUsername';
        }

        const resultDuplicateUsername = await database.listDocuments(DATABASE_ID, COLLECTION_USERS_ID, [
            Query.equal('username', register.username)
        ]);
        const resultDuplicateEmail = await database.listDocuments(DATABASE_ID, COLLECTION_USERS_ID, [
            Query.equal('email', register.email.toLocaleLowerCase())
        ]);

        if (resultDuplicateUsername.documents.length > 0) {
            return 'Error:DuplicatedUsername'
        } else if (resultDuplicateEmail.documents.length > 0) {
            return 'Error:DuplicatedEmail'
        }

        const hashedPassword = CryptoJS.SHA256(register.password).toString();

        const response = await database.createDocument(
            DATABASE_ID,
            COLLECTION_USERS_ID,
            ID.unique(),
            {
                username: register.username,
                email: register.email.toLocaleLowerCase(),
                password_hash: hashedPassword,
            },
            [
                Permission.write(Role.any()),
            ]
        );

        return response.$id

    } catch (error) {
        console.log('Error registered: ', error);
        throw error;
    }
}

export const loginWithUsername = async (userLogin: userLogin): Promise<userInfomationLogin | string> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_USERS_ID, [
            Query.equal('username', userLogin.username)
        ]);
        if (result.documents.length > 0) {
            const hashPasswordLogin = CryptoJS.SHA256(userLogin.password).toString();
            if (hashPasswordLogin === result.documents[0].password_hash) {
                return "OK"
            } else {
                return "Error: Invalid password"
            }
        } else {
            return "Error: Invalid username"
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return "Error: Database disconnected!";
    }
}