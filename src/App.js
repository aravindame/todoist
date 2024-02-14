import React from 'react';
import { Header } from './components/Header';
import { Content } from './components/Content';
import { ProjectsProvider } from './context/project-context';
import { SelectedProjectProvider } from './context';

export const App = () => {
  return (
    <SelectedProjectProvider>
      <ProjectsProvider>
        <Header />
        <Content />
      </ProjectsProvider>
    </SelectedProjectProvider>
  );
};
