import { Redirect } from 'expo-router';

/** Entrada do app — sempre começa na tela de login */
export default function Index() {
  return <Redirect href="/login" />;
}
