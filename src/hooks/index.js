import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import moment from 'moment';
import { collatedTasksExist } from '../helpers';

export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let unsubscribe; // Variable to store unsubscribe function from Firestore listener
    const tasksCollection = collection(firestore, 'tasks'); // Reference to 'tasks' collection
    const initialQuery = query(
      tasksCollection,
      where('userId', '==', 'jlIFXIwyAL3tzHMtzRbw')
    ); // Initial query to filter tasks by userId
    console.log(initialQuery, 'initialQuery');

    if (selectedProject && !collatedTasksExist(selectedProject)) {
      // If a project is selected and it's not a special project like TODAY or INBOX
      unsubscribe = onSnapshot(
        // Listen to changes in tasks collection based on the query
        query(initialQuery, where('projectId', '==', selectedProject)), // Additional query to filter tasks by selectedProject
        (snapshot) => {
          // Callback function to handle changes in data
          const newTasks = snapshot.docs.map((doc) => ({
            // Map each document in the snapshot to a task objec
            id: doc.id, // Task ID
            ...doc.data(), // Task data
          }));
          setTasks(filterArchivedTasks(newTasks)); // Set tasks state variable after filtering archived tasks
          setArchivedTasks(filterArchivedTasks(newTasks)); // Set archivedTasks state variable after filtering archived tasks
        }
      );
    } else if (selectedProject === 'TODAY') {
      // If selectedProject is TODAY
      unsubscribe = onSnapshot(
        // Listen to changes in tasks collection based on the query
        query(initialQuery, where('date', '==', moment().format('DD/MM/YYYY'))), // Additional query to filter tasks for today's date
        (snapshot) => {
          // Callback function to handle changes in data
          const newTasks = snapshot.docs.map((doc) => ({
            // Map each document in the snapshot to a task object
            id: doc.id, // Task ID
            ...doc.data(), // Task data
          }));
          setTasks(filterArchivedTasks(newTasks)); // Set tasks state variable after filtering archived tasks
          setArchivedTasks(filterArchivedTasks(newTasks)); // Set archivedTasks state variable after filtering archived tasks
        }
      );
    } else if (selectedProject === 'INBOX' || selectedProject === 0) {
      // If selectedProject is INBOX or 0
      unsubscribe = onSnapshot(
        // Listen to changes in tasks collection based on the query
        query(initialQuery, where('date', '==', '')), // Additional query to filter tasks with no date
        (snapshot) => {
          // Callback function to handle changes in data
          const newTasks = snapshot.docs.map((doc) => ({
            // Map each document in the snapshot to a task object
            id: doc.id, // Task ID
            ...doc.data(), // Task data
          }));
          setTasks(filterArchivedTasks(newTasks)); // Set tasks state variable after filtering archived tasks
          setArchivedTasks(filterArchivedTasks(newTasks)); // Set archivedTasks state variable after filtering archived tasks
        }
      );
    } else {
      // If selectedProject is not a special project like TODAY or INBOX
      unsubscribe = onSnapshot(initialQuery, (snapshot) => {
        // Listen to changes in tasks collection based on the query
        const newTasks = snapshot.docs.map((doc) => ({
          // Map each document in the snapshot to a task object
          id: doc.id, // Task ID
          ...doc.data(), // Task data
        }));
        setTasks(filterArchivedTasks(newTasks)); // Set tasks state variable after filtering archived tasks
        setArchivedTasks(filterArchivedTasks(newTasks)); // Set archivedTasks state variable after filtering archived tasks
      });
    }

    return () => unsubscribe(); // Cleanup function to unsubscribe from Firestore listener
  }, [selectedProject]); // Dependency array containing selectedProject

  return { tasks, archivedTasks }; // Return tasks and archivedTasks state variables
};

function filterArchivedTasks(tasks) {
  // Function to filter archived tasks
  return tasks.filter((task) => !task.archived); // Filter out tasks that are not archived
}

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      // Function to fetch projects asynchronously
      const q = query(
        // Construct a Firestore query
        collection(firestore, 'projects'), // Reference to the 'projects' collection
        where('userId', '==', 'jlIFXIwyAL3tzHMtzRbw'), // Filter projects by userId
        orderBy('projectId') // Order projects by projectId
      );

      try {
        const querySnapshot = await getDocs(q); // Execute the query and get the snapshot of documents
        const allProjects = querySnapshot.docs.map((doc) => ({
          // Map each document to a project object
          ...doc.data(), // Project data
          docId: doc.id, // Project document ID
        }));

        if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
          // Check if projects have changed
          setProjects(allProjects); // Update projects state variable with new projects
        }
      } catch (error) {
        console.error('Error fetching projects:', error); // Log error if fetching projects fails
      }
    };

    fetchProjects(); // Call fetchProjects function when component mounts or projects state changes
  }, [projects]); // Dependency array containing projects state variable

  return { projects, setProjects }; // Return projects state variable and setter function
};
