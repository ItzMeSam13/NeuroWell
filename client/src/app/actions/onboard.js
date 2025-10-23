// app/lib/onboard.js
"use server"
import { db } from './firebase'; // Adjust the import path to your Firebase config
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getUser } from './getUser';

/**
 * Creates or updates user profile in Firestore with onboarding form data
 * @param {Object} formData - The form data from the mental health assessment
 * @returns {Promise<Object>} - Returns success status and user ID or error
 */
export async function onboardUser(formData) {
  try {
    // Get the current authenticated user
    const user = await getUser();
    
    if (!user || !user.uid) {
      throw new Error('User not authenticated');
    }

    const uid = user.uid;

    // Prepare user data with null defaults for optional fields
    const userData = {
      // Required fields
      name: formData.name || '',
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || '',
      occupation: formData.occupation || '',
      workspace: formData.workspace || '',
      sleepHabits: formData.sleepHabits || '',
      physicalActivities: formData.physicalActivities || '',
      
      // Optional fields (null by default)
      screenTime: formData.screenTime || null,
      hasMentalIssue: formData.hasMentalIssue || null,
      mentalIssueDetails: formData.mentalIssueDetails || null,
      
      // Metadata
      onboardingCompleted: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Create/update user document in Firestore
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, userData, { merge: true });

    return {
      success: true,
      userId: uid,
      message: 'User onboarding completed successfully'
    };

  } catch (error) {
    console.error('Error onboarding user:', error);
    return {
      success: false,
      error: error.message || 'Failed to complete onboarding'
    };
  }
}

/**
 * Check if user has completed onboarding
 * @returns {Promise<boolean>} - Returns true if onboarding is completed
 */
export async function hasCompletedOnboarding() {
  try {
    const user = await getUser();
    
    if (!user || !user.uid) {
      return false;
    }

    const { doc: getDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().onboardingCompleted === true;
    }

    return false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}