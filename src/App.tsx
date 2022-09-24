import React, { useEffect, useMemo, useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { nanoid } from "nanoid";

type Task = {
  id: string;
  label: string;
  isCompleted: boolean;
  priority: string;
};

type Regex = {
  groups?: {
    options?: string;
    label?: string;
  };
} | null;

const App: React.FC = () => {
  const [newTask, setNewTask] = useState("");
  const [filters, setFilters] = useState("");
  const storageTasks = useMemo(() => {
    const tasks = JSON.parse(localStorage.getItem("yam-todolist") || "[]");
    if (tasks) return tasks;
    localStorage.setItem("yam-todolist", JSON.stringify([]));
  }, []);
  const [tasks, setTasks] = useState<Task[]>(storageTasks);

  useEffect(() => {
    localStorage.setItem("yam-todolist", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let options = "";
    let label = "";
    const matches: Regex = filters.match(/(?<options>^[?!*@#]+)(?<label>.*)/m);
    if (matches) {
      options = matches?.groups?.options || "";
      label = matches?.groups?.label || "";
    } else {
      label = filters;
    }

    // Filters by name
    let firstGroup: Task[] = tasks.filter((task) => task.label.includes(label));

    // Filters by priorities
    let secondGroup: Task[] = [];
    const lowTasks = firstGroup.filter((task) => task.priority === "low");
    const mediumTasks = firstGroup.filter((task) => task.priority === "medium");
    const highTasks = firstGroup.filter((task) => task.priority === "high");
    if (options.includes("?") || options.includes("!") || options.includes("*")) {
      if (options.includes("?")) secondGroup = [...secondGroup, ...lowTasks];
      if (options.includes("!")) secondGroup = [...secondGroup, ...mediumTasks];
      if (options.includes("*")) secondGroup = [...secondGroup, ...highTasks];
    } else {
      secondGroup = firstGroup;
    }

    // Filters by status
    let thirdGroup: Task[] = [];
    const pendingTasks = secondGroup.filter((task) => !task.isCompleted);
    const completedTasks = secondGroup.filter((task) => task.isCompleted);
    if (options.includes("@") || options.includes("#")) {
      if (options.includes("@")) thirdGroup = [...thirdGroup, ...pendingTasks];
      if (options.includes("#")) thirdGroup = [...thirdGroup, ...completedTasks];
    } else {
      thirdGroup = secondGroup;
    }

    return thirdGroup;
  }, [filters, tasks]);

  const handleNewTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleSubmitNewTaskChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddNewTask();
    }
  };

  const handleAddNewTask = () => {
    let priority = "low";
    let label = newTask.trim();
    const sign = label.charAt(0);
    if (sign === "!") {
      priority = "medium";
      label = label.slice(1);
    } else if (sign === "*") {
      priority = "high";
      label = label.slice(1);
    }
    if (newTask.trim().length !== 0) {
      setTasks((prev) => [
        ...prev,
        {
          id: nanoid(),
          label,
          isCompleted: false,
          priority,
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

  const handleDelete = (targetState: Task) => () => {
    setTasks((tasks) => tasks.filter((task) => task.id !== targetState.id));
  };

  return (
    <div className="background flex w-full select-none items-center justify-center p-8">
      <div className="background-white flex min-h-[calc(100vh-4rem)] w-[50rem] flex-col items-center justify-center rounded-lg p-8 text-slate-400 shadow-lg">
        <div className="text-5xl font-bold text-slate-300">
          &lt; Todo
          <span className="text-slate-400">list </span>
          /&gt;
        </div>
        <div className="mt-8 w-full">
          <div className="relative flex">
            <div className="flex-grow">
              <input
                className="filters background-white w-full rounded-lg border-2 border-slate-300 py-4 pl-12 pr-8 italic text-slate-400 outline-none placeholder:text-slate-300 focus:border-slate-400"
                type="text"
                placeholder="Filters..."
                value={filters}
                onChange={(event) => setFilters(event.target.value)}
              />
              <IonIcon
                name="funnel-outline"
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl text-slate-300"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-grow flex-col rounded-lg border-2 border-slate-300 p-4">
          {filteredTasks.length > 0 ? (
            <div className="flex flex-grow flex-col gap-2">
              {filteredTasks.map((task) => (
                <div
                  className={`flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-slate-300 p-4 hover:border-solid ${
                    task.isCompleted && "border-transparent opacity-80"
                  }`}
                  key={task.id}
                  onClick={handleToggleComplete(task)}
                >
                  <div className="flex items-center">
                    {task.isCompleted && <IonIcon name="checkmark" />}
                    <div className="ml-2">{task.label}</div>
                  </div>
                  {task.isCompleted ? (
                    <IonIcon
                      name="trash"
                      className="cursor-pointer text-xl text-slate-300 hover:text-slate-400"
                      onClick={handleDelete(task)}
                    />
                  ) : (
                    <div>{task.priority === "high" ? "|||" : task.priority === "medium" ? "||" : "|"}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-grow flex-col items-center justify-center text-center italic text-slate-400">
              <p>No matching tasks!</p>
              <div className="flex gap-4">
                <code className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8">
                  <p>&lt; Priorities &gt;</p>
                  <p>taskName &rarr; [Low]</p>
                  <p>!taskName &rarr; [Medium]</p>
                  <p>*taskName &rarr; [High]</p>
                  <p>&lt;/ Priorities &gt;</p>
                </code>
                <code className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8">
                  <p>&lt; Filters &gt;</p>
                  <p>?taskName &rarr; [Low]</p>
                  <p>!taskName &rarr; [Medium]</p>
                  <p>*taskName &rarr; [High]</p>
                  <p>@taskName &rarr; [Pending]</p>
                  <p>#taskName &rarr; [Completed]</p>
                  <p>?!*@#taskName &rarr; ...</p>
                  <p>&lt;/ Filters &gt;</p>
                </code>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex w-full">
          <div className="relative mr-4 flex-grow">
            <input
              className="add background-white w-full rounded-lg border-2 border-slate-300 py-4 pl-12 pr-8 italic text-slate-400 outline-none placeholder:text-slate-300 focus:border-slate-400"
              onChange={handleNewTaskChange}
              onKeyDown={handleSubmitNewTaskChange}
              value={newTask}
              type="text"
              placeholder="Enter a new task here..."
              autoFocus
            />
            <IonIcon
              name="create-outline"
              className="absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl text-slate-300"
            />
          </div>
          <div
            onClick={handleAddNewTask}
            className="group z-10 flex cursor-pointer items-center justify-center rounded-lg border-2 border-slate-300 px-8 py-4 hover:border-slate-400"
          >
            <IonIcon name="add-circle-outline" className="text-2xl" />
            <div className="ml-2 italic">Add</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
