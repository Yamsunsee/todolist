import React from "react";
import Filter from "./components/Filter";
import Input from "./components/Input";
import Sort from "./components/Sort";
import Todo from "./components/Todo";

const App: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-center bg-slate-50 p-8">
      <div className="flex min-h-[calc(100vh-4rem)] w-[30rem] flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg">
        <div className="text-2xl font-bold text-blue-500">
          <span className="text-blue-400">Todo</span>list
        </div>
        <Input />
        <div>
          <Filter />
          <Sort />
        </div>
        <div className="flex-grow">
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default App;
