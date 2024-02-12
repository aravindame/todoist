import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFirestore } from '../firebase';
import moment from 'moment';
import { collatedTasksExist } from '../helpers';

export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    const firestore = getFirestore();
    let unsubscribe;

    const tasksCollection = collection(firestore, 'tasks');
    const initialQuery = query(
      tasksCollection,
      where('userId', '==', 'jlIFXIwyAL3tzHMtzRbw')
    );

    if (selectedProject && !collatedTasksExist(selectedProject)) {
      unsubscribe = onSnapshot(
        query(initialQuery, where('projectId', '==', selectedProject)),
        (snapshot) => {
          const newTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(filterArchivedTasks(newTasks));
          setArchivedTasks(filterArchivedTasks(newTasks));
        }
      );
    } else if (selectedProject === 'TODAY') {
      unsubscribe = onSnapshot(
        query(initialQuery, where('date', '==', moment().format('DD/MM/YYYY'))),
        (snapshot) => {
          const newTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(filterArchivedTasks(newTasks));
          setArchivedTasks(filterArchivedTasks(newTasks));
        }
      );
    } else if (selectedProject === 'INBOX' || selectedProject === 0) {
      unsubscribe = onSnapshot(
        query(initialQuery, where('date', '==', '')),
        (snapshot) => {
          const newTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(filterArchivedTasks(newTasks));
          setArchivedTasks(filterArchivedTasks(newTasks));
        }
      );
    } else {
      unsubscribe = onSnapshot(initialQuery, (snapshot) => {
        const newTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(filterArchivedTasks(newTasks));
        setArchivedTasks(filterArchivedTasks(newTasks));
      });
    }

    return () => unsubscribe();
  }, [selectedProject]);

  return { tasks, archivedTasks };
};

function filterArchivedTasks(tasks) {
  return tasks.filter((task) => !task.archived);
}
