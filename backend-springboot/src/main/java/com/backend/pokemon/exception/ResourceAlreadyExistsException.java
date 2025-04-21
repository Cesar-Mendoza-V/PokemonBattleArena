package com.backend.pokemon.exception;

/**
 * Exception thrown when attempting to create a resource that already exists.
 * 
 * What is this class? Think of it like a special error message that gets triggered
 * when someone tries to create something that's already in the system.
 * 
 * For example, if a user tries to register with an email address that's already
 * being used by another account, this exception would be thrown to indicate that
 * the email is already taken.
 * 
 * It's like trying to create a library card for someone who already has one - the
 * system needs to tell you "this person already exists in our database".
 */
public class ResourceAlreadyExistsException extends RuntimeException {
    
    /**
     * Creates a new exception with a descriptive message.
     * 
     * @param message Explains what resource already exists (e.g., "Email already in use")
     */
    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}
