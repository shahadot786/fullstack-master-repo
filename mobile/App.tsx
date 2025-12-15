import { registerRootComponent } from 'expo';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  return (
    <PaperProvider>
      <RootNavigator />
    </PaperProvider>
  );
}

registerRootComponent(App);
