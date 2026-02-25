import { Suspense } from 'react';

// ==============================|| LOADER - LAZY LOADING ||============================== //

// This is a component that wraps your lazily loaded components.
// It displays a "Loading..." message while the component's code chunk is being downloaded.
const Loadable = (Component) => (props) => (
  <Suspense fallback={
    // A simple, centered loading message to prevent a blank screen
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#333'
    }}>
      Loading...
    </div>
  }>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
