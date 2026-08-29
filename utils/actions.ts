import { Alert, Linking, Platform } from 'react-native';

// Loose E.164-ish check: an optional leading +, then 7-15 digits. Good enough
// to catch obviously-wrong data (e.g. placeholder seed numbers) without
// rejecting real-world formatting we haven't anticipated.
export function isValidPhoneNumber(phone: string): boolean {
  return /^\+?\d{7,15}$/.test(phone.replace(/[\s()-]/g, ''));
}

export async function callPharmacy(phone: string): Promise<void> {
  if (!isValidPhoneNumber(phone)) {
    Alert.alert('Numéro invalide', 'Ce numéro de téléphone ne semble pas valide.');
    return;
  }

  try {
    await Linking.openURL(`tel:${phone}`);
  } catch {
    Alert.alert('Appel impossible', "Cet appareil ne peut pas passer d'appel.");
  }
}

export async function openDirections(pharmacy: {
  name: string;
  latitude: number;
  longitude: number;
}): Promise<void> {
  const { name, latitude, longitude } = pharmacy;

  const nativeUrl = Platform.select({
    ios: `maps://?daddr=${latitude},${longitude}&dirflg=d`,
    android: `google.navigation:q=${latitude},${longitude}&mode=d`,
  });

  const fallbackUrl = Platform.select({
    ios: `https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`,
  });

  try {
    if (nativeUrl && (await Linking.canOpenURL(nativeUrl))) {
      await Linking.openURL(nativeUrl);
      return;
    }
    if (fallbackUrl) {
      await Linking.openURL(fallbackUrl);
    }
  } catch {
    Alert.alert(
      "Itinéraire impossible",
      "Aucune application de cartes n'a pu être ouverte sur cet appareil."
    );
  }
}
