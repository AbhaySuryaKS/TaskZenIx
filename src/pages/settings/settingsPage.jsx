import React, { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import { CameraAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import Navbar from "../../components/navbar";
import Toast from "../../components/Toast";
import { auth, logoutUser, handleDeleteAccount, updateProfile } from "../../firebase/auth";
import DectectAuthError from "../../firebase/firebaseError";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
    const [name, setName] = useState("");
    const [newName, setNewName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("");
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            const storedName = localStorage.getItem("username") || currentUser.displayName || "Student";
            const storedPhoto = localStorage.getItem("photoURL") || currentUser.photoURL;
            setName(storedName);
            setNewName(storedName);
            setPhoto(storedPhoto);
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const finalName = newName.trim();

        if (!user) {
            setToast({ type: "error", message: "No user found." });
            return;
        }
        if (!finalName) {
            setToast({ type: "error", message: "Name cannot be empty." });
            return;
        }

        try {
            let imageUrl = photo;

            if (preview) {
                const formData = new FormData();
                formData.append("file", preview);
                formData.append("upload_preset", "TaskZenIx");

                const response = await fetch("https://api.cloudinary.com/v1_1/dp3slbcng/image/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.secure_url) {
                    imageUrl = data.secure_url;
                } else {
                    throw new Error("Cloudinary upload failed.");
                }
            }

            await updateProfile(user, {
                displayName: finalName,
                photoURL: imageUrl,
            });

            localStorage.setItem("username", finalName);
            localStorage.setItem("photoURL", imageUrl);

            setName(finalName);
            setPhoto(imageUrl);
            setPreview("");
            setToast({ type: "success", message: "Profile updated successfully!" });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            setToast({ type: "error", message: DectectAuthError(error) || "Failed to update profile." });
        }
    };

    const handleLogout = async () => {
        const res = await logoutUser();
        if (res.success) {
            setToast({ type: "success", message: "Logout successful!" });
            localStorage.clear();
            navigate("/dashboard");
        } else {
            setToast({ type: "error", message: "Failed to logout." });
        }
    };

    const handleDelete = async () => {
        const res = await handleDeleteAccount();
        if (res) {
            setToast({ type: "success", message: "Account deleted successfully!" });
            localStorage.clear()
            navigate("/dashboard")
        } else {
            setToast({ type: "error", message: "Failed to delete account." });
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-950 text-white p-3">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <Navbar page="Settings" />
            <div className="h-full flex-1 flex justify-center p-3 mt-2">
                <div className="w-full max-w-xl text-white bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
                    <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <div className="relative group w-28 h-28">
                                <img
                                    src={preview || photo || "https://placehold.co/112x112/2d3748/a0aec0?text=Avatar"}
                                    alt="Profile Avatar"
                                    className="w-full h-full object-cover rounded-full border-4 border-indigo-600 shadow-lg transition-transform group-hover:scale-103"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/112x112/2d3748/a0aec0?text=Avatar"; }}
                                />
                                <label
                                    htmlFor="photo"
                                    className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer border border-white/20 hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                    title="Change Photo"
                                >
                                    <CameraAlt className="text-white text-lg" />
                                    <input
                                        type="file"
                                        id="photo"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <h2 className="text-2xl font-bold text-center tracking-wide text-white">{name}</h2>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="block text-sm text-indigo-300 font-medium">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 text-sm"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-3 rounded-xl font-semibold shadow-lg text-lg mt-4"
                        >
                            Save Changes
                        </button>
                    </form>

                    <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors py-3 px-6 rounded-xl font-semibold shadow-lg text-lg"
                        >
                            <LogoutIcon sx={{ fontSize: 24 }} className="mr-3" />
                            Logout
                        </button>

                        <div className="mt-6">
                            <h2 className="text-xl text-red-500 font-bold mb-2">Danger Zone</h2>
                            <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button
                                onClick={() => setFormVisible(true)}
                                className="flex items-center justify-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors py-3 px-6 rounded-xl font-semibold shadow-lg text-lg"
                            >
                                <DeleteIcon sx={{ fontSize: 24 }} className="mr-3" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {formVisible && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-70 z-40 backdrop-blur-sm"
                            onClick={() => setFormVisible(false)}
                        ></div>
                        <div className="fixed w-[90%] max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-8 rounded-2xl shadow-2xl text-center space-y-6 z-50 border border-gray-700 animate-fadeIn">
                            <button
                                onClick={() => setFormVisible(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full"
                                aria-label="Close modal"
                            >
                                <CloseIcon sx={{ fontSize: 24 }} />
                            </button>
                            <p className="text-xl font-semibold text-white leading-relaxed">
                                We're sad to see you go.
                                <br />
                                Are you sure you want to delete your account?
                            </p>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md text-base"
                                    onClick={handleDelete}
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    className="bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white px-6 py-3 rounded-lg transition-colors shadow-md text-base"
                                    onClick={() => setFormVisible(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SettingsPage;