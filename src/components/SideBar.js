import React, { useState } from 'react';
import {
  FaChevronCircleDown,
  FaInbox,
  FaRegCalendarAlt,
  FaRegCalendar,
} from 'react-icons/fa';
import { useSelectedProjectValue } from '../context';

export const SideBar = () => {
  const { setSelectedProject } = useSelectedProjectValue;
  const {active, setActive} = useState('INBOX');
  const {showProjects, setShowProjects} = useState(true);
  
  return (
    <>
      <div className="sidebar" data-testid="sidebar">
        <ul className="sidebar__generic">
          <li>
            <span>
              <FaInbox />
            </span>
            <span>Inbox</span>
          </li>
          <li>
            <span>
              <FaRegCalendar />
            </span>
            <span>Today</span>
          </li>
          <li>
            <span>
              <FaRegCalendarAlt />
            </span>
            <span>Next 7 days</span>
          </li>
        </ul>
        <div className="sidebar__middle">
          <span>
            <FaChevronCircleDown />
          </span>
          <h2>Projects</h2>
        </div>
        <ul className="sidebar__projects">Projects will be here!</ul>
        Add Project Components here!!
      </div>
    </>
  );
};
