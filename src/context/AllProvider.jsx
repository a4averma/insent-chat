import AppProvider from './App/actions';

export default function AllProvider({children}) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}