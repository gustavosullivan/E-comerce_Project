import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

/** Abre seletor de imagem — no web, pasta/arquivos do PC; no mobile, galeria. */
export async function pickAvatarImage(): Promise<ImagePicker.ImagePickerAsset | null> {
  if (Platform.OS === 'web') {
    return pickAvatarFromWeb();
  }
  return pickAvatarFromDevice();
}

async function pickAvatarFromWeb(): Promise<ImagePicker.ImagePickerAsset | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif,image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    const cleanup = () => {
      input.remove();
    };

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        cleanup();
        resolve(null);
        return;
      }

      if (!file.type.startsWith('image/')) {
        cleanup();
        Alert.alert('Arquivo inválido', 'Selecione uma imagem (JPG, PNG ou WebP).');
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        cleanup();
        const dataUrl = reader.result;
        if (typeof dataUrl !== 'string') {
          resolve(null);
          return;
        }

        const commaIndex = dataUrl.indexOf(',');
        const base64 = commaIndex !== -1 ? dataUrl.slice(commaIndex + 1) : '';

        resolve({
          uri: dataUrl,
          base64,
          mimeType: file.type,
          width: 0,
          height: 0,
          fileName: file.name,
        });
      };
      reader.onerror = () => {
        cleanup();
        Alert.alert('Erro', 'Não foi possível ler a imagem selecionada.');
        resolve(null);
      };
      reader.readAsDataURL(file);
    };

    input.oncancel = () => {
      cleanup();
      resolve(null);
    };

    input.click();
  });
}

async function pickAvatarFromDevice(): Promise<ImagePicker.ImagePickerAsset | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permissão necessária', 'Permita acesso às fotos para alterar o perfil.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return result.assets[0];
}
