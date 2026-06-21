import type { ImagePickerAsset } from 'expo-image-picker';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1';

function getCloudName(): string {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  if (!cloudName) {
    throw new Error('Configure EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME no arquivo .env.');
  }
  return cloudName;
}

function getProductsUploadPreset(): string {
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!uploadPreset) {
    throw new Error('Configure EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET no arquivo .env.');
  }
  return uploadPreset;
}

function getUsersUploadPreset(): string {
  const usersPreset = process.env.EXPO_PUBLIC_CLOUDINARY_USERS_UPLOAD_PRESET?.trim();
  if (usersPreset) {
    return usersPreset;
  }

  const fallbackPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  if (fallbackPreset) {
    return fallbackPreset;
  }

  throw new Error(
    'Configure EXPO_PUBLIC_CLOUDINARY_USERS_UPLOAD_PRESET (ou EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET) no arquivo .env.',
  );
}

function getProductsFolder(): string | undefined {
  return process.env.EXPO_PUBLIC_CLOUDINARY_PRODUCTS_FOLDER?.trim() || undefined;
}

function getUsersFolder(): string | undefined {
  return process.env.EXPO_PUBLIC_CLOUDINARY_USERS_FOLDER?.trim() || undefined;
}

function getMimeType(asset: ImagePickerAsset): string {
  if (asset.mimeType) {
    return asset.mimeType;
  }

  const uri = asset.uri ?? '';
  const extension = uri.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'heic':
    case 'heif':
      return 'image/heic';
    default:
      return 'image/jpeg';
  }
}

function resolveBase64(asset: ImagePickerAsset): string | null {
  if (asset.base64) {
    return asset.base64;
  }

  const uri = asset.uri ?? '';
  if (uri.startsWith('data:')) {
    const commaIndex = uri.indexOf(',');
    if (commaIndex !== -1) {
      return uri.slice(commaIndex + 1);
    }
  }

  return null;
}

async function uploadImage(
  asset: ImagePickerAsset,
  uploadPreset: string,
  folder?: string,
): Promise<string> {
  const cloudName = getCloudName();

  const base64 = resolveBase64(asset);
  if (!base64) {
    throw new Error('Nao foi possivel ler a imagem selecionada.');
  }

  const mimeType = getMimeType(asset);
  const formData = new FormData();

  formData.append('file', `data:${mimeType};base64,${base64}`);
  formData.append('upload_preset', uploadPreset);

  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url) {
    const message = data?.error?.message || 'Nao foi possivel enviar a imagem para a Cloudinary.';
    if (message.toLowerCase().includes('upload preset not found')) {
      throw new Error(
        `Upload preset "${uploadPreset}" nao encontrado na Cloudinary. Verifique o nome no painel e no arquivo .env.`,
      );
    }
    throw new Error(message);
  }

  return data.secure_url;
}

export async function uploadProductImage(asset: ImagePickerAsset): Promise<string> {
  return uploadImage(asset, getProductsUploadPreset(), getProductsFolder());
}

export async function uploadUserAvatar(asset: ImagePickerAsset): Promise<string> {
  return uploadImage(asset, getUsersUploadPreset(), getUsersFolder());
}
