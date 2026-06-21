import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/buttons/PrimaryButton';
import { ProductImage } from '@/src/components/ui/ProductImage';
import { fontSizes, fonts, loginGlass, radius } from '@/src/theme';

const pickerOptions: ImagePicker.ImagePickerOptions = {
  allowsEditing: true,
  aspect: [4, 3],
  base64: true,
  mediaTypes: ['images'],
  quality: 0.8,
};

type ProductImagePickerProps = {
  disabled?: boolean;
  imageAsset: ImagePicker.ImagePickerAsset | null;
  imageUrl?: string;
  onRemoveImage: () => void;
  onSelectImage: (asset: ImagePicker.ImagePickerAsset) => void;
  variant?: 'default' | 'warm';
};

export function ProductImagePicker({
  disabled,
  imageAsset,
  imageUrl = '',
  onRemoveImage,
  onSelectImage,
  variant = 'warm',
}: ProductImagePickerProps) {
  const warm = variant === 'warm';
  const previewUri = imageAsset?.uri || imageUrl.trim() || null;

  const handlePickImage = async () => {
    if (disabled) return;

    if (Platform.OS === 'web') {
      const asset = await pickProductImageFromWeb();
      if (asset) onSelectImage(asset);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso às fotos para enviar a imagem do produto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (result.canceled || !result.assets[0]) {
      return;
    }

    onSelectImage(result.assets[0]);
  };

  return (
    <View style={styles.root}>
      {previewUri ? (
        <View style={styles.previewWrap}>
          <ProductImage sourceUrl={previewUri} style={styles.previewImage} />
        </View>
      ) : (
        <View style={[styles.placeholder, warm && styles.placeholderWarm]}>
          <MaterialIcons
            name="add-photo-alternate"
            size={40}
            color={warm ? loginGlass.textMuted : '#888'}
          />
          <Text style={[styles.placeholderText, warm && styles.placeholderTextWarm]}>
            Nenhuma imagem selecionada
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <PrimaryButton
          label={previewUri ? 'Trocar imagem' : 'Selecionar imagem'}
          onPress={() => void handlePickImage()}
          disabled={disabled}
          variant={warm ? 'warm' : 'default'}
        />
        {previewUri ? (
          <Pressable
            onPress={onRemoveImage}
            disabled={disabled}
            style={({ pressed }) => [styles.removeButton, pressed && styles.removePressed]}
            hitSlop={8}>
            <Text style={styles.removeText}>Remover imagem</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

async function pickProductImageFromWeb(): Promise<ImagePicker.ImagePickerAsset | null> {
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

    input.click();
  });
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  previewWrap: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: loginGlass.formFieldBg,
    borderWidth: 1,
    borderColor: loginGlass.cardBorder,
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f8f8f8',
  },
  placeholderWarm: {
    borderColor: loginGlass.cardBorder,
    backgroundColor: loginGlass.formFieldBg,
  },
  placeholderText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: '#888',
  },
  placeholderTextWarm: {
    color: loginGlass.textMuted,
  },
  actions: {
    gap: 8,
  },
  removeButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  removePressed: {
    opacity: 0.7,
  },
  removeText: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.sm,
    color: '#F5A8A0',
    fontWeight: '600',
  },
});
