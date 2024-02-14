import React from 'react'
import { useProjectsValue, useSelectedProjectValue } from '../context';

const Projects = ({activeValue=null}) => {
    const [active, setActive] = useState(activeValue);
    const {setSelectedProjects} = useSelectedProjectValue();
    const { projects } = useProjectsValue();
  return (
    <div>Projects</div>
  )
}

export default Projects