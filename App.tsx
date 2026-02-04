import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo { 
  id: number; 
  name: string; 
  done: boolean;
}

const useAsyncStorage = (key: string, defValue: Todo[]) => {
    const [storedValue, setStoredValue] = useState<Todo[]>(defValue);

    useEffect(() => {
        AsyncStorage.getItem(key)
            .then(value => {
                if (value === null) return defValue;
                return JSON.parse(value);
            })
            .then(setStoredValue)
    }, [key]);

    const setValue = (value: Todo[] | ((val: Todo[]) => Todo[])) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    }

    return [storedValue, setValue] as const;
}

export default function List() {
  const [task, setTask] = useState('');
  

  const [tasks, setTasks] = useAsyncStorage('@tasks_key', []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Todo list:</Text>
      
      <TextInput
        style={styles.input}
        value={task}
        onChangeText={setTask}
        placeholder="Task"
      />

      <Button title="Save" onPress={() => {
        if (task.trim() !== '') {
          setTasks([...tasks, { id: Date.now(), name: task, done: false }]);
          setTask('');
        }
      }} />

      <View style={{ marginTop: 20 }}>
        {tasks.map(item => (
          <TouchableOpacity 
            key={item.id} 
            onPress={() => {
              setTasks(tasks.map(task => 
                task.id === item.id ? { ...task, done: !task.done } : task
              ));
            }}
          >
            <Text style={[
              styles.listItem, 
              item.done && styles.listItemDone 
            ]}>
              • {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { 
    padding: 40,
    flex: 1,
    backgroundColor: '#a9bda9'
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#000' 
  },

  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    color: '#000', 
  },
  listItem: {
     padding: 10, 
    fontSize: 20,
     borderColor: '#558d4d', 
     color: '#000' 
  },
  listItemDone: {
    textDecorationLine: 'line-through',
    color: '#555' 
  }
});

