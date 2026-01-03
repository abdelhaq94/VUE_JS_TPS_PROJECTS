import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref } from 'vue';

export function useFirestore() {
  
  // Add any document to any collection
  const addDocument = async (colName, data) => {
    return await addDoc(collection(db, colName), {
      ...data,
      createdAt: serverTimestamp()
    });
  };

  // Get all discussions (with optional category filter)
  const getDiscussions = async (category = null) => {
    let q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'));
    
    if (category && category !== 'All') {
       q = query(collection(db, 'discussions'), where('category', '==', category));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  // Get a single discussion by ID
  const getDiscussionById = async (id) => {
    const docRef = doc(db, 'discussions', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  };

  return { addDocument, getDiscussions, getDiscussionById };
}