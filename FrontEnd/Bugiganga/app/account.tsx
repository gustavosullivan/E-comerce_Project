import { Redirect } from 'expo-router';

/** Rota legada — tudo fica na aba Conta. */
export default function AccountRedirect() {
  return <Redirect href="/(tabs)/profile" />;
}
