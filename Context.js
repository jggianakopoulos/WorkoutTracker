
import * as React from 'react';
import * as SQLite from "expo-sqlite";

const Context = React.createContext();

Context.db = SQLite.openDatabase("db.db");

export { Context };