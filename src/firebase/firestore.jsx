import { db } from './config';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  arrayUnion,
  onSnapshot,
  arrayRemove 
} from 'firebase/firestore';

 
export async function createHousehold(userId, name) {
  if (!userId) throw new Error('User ID is required');
  
  const householdRef = await addDoc(collection(db, 'households'), {
    name: name || 'My Home',
    members: [userId],
    rooms: [],
    createdAt: new Date()
  });

  await setDoc(doc(db, 'users', userId), {
    householdId: householdRef.id
  }, { merge: true }); // Merge with existing document

  return householdRef.id;
}

export async function createRoom(householdId, roomName) {
  if (!householdId) throw new Error('Household ID is required');
  if (!roomName?.trim()) throw new Error('Room name is required');

  // Verify household exists
  const householdRef = doc(db, 'households', householdId);
  const householdSnap = await getDoc(householdRef);
  
  if (!householdSnap.exists()) {
    throw new Error('Household not found');
  }

  const roomRef = await addDoc(collection(db, 'rooms'), {
    name: roomName.trim(),
    householdId,
    devices: [],
    createdAt: new Date()
  });

  await updateDoc(householdRef, {
    rooms: arrayUnion(roomRef.id)
  });

  return roomRef.id;
}











export function getRooms(householdId, callback) {
  const q = query(collection(db, 'rooms'), where('householdId', '==', householdId));
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(rooms);
  });
}

// Device operations
export async function addDevice(roomId, deviceData) {
  const deviceRef = await addDoc(collection(db, 'devices'), {
    ...deviceData,
    roomId,
    status: false,
    createdAt: new Date()
  });
  
  await updateDoc(doc(db, 'rooms', roomId), {
    devices: arrayUnion(deviceRef.id)
  });
  
  return deviceRef.id;
}

export function getDevices(roomId, callback) {
  const q = query(collection(db, 'devices'), where('roomId', '==', roomId));
  return onSnapshot(q, (snapshot) => {
    const devices = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(devices);
  });
}

export async function updateDevice(deviceId, updates) {
  await updateDoc(doc(db, 'devices', deviceId), updates);
}

export async function deleteDevice(deviceId, roomId) {
  // Remove device from room's devices array
  const roomRef = doc(db, 'rooms', roomId);
  await updateDoc(roomRef, {
    devices: arrayRemove(deviceId)
  });
  
  // Delete the device document
  await deleteDoc(doc(db, 'devices', deviceId));
}

 