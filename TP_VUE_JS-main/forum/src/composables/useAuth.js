import { ref, onMounted } from 'vue';
import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Global state (persists across components)
const user = ref(null);
const userProfile = ref(null);

export function useAuth() {
  
  // 1. Sign Up Logic
  const signup = async (email, password, name) => {
    // Create Auth User
    const res = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update basic display name in Auth
    await updateProfile(res.user, { displayName: name });
    
    // Create detailed profile in Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      name: name,
      email: email,
      role: 'user', // Default role
      createdAt: new Date()
    });
    
    user.value = res.user;
  };

  // 2. Login Logic
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    user.value = res.user;
  };

  // 3. Logout Logic
  const logout = async () => {
    await signOut(auth);
    user.value = null;
    userProfile.value = null;
  };

  // 4. Auto-detect User State (Run once on app start)
  onMounted(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser;
      
      if (currentUser) {
        // Fetch extra profile data from Firestore (like role)
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          userProfile.value = docSnap.data();
        }
      } else {
        userProfile.value = null;
      }
    });
  });

  return { user, userProfile, signup, login, logout };
}