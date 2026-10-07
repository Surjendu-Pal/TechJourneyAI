import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';
import { auth } from './config';
import { UserProfile, AdminRole } from '../types';
import { getUserProfile, saveUserProfile, logSystemActivity, getUserRole, setUserRole } from './firestoreService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  role: AdminRole;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfileState: (updated: Partial<UserProfile>) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AdminRole>('USER');
  const [loading, setLoading] = useState(true);

  // Check if current user is admin based on verified email from system prompt or role
  const isSuperAdmin = !!(user && (user.email === 'enginnerboy079@gmail.com' || role === 'SUPER_ADMIN'));
  const isAdmin = isSuperAdmin || role === 'ADMIN';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          let assignedRole: AdminRole = 'USER';
          if (currentUser.email === 'enginnerboy079@gmail.com') {
            assignedRole = 'SUPER_ADMIN';
            await setUserRole(currentUser.uid, 'SUPER_ADMIN', 'system_root').catch(() => {});
          } else {
            assignedRole = await getUserRole(currentUser.uid);
          }
          setRole(assignedRole);

          if (userProfile) {
            setProfile({ ...userProfile, role: assignedRole });
          } else {
            // New user initial shell profile
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || 'Learner',
              email: currentUser.email || 'learner@techjourney.ai',
              educationLevel: 'Self-taught / University',
              programmingExperience: 'Beginner',
              preferredLanguage: 'JavaScript',
              careerGoal: 'Full-Stack Software Engineer',
              dailyAvailableTime: '1 hour',
              dailyPreferredStudyTime: 'Morning',
              dsaLevel: 'Absolute Beginner',
              devLevel: 'Beginner',
              targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              preferredLearningStyle: 'Hands-on Coding',
              streak: 1,
              longestStreak: 1,
              lastActiveDate: new Date().toISOString().split('T')[0],
              totalStudyMinutes: 0,
              xp: 120,
              level: 1,
              levelTitle: 'Code Starter',
              battleRating: 1200,
              skills: ['JavaScript Basics', 'Algorithms Foundation'],
              completedLessonsCount: 0,
              completedProjectsCount: 0,
              college: 'Tech University',
              country: 'India',
              lastActiveLesson: {
                topicId: 'arrays',
                topicTitle: 'Arrays & Dynamic Arrays',
                step: 1,
                totalSteps: 11,
              },
              notificationPreferences: {
                morning: true,
                evening: true,
                battles: true,
                opportunities: true,
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await saveUserProfile(newProfile);
            setProfile(newProfile);
            logSystemActivity('New User Registered', 'success', `Created profile for ${newProfile.email}`, currentUser.uid);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      logSystemActivity('Google Sign In', 'success', `User signed in: ${result.user.email}`, result.user.uid);
    } catch (error) {
      console.error('Sign in error:', error);
      logSystemActivity('Sign In Failed', 'error', String(error));
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      logSystemActivity('Guest Sign In', 'success', `Guest session: ${result.user.uid}`, result.user.uid);
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      logSystemActivity('Guest Sign In Failed', 'error', String(error));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setProfile(null);
      logSystemActivity('Sign Out', 'success', 'User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfileState = async (updated: Partial<UserProfile>) => {
    if (!profile || !user) return;
    const merged: UserProfile = { ...profile, ...updated, updatedAt: new Date().toISOString() };
    setProfile(merged);
    await saveUserProfile(merged);
  };

  const reloadProfile = async () => {
    if (!user) return;
    const p = await getUserProfile(user.uid);
    if (p) setProfile(p);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        role,
        isAdmin,
        isSuperAdmin,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        updateProfileState,
        reloadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
