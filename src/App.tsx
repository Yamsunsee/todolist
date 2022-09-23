import React, { useMemo, useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { nanoid } from "nanoid";
import { Task } from "./types";

const App: React.FC = () => {
  const [newTask, setNewTask] = useState("");
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

  const handlePrioritiesChange = (targetPriority: string) => () => {
    if (priorities.includes(targetPriority)) {
      setPriorities((prev) => prev.filter((priority) => priority !== targetPriority));
    } else {
      setPriorities((prev) => [...prev, targetPriority]);
    }
  };

  const handlePrioritiesToggle = () => {
    if (priorities.length === 0) {
      setPriorities(["low", "medium", "high"]);
    } else {
      setPriorities([]);
    }
  };

  const handleStatusChange = (targetState: string) => () => {
    if (status.includes(targetState)) {
      setStatus((prev) => prev.filter((state) => state !== targetState));
    } else {
      setStatus((prev) => [...prev, targetState]);
    }
  };

  const handleStatusToggle = () => {
    if (status.length === 0) {
      setStatus(["pending", "completed"]);
    } else {
      setStatus([]);
    }
  };

  const handleDelete = (targetState: Task) => () => {
    setTasks((tasks) => tasks.filter((task) => task.id !== targetState.id));
  };

  return (
    <div className="flex w-full select-none items-center justify-center p-8">
      <div className="flex min-h-[calc(100vh-4rem)] w-[50rem] flex-col items-center justify-center rounded-lg p-8 text-slate-400 shadow-lg">
        <div className="text-5xl font-bold text-slate-300">
          &lt; Todo
          <span className="text-slate-400">list </span>
          /&gt;
        </div>
        <div className="mt-8 w-full">
          <div className="relative flex">
            <div className="mr-4 flex-grow">
              <input
                className="search w-full rounded-lg border-2 border-slate-300 py-4 pl-12 pr-8 italic text-slate-400 outline-none placeholder:text-slate-300 focus:border-slate-400"
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <IonIcon
                name="search"
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl text-slate-300"
              />
            </div>
            <div className="group z-10 flex cursor-pointer items-center justify-center rounded-lg border-2 border-slate-300 px-8 py-4">
              <IonIcon name="options-outline" className="text-2xl" />
              <div className="ml-2 italic">Filter</div>
              <div className="absolute left-full top-0 hidden flex-col pl-16 group-hover:flex">
                <div className="rounded-lg border-2 border-slate-300 p-4 italic">
                  <div>
                    <div onClick={handlePrioritiesToggle} className="text-slate-300">
                      &lt; Priorities /&gt;
                    </div>
                    <div className="flex gap-4">
                      {["low", "medium", "high"].map((priority) => (
                        <div
                          onClick={handlePrioritiesChange(priority)}
                          key={priority}
                          className={`flex items-center rounded-lg pl-2 capitalize ${
                            priorities.includes(priority) ? "text-slate-400" : "text-slate-300"
                          }`}
                        >
                          [{priority}]
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <div onClick={handleStatusToggle} className="text-slate-300">
                      &lt; Status /&gt;
                    </div>
                    <div className="flex gap-4">
                      {["pending", "completed"].map((state) => (
                        <div
                          onClick={handleStatusChange(state)}
                          key={state}
                          className={`flex items-center capitalize ${state} ${
                            status.includes(state) ? "text-slate-400" : "text-slate-300"
                          }`}
                        >
                          [{state}]
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
              <code className="mt-8 rounded-lg border-2 border-dashed border-slate-300 p-8">
                <p>&lt; Priorities &gt;</p>
                <p>taskName &rarr; [Low]</p>
                <p>!taskName &rarr; [Medium]</p>
                <p>*taskName &rarr; [High]</p>
                <p>&lt;/ Priorities &gt;</p>
              </code>
            </div>
          )}
        </div>
        <div className="mt-4 flex w-full">
          <div className="relative mr-4 flex-grow">
            <input
              className="add w-full rounded-lg border-2 border-slate-300 py-4 pl-12 pr-8 italic text-slate-400 outline-none placeholder:text-slate-300 focus:border-slate-400"
              onChange={handleNewTaskChange}
              onKeyDown={handleSubmitNewTaskChange}
              value={newTask}
              type="text"
              placeholder="Enter new task here..."
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
