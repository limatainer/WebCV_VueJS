import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

// Contact form data interface
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Contact message interface (with metadata)
export interface ContactMessage extends ContactFormData {
  id?: string
  timestamp: Timestamp
  status: 'new' | 'read' | 'replied'
}

/**
 * Save a contact form submission to Firestore
 * @param data - Contact form data
 * @returns Promise with document ID
 */
export const saveContactMessage = async (data: ContactFormData): Promise<string> => {
  try {
    const contactData: Omit<ContactMessage, 'id'> = {
      ...data,
      timestamp: Timestamp.now(),
      status: 'new'
    }

    const docRef = await addDoc(collection(db, 'contacts'), contactData)
    console.log('Contact message saved with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error saving contact message:', error)
    throw new Error('Failed to save contact message. Please try again.')
  }
}

/**
 * Retrieve all contact messages from Firestore
 * @returns Promise with array of contact messages
 */
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)

    const messages: ContactMessage[] = []
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ContactMessage)
    })

    return messages
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw new Error('Failed to fetch contact messages.')
  }
}

/**
 * Update the status of a contact message
 * @param id - Document ID
 * @param status - New status
 * @returns Promise
 */
export const updateMessageStatus = async (
  id: string,
  status: 'new' | 'read' | 'replied'
): Promise<void> => {
  try {
    const messageRef = doc(db, 'contacts', id)
    await updateDoc(messageRef, { status })
    console.log('Message status updated:', id, status)
  } catch (error) {
    console.error('Error updating message status:', error)
    throw new Error('Failed to update message status.')
  }
}

/**
 * Get count of unread messages
 * @returns Promise with count
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const messages = await getContactMessages()
    return messages.filter(msg => msg.status === 'new').length
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}
