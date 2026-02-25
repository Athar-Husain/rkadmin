
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setupBoxSlice } from "../redux/slices/setupBoxSlice"; // Update with correct path
// import { uiSlice } from "../redux/slices/uiSlice"; // Update with correct path
import { Button, Menu, MenuItem, Typography, Card, Grid, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import Wifi from "@mui/icons-material/Wifi";
import SyncAlt from "@mui/icons-material/SyncAlt";
import ReportProblem from "@mui/icons-material/ReportProblem";
// import  Package from "@mui/icons-material/Package";
import GroupAdd from "@mui/icons-material/GroupAdd";
import Packages from "../../../views/Packages/Packages";
import PackagesScreen from "../../../views/Packages/Packages2";
// import { Wifi, SyncAlt, ReportProblem, Package, GroupAdd } from "@mui/icons-material";





const HomeScreen = () => {
    const dispatch = useDispatch();
    // const username = "john"

    // const username = useSelector((state) => state.auth.username);
    // const defaultBoxId = useSelector((state) => state.setupBox.defaultBoxId);
    // const boxes = useSelector((state) => state.setupBox.boxes);
    // const currentPackage = useSelector((state) => state.payment.currentPackage);


    const username = "John Doe"; // Replace with dynamic username later
    const defaultBoxId = "Box1"; // Replace with dynamic box ID later
    const boxes = [
        { id: "Box1" },
        { id: "Box2" },
        { id: "Box3" },
        { id: "Box4" },
    ]; // Replace with dynamic box list later
    const currentPackage = {
        name: "Premium Plan",
        speed: "100 Mbps",
        validity: "30 days",
        expiration: "2025-06-01",
        status: "Active"
    }; // Replace with dynamic package data later

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const buttonRef = useRef(null);
    const { control, handleSubmit } = useForm();

    const toggleDropdown = (event) => {
        setDropdownOpen((prev) => !prev);
        if (event) {
            setAnchorEl(event.currentTarget);
        }
    };

    const selectBox = (id) => {
        dispatch(setupBoxSlice.actions.setDefaultBox(id));
        setDropdownOpen(false);
        dispatch(uiSlice.actions.showToast(`Switched to setup box ${id}`));
    };

    useEffect(() => {
        const onClickOutside = (e) => {
            if (dropdownOpen && buttonRef.current && !buttonRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", onClickOutside);
        return () => document.removeEventListener("click", onClickOutside);
    }, [dropdownOpen]);

    const onSubmit = (data) => {
        console.log(data); // Handle form submission
    };

    return (
        <section style={{ margin: "auto", padding: "16px" }}>
            <header style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">Welcome, {username}</Typography>
                <div ref={buttonRef}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={toggleDropdown}
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                        endIcon={<Wifi />}
                    >
                        {defaultBoxId}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={dropdownOpen}
                        onClose={() => setDropdownOpen(false)}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        {boxes.map((box) => (
                            <MenuItem
                                key={box.id}
                                selected={box.id === defaultBoxId}
                                onClick={() => selectBox(box.id)}
                            >
                                {box.id}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </header>

            <Card variant="outlined" style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#E3F2FD" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Current Plan
                </Typography>
                <Typography variant="h5">{currentPackage.name}</Typography>
                <Typography variant="body1">Speed: {currentPackage.speed}</Typography>
                <Typography variant="body1">Validity: {currentPackage.validity}</Typography>
                <Typography variant="body1">Expires on: {currentPackage.expiration}</Typography>
                <Typography variant="body1" style={{ marginTop: "16px", color: "green" }}>
                    Status: {currentPackage.status}
                </Typography>
            </Card>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => dispatch(uiSlice.actions.setScreen("makePayment"))}
                        startIcon={<SyncAlt />}
                    >
                        Renew Package
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => dispatch(uiSlice.actions.setScreen("registerComplaint"))}
                        startIcon={<ReportProblem />}
                    >
                        Register Complaint
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => dispatch(uiSlice.actions.setScreen("packages"))}
                    // startIcon={<Package />}
                    >
                        View Packages
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => dispatch(uiSlice.actions.setScreen("referFriend"))}
                        startIcon={<GroupAdd />}
                    >
                        Refer a Friend
                    </Button>
                </Grid>
            </Grid>

            <Packages />
            <PackagesScreen />
        </section>
    );
}

export default HomeScreen;
