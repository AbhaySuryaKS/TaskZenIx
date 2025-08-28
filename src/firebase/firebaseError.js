function DectectAuthError(error) {
    switch (error.code) {
        case "auth/invalid-email":
            return "Invalid email id";

        case "auth/user-disabled":
            return "This user account has been blocked. If you believe this is a mistake, please contact support."; 
        
        case "auth/user-not-found":
            return "Account not found.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/email-already-in-use":
            return "This account is already registered.";

        case "auth/weak-password":
            return "The password is too weak.";

        case "auth/requires-recent-login":
            return "This action requires you to re-authenticate.";

        case "auth/invalid-credential":
            return "Invalid credentials. Please try again.";

        case "auth/credential-already-in-use":
            return "This credential is already associated with another user account.";

        case "auth/provider-already-linked":
            return "This authentication provider is already linked to your account.";

        case "auth/network-request-failed":
            return "A network error occurred. Please check your internet connection.";

        case "auth/too-many-requests":
            return "Too many requests. Please try again in a few minutes.";

        case "auth/missing-email":
            return "Credentials missing." ;

        case "auth/missing-password":
            return "Credentials missing."; 

        default:
          return `An unexpected error occurred: ${error.message || "Please try again."}`;
    }
}

export default DectectAuthError