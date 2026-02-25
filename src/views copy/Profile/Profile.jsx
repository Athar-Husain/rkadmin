import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Typography, Box, FormControl, InputLabel, Input, FormHelperText } from "@mui/material";

const ProfileScreen = () => {
    // Dummy data for profile and setup boxes
    const dummyProfile = { name: "John Doe", email: "john.doe@example.com" };
    const dummySetupBoxes = [
        { id: "box1" },
        { id: "box2" },
    ];

    // Commented out actual Redux logic for now
    // const dispatch = useDispatch();
    // const profile = useSelector(state => state.profile);
    // const setupBoxes = useSelector(state => state.setupBox.boxes);

    const [name, setName] = useState(dummyProfile.name);
    const [email, setEmail] = useState(dummyProfile.email);

    // Dummy dispatch function
    const dispatch = (action) => {
        console.log("Dispatching action:", action);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            dispatch({ type: "SHOW_MODAL", payload: { title: "Error", description: "Please enter your name." } });
            return;
        }
        if (!email.trim() || !email.includes("@")) {
            dispatch({ type: "SHOW_MODAL", payload: { title: "Error", description: "Please enter a valid email address." } });
            return;
        }
        dispatch({ type: "SHOW_LOADER" });
        setTimeout(() => {
            dispatch({ type: "HIDE_LOADER" });
            dispatch({ type: "UPDATE_PROFILE", payload: { name: name.trim(), email: email.trim() } });
            dispatch({ type: "SET_USERNAME", payload: name.trim() });
            dispatch({ type: "SHOW_TOAST", payload: "Profile updated successfully" });
        }, 1000);
    };

    const onUnlink = (id) => {
        dispatch({ type: "REMOVE_SETUP_BOX", payload: id });
        dispatch({ type: "SHOW_TOAST", payload: `Setup box ${id} unlinked` });
    };

    const onLogout = () => {
        dispatch({
            type: "SHOW_MODAL",
            payload: {
                title: "Logout",
                description: "Are you sure you want to logout?",
                onOk: () => {
                    dispatch({ type: "LOGOUT" });
                    dispatch({ type: "SET_SCREEN", payload: "login" });
                },
            },
        });
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                padding: "2rem",
                maxWidth: "600px",
                margin: "0 auto",
            }}
            aria-label="Profile Screen"
        >
            <Typography variant="h4" color="primary" gutterBottom>
                Profile
            </Typography>

            <form onSubmit={onSubmit} noValidate>
                <Box sx={{ marginBottom: "1.5rem" }}>
                    <TextField
                        id="profile-name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                    />
                </Box>

                <Box sx={{ marginBottom: "1.5rem" }}>
                    <TextField
                        id="profile-email"
                        label="Email"
                        variant="outlined"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ marginBottom: "1rem" }}
                    />
                </Box>

                <Box sx={{ marginBottom: "1.5rem" }}>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                        Linked Setup Boxes
                    </Typography>
                    {dummySetupBoxes.map((box) => (
                        <Box
                            key={box.id}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0.8rem",
                                border: "1px solid #ccc",
                                marginBottom: "0.5rem",
                                borderRadius: "8px",
                            }}
                        >
                            <Typography variant="body1">{box.id}</Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => onUnlink(box.id)}
                                sx={{ padding: "0.3rem 1rem" }}
                            >
                                Unlink
                            </Button>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ marginBottom: "1.5rem" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ padding: "0.8rem", marginBottom: "1rem" }}
                    >
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        onClick={onLogout}
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ padding: "0.8rem" }}
                    >
                        Logout
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default ProfileScreen;
