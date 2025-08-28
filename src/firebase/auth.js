import app from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,signOut,deleteUser } from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function handleSignup(email, userName, password ) {
    return createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        await updateProfile(userCredential.user, { displayName: userName });
        return { user: userCredential.user };
    })
    .catch((error) => ({ error }));
}

function handleLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userName = user.displayName;
        localStorage.setItem("userName", userName); 
        return { userName };
    })
    .catch((error) => ({ error }));
}

function handleForgetPassword(email) {
    return sendPasswordResetEmail(auth, email)
    .then(() => ({ error: null }))
    .catch((error) => ({ error }));
}

async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


async function handleDeleteAccount() {
    const user = auth.currentUser;
    if (!user) {
        return { success: false, message: "No user is currently signed in." };
    }
    try {
        await deleteUser(user);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to delete account.",
        };
    }
}

export {
    handleSignup,
    handleLogin,
    handleForgetPassword,
    updateProfile,
    provider,
    getAuth,
    auth,
    onAuthStateChanged,
    signInWithPopup,
    logoutUser,
    handleDeleteAccount
};
