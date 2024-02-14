import React from 'react';
import { firestore } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const CheckBox = ({ id }) => {
  const archiveTask = async (id) => {
    try {
      await updateDoc(doc(firestore, 'tasks', id), {
        archived: true,
      });
      console.log('Task archived successfully.');
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };
  return (
    <div
      className="checkbox-holder"
      data-testid="checkbox-action"
      onClick={() => archiveTask()}
    >
      <span className='checkbox'/>
    </div>
  );
};
