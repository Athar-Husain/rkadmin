import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Container } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";

// Sample Data (this could come from props or an API)
const initialData = {
    columns: [
        { id: 1, title: "To Do", tasks: [] },
        { id: 2, title: "In Progress", tasks: [] },
        { id: 3, title: "Done", tasks: [] },
    ],
};

const TaskBoard = () => {
    const [columns, setColumns] = useState(initialData.columns);
    const [newTask, setNewTask] = useState("");
    const [selectedColumn, setSelectedColumn] = useState(null);

    // Add Task Functionality
    const addTask = () => {
        if (!newTask || selectedColumn === null) return;

        const updatedColumns = columns.map((column) => {
            if (column.id === selectedColumn) {
                return {
                    ...column,
                    tasks: [...column.tasks, { id: Date.now(), content: newTask }],
                };
            }
            return column;
        });

        setColumns(updatedColumns);
        setNewTask(""); // Reset input
    };

    // Move Task to a different column
    const moveTask = (taskId, fromColumnId, toColumnId) => {
        const updatedColumns = columns.map((column) => {
            if (column.id === fromColumnId) {
                return {
                    ...column,
                    tasks: column.tasks.filter((task) => task.id !== taskId),
                };
            }
            if (column.id === toColumnId) {
                const taskToMove = columns
                    .find((col) => col.id === fromColumnId)
                    ?.tasks.find((task) => task.id === taskId);
                return {
                    ...column,
                    tasks: [...column.tasks, taskToMove],
                };
            }
            return column;
        });

        setColumns(updatedColumns);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Task Board</Typography>
                <Box>
                    <TextField
                        label="New Task"
                        variant="outlined"
                        size="small"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        sx={{ mr: 1 }}
                    />
                    <Button variant="contained" onClick={addTask}>Add Task</Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {columns.map((column) => (
                    <Grid item xs={12} sm={4} key={column.id}>
                        <TaskColumn
                            column={column}
                            tasks={column.tasks}
                            onTaskMove={moveTask}
                            onSelectColumn={setSelectedColumn}
                            selectedColumn={selectedColumn}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

const TaskColumn = ({ column, tasks, onTaskMove, onSelectColumn, selectedColumn }) => (
    <Box
        sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            padding: 2,
            minHeight: 300,
        }}
    >
        <Typography variant="h6" sx={{ mb: 2 }}>
            {column.title}
        </Typography>
        <Box>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    onTaskMove={onTaskMove}
                    selectedColumn={selectedColumn}
                />
            ))}
        </Box>
    </Box>
);

const TaskCard = ({ task, columnId, onTaskMove, selectedColumn }) => {
    const handleMoveTask = (toColumnId) => {
        if (columnId !== toColumnId) {
            onTaskMove(task.id, columnId, toColumnId);
        }
    };

    return (
        <Card sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <Typography variant="body2" color="textSecondary">
                    {task.content}
                </Typography>
            </CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {columnId !== 1 && (
                    <Button size="small" onClick={() => handleMoveTask(columnId - 1)}>
                        <DragIndicator />
                    </Button>
                )}
                {columnId !== 3 && (
                    <Button size="small" onClick={() => handleMoveTask(columnId + 1)}>
                        <DragIndicator />
                    </Button>
                )}
            </Box>
        </Card>
    );
};

export default TaskBoard;
