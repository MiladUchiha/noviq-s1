import { hash } from 'bcryptjs';
import supabase from './supabase';

/**
 * Register a new user with email and password
 */
export async function registerUser({ name, email, password, idea }) {
  try {
    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (existingUserError && existingUserError.code !== 'PGRST116') {
      // PGRST116 is the error code for "no rows found" which is expected when user doesn't exist
      console.error('Error checking for existing user:', existingUserError);
      return { success: false, error: `Error checking user: ${existingUserError.message}` };
    }
    
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Insert the new user with idea if provided
    const userData = { 
      name, 
      email, 
      password: hashedPassword,
      auth_provider: 'credentials'
    };
    
    // Add idea if provided
    if (idea) {
      userData.idea = idea;
    }
    
    // Insert the user with or without idea
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
      
    if (error) {
      // Log the specific error for debugging
      console.error('Error inserting user:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to register user. Please try again.' 
      };
    }
    
    if (!data) {
      return { 
        success: false, 
        error: 'User was created but no data was returned. Please try logging in.' 
      };
    }
    
    return { success: true, data };
  } catch (error) {
    // Improved error logging
    console.error('Unhandled error in registerUser:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred during registration' 
    };
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId) {
  try {
    if (!userId) {
      console.error('Missing user ID in getUserProfile');
      return null;
    }
    
    console.log(`Fetching profile for user: ${userId}`);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, idea, created_at, updated_at')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error(`Error getting user profile: ${error.message}`);
      
      // Handle invalid UUID format similar to updateUserIdea
      if (error.message.includes('invalid input syntax for type uuid')) {
        console.log('Attempting to find user by email due to invalid UUID error');
        
        try {
          // First, let's get the session to find the email
          const { data: sessionData } = await supabase.auth.getSession();
          const email = sessionData?.session?.user?.email;
          
          if (email) {
            console.log(`Found email in session: ${email}, looking up user by email`);
            const { data: userByEmail, error: emailLookupError } = await supabase
              .from('users')
              .select('id, name, email, idea, created_at, updated_at')
              .eq('email', email)
              .single();
            
            if (emailLookupError) {
              console.error(`Error finding user by email: ${emailLookupError.message}`);
              return null;
            }
            
            if (userByEmail) {
              console.log(`Found user by email with ID: ${userByEmail.id}`);
              return userByEmail;
            }
          }
        } catch (alternativeError) {
          console.error('Error in alternative user lookup:', alternativeError);
        }
      }
      
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getUserProfile: ${error.message}`);
    return null;
  }
}

/**
 * Update user's idea by ID
 */
export async function updateUserIdea(userId, idea) {
  try {
    if (!userId) {
      return { success: false, error: 'Missing user ID' };
    }
    
    if (!idea) {
      return { success: false, error: 'Missing idea content' };
    }
    
    console.log(`Attempting to update idea for user: ${userId}`);
    
    // Validate user exists before updating
    const { data: userExists, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (checkError) {
      console.error(`Error validating user existence: ${checkError.message}`);
      
      // If the error is about invalid UUID, let's try to find the user by email instead
      if (checkError.message.includes('invalid input syntax for type uuid')) {
        console.log('Attempting to find user by different means due to invalid UUID error');
        
        try {
          // First, let's get the session to find the email
          const { data: sessionData } = await supabase.auth.getSession();
          const email = sessionData?.session?.user?.email;
          
          if (email) {
            console.log(`Found email in session: ${email}, looking up user by email`);
            const { data: userByEmail, error: emailLookupError } = await supabase
              .from('users')
              .select('id')
              .eq('email', email)
              .single();
            
            if (emailLookupError) {
              console.error(`Error finding user by email: ${emailLookupError.message}`);
              return { success: false, error: `User not found by email: ${emailLookupError.message}` };
            }
            
            if (userByEmail) {
              console.log(`Found user by email with ID: ${userByEmail.id}`);
              userId = userByEmail.id; // Use the correct UUID from the database
            } else {
              return { success: false, error: 'User not found by email' };
            }
          } else {
            return { success: false, error: 'No email found in session to find user' };
          }
        } catch (alternativeError) {
          console.error('Error in alternative user lookup:', alternativeError);
          return { success: false, error: `Alternative lookup failed: ${alternativeError.message}` };
        }
      } else {
        return { success: false, error: checkError.message };
      }
    } else if (!userExists) {
      return { success: false, error: 'User not found' };
    }
    
    // Now update the user with the idea
    console.log(`Updating idea for user ${userId}`);
    const { data, error } = await supabase
      .from('users')
      .update({ idea })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating user idea: ${error.message}`);
      return { success: false, error: error.message };
    }
    
    console.log('Idea updated successfully');
    return { success: true, data };
  } catch (error) {
    console.error(`Unexpected error in updateUserIdea: ${error.message}`);
    return { success: false, error: error.message };
  }
} 