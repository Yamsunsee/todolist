import React, { useMemo, useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { nanoid } from "nanoid";
import { Task } from "./types";

const App: React.FC = () => {
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("low");
  const [search, setSearch] = useState("");
  const [priorities, setPriorities] = useState<string[]>(["low", "medium", "high"]);
  const [status, setStatus] = useState<string[]>(["pending", "completed"]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const filteredTasks = useMemo(() => {
    const firstGroup = tasks.filter((task) => task.label.includes(search));
    const secondGroup = firstGroup.filter((task) => priorities.includes(task.priority));
    const thirdGroup = secondGroup.filter((task) => !task.isCompleted);
    const fourthGroup = secondGroup.filter((task) => task.isCompleted);

    return status.length === 1
      ? status.includes("pending")
        ? thirdGroup
        : fourthGroup
      : status.length === 2
      ? secondGroup
      : [];
  }, [search, priorities, status, tasks]);

  const handleNewTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleSubmitNewTaskChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddNewTask();
    }
  };

  const handleAddNewTask = () => {
    if (newTask.trim().length !== 0) {
      setTasks((prev) => [
        ...prev,
        {
          id: nanoid(),
          label: newTask.trim(),
          isCompleted: false,
          priority: newPriority,
        },
      ]);
      setNewTask("");
    }
  };

  const handleToggleComplete = (targetTask: Task) => () => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === targetTask.id)
          return {
            ...task,
            isCompleted: !task.isCompleted,
          };
        return task;
      })
    );
  };

  const handlePrioritiesChange = (targetPriority: string) => () => {
    if (priorities.includes(targetPriority)) {
      setPriorities((prev) => prev.filter((priority) => priority !== targetPriority));
    } else {
      setPriorities((prev) => [...prev, targetPriority]);
    }
  };

  const handleStatusChange = (targetState: string) => () => {
    if (status.includes(targetState)) {
      setStatus((prev) => prev.filter((state) => state !== targetState));
    } else {
      setStatus((prev) => [...prev, targetState]);
    }
  };

  return (
    <div className="flex w-full select-none items-center justify-center bg-slate-900 p-8">
      <div className="flex min-h-[calc(100vh-4rem)] w-[50rem] flex-col items-center justify-center rounded-lg bg-slate-800 p-8 text-blue-100 shadow-lg">
        <div className="">Tasks</div>
        <div className="">
          <input
            className="text-black"
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="flex">
            {["low", "medium", "high"].map((priority) => (
              <div
                onClick={handlePrioritiesChange(priority)}
                key={priority}
                className={`flex items-center ${priority}`}
              >
                {priorities.includes(priority) ? <IonIcon name="checkbox" /> : <IonIcon name="square-outline" />}
                <div>{priority}</div>
              </div>
            ))}
          </div>
          <div className="flex">
            {["pending", "completed"].map((state) => (
              <div onClick={handleStatusChange(state)} key={state} className={`flex items-center ${state}`}>
                {status.includes(state) ? <IonIcon name="checkbox" /> : <IonIcon name="square-outline" />}
                <div>{state}</div>
              </div>
            ))}
          </div>
        </div>
        {filteredTasks.length > 0 ? (
          <div className="flex-grow">
            {filteredTasks.map((task) => (
              <div
                className={`flex items-center ${task.isCompleted && "line-through opacity-80"} ${task.priority}`}
                key={task.id}
                onClick={handleToggleComplete(task)}
              >
                {task.isCompleted ? <IonIcon name="checkbox" /> : <IonIcon name="square-outline" />}
                <div>{task.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-grow italic text-slate-400">No matching tasks</div>
        )}
        <div className="">
          <input
            className="text-black"
            onChange={handleNewTaskChange}
            onKeyDown={handleSubmitNewTaskChange}
            value={newTask}
            type="text"
            placeholder="Enter new task here..."
          />
          <div className="flex">
            {["low", "medium", "high"].map((priority) => (
              <div onClick={() => setNewPriority(priority)} key={priority} className={`flex items-center ${priority}`}>
                {newPriority === priority ? <IonIcon name="checkbox" /> : <IonIcon name="square-outline" />}
                <div>{priority}</div>
              </div>
            ))}
          </div>
          <button onClick={handleAddNewTask}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default App;
