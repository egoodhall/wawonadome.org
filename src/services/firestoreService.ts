import { 
  collection, 
  doc, 
  getDoc,
  getDocs,
  query,
  where 
} from 'firebase/firestore';
import { firestore } from '../firebase/config';

export interface UserLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isShared?: boolean;
}

export interface UserProfile {
  displayName: string;
  email: string;
  links: Record<string, string>;
}

// Name of the special user that holds shared links
const SHARED_USER = "Wassociates";

/**
 * Checks if a user is an administrator
 */
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(firestore, 'admin', 'administrators'));
    if (!adminDoc.exists()) return false;
    
    const adminData = adminDoc.data();
    return Array.isArray(adminData.administrators) && adminData.administrators.includes(email);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Gets icon name for a given link title
 */
export async function getLinkIcon(title: string): Promise<string | null> {
  try {
    const iconsDoc = await getDoc(doc(firestore, 'admin', 'icons'));
    if (!iconsDoc.exists()) return null;
    
    const iconsData = iconsDoc.data();
    return iconsData[title] || null;
  } catch (error) {
    console.error('Error fetching icon:', error);
    return null;
  }
}

/**
 * Fetches shared links available to all members from the Wassociates user
 */
export async function getSharedLinks(): Promise<UserLink[]> {
  try {
    const membersCollection = collection(firestore, 'members');
    const membersSnapshot = await getDocs(membersCollection);
    
    let sharedLinks: UserLink[] = [];
    
    // Find the Wassociates user and extract shared links
    for (const memberDoc of membersSnapshot.docs) {
      if (memberDoc.id === SHARED_USER) {
        const memberData = memberDoc.data() as UserProfile;
        
        if (memberData.links) {
          sharedLinks = await Promise.all(
            Object.entries(memberData.links).map(async ([title, url]) => {
              // Fetch icon if available
              const icon = await getLinkIcon(title);
              
              return {
                id: `shared-${title}`, // Adding prefix to avoid ID collisions
                title,
                url,
                icon: icon || undefined,
                isShared: true
              };
            })
          );
        }
        break;
      }
    }
    
    return sharedLinks;
  } catch (error) {
    console.error('Error fetching shared links:', error);
    return [];
  }
}

/**
 * Fetches links associated with a specific user
 */
export async function getUserLinks(email: string): Promise<UserLink[]> {
  try {
    // Get all members to find the one with matching email
    const membersCollection = collection(firestore, 'members');
    const membersSnapshot = await getDocs(membersCollection);
    
    let userLinks: UserLink[] = [];
    let userDisplayName = '';
    
    // Loop through all members to find the one with the matching email
    for (const memberDoc of membersSnapshot.docs) {
      const memberData = memberDoc.data() as UserProfile;
      
      if (memberData.email === email) {
        userDisplayName = memberData.displayName;
        
        // Convert links object to array
        if (memberData.links) {
          userLinks = await Promise.all(
            Object.entries(memberData.links).map(async ([title, url]) => {
              // Fetch icon if available
              const icon = await getLinkIcon(title);
              
              return {
                id: title, // Using title as ID since we don't have explicit IDs
                title,
                url,
                icon: icon || undefined,
                isShared: false
              };
            })
          );
        }
        break; // Found the user, no need to continue
      }
    }
    
    // Fetch shared links available to all members
    const sharedLinks = await getSharedLinks();
    
    // Combine user-specific links with shared links
    return [...userLinks, ...sharedLinks];
  } catch (error) {
    console.error('Error fetching user links:', error);
    return [];
  }
}

/**
 * Fetches user profile data from Firestore
 */
export async function getUserProfile(email: string): Promise<UserProfile | null> {
  try {
    // Get all members to find the one with matching email
    const membersCollection = collection(firestore, 'members');
    const membersSnapshot = await getDocs(membersCollection);
    
    // Loop through all members to find the one with the matching email
    for (const memberDoc of membersSnapshot.docs) {
      const memberData = memberDoc.data() as UserProfile;
      
      if (memberData.email === email) {
        return {
          displayName: memberData.displayName,
          email: memberData.email,
          links: memberData.links || {}
        };
      }
    }
    
    console.log('No user profile found for this email');
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
} 
