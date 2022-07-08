// routes
import Router from './routes/routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      {/* <BaseOptionChartStyle /> */}
      <Router />
    </ThemeProvider>
  );
}

export default App;
