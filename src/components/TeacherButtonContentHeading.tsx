import { ReactNode } from 'react';

interface TeacherButtonContentHeadingProps {
  children: ReactNode;
}

function TeacherButtonContentHeading({ children }: TeacherButtonContentHeadingProps) {
  return (
    <h4 className="text-xl font-bold mb-4" style={{ color: '#803494' }}>
      {children}
    </h4>
  );
}

export default TeacherButtonContentHeading;

