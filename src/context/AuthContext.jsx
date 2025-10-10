import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import {getDoc ,addDoc ,doc ,collection,setDoc} from "firebase/firestore"
import {db} from '../firebase/config'
import { updateProfile } from 'firebase/auth';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(email, password, name, householdName) {
  try {
     
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    
    await updateProfile(userCredential.user, { displayName: name });
    
    
    const householdRef = await addDoc(collection(db, 'households'), {
      name: householdName || `${name}'s Home`,
      members: [userCredential.user.uid],
      rooms: [],
      createdAt: new Date()
    });
 
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      householdId: householdRef.id,
      createdAt: new Date()
    });

    return {
      ...userCredential.user,
      householdId: householdRef.id
    };
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}






  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists() || !userDoc.data().householdId) {
          
          const householdRef = await addDoc(collection(db, 'households'), {
            name: `${user.displayName || 'My'} Home`,
            members: [user.uid],
            rooms: [],
            createdAt: new Date()
          });

          
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || '',
            email: user.email || '',
            householdId: householdRef.id,
            createdAt: new Date()
          });

          setCurrentUser({
            ...user,
            householdId: householdRef.id
          });
        } else {
          setCurrentUser({
            ...user,
            householdId: userDoc.data().householdId
          });
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        setCurrentUser(user);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  });

  return unsubscribe;
}, []);




  const value = {
    currentUser,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}