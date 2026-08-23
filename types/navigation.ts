import { Pharmacy } from './pharmacy';

export type RootStackParamList = {
  Home: undefined;
  PharmacyDetail: { pharmacy: Pharmacy };
};
