import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCachedPharmaciesNearby } from "../hooks/useCachedPharmaciesNearby";
import { useDeviceLocation } from "../hooks/useDeviceLocation";
import { useIsOffline } from "../hooks/useIsOffline";
import { colors, fonts, fontSizes, radii, spacing } from "../theme/tokens";
import { RootStackParamList } from "../types/navigation";
import { matchesQuery } from "../utils/search";
import { MapStrip } from "./MapStrip";
import { OfflineBanner } from "./OfflineBanner";
import { PharmacyMap } from "./PharmacyMap";
import { PharmacyRow } from "./PharmacyRow";

type Filter = "garde" | "all";
type ViewMode = "list" | "map";

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { status, pharmacies, error, refetch, isShowingCachedData, cachedAt } =
    useCachedPharmaciesNearby();
  const isOffline = useIsOffline();
  const { label: deviceLocationLabel, coords: userLocation } = useDeviceLocation();
  const [filter, setFilter] = useState<Filter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");

  const filteredPharmacies = (
    filter === "garde" ? pharmacies.filter((p) => p.on_garde) : pharmacies
  ).filter((p) => matchesQuery(p, query));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={15}
          color={colors.textMuted60}
        />
        <Text style={styles.locationText}>{deviceLocationLabel ?? "Niamey · Plateau"}</Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={colors.textMuted60}
          style={styles.locationChevron}
        />
      </View>

      <View style={styles.searchField}>
        <Ionicons name="search" size={15} color={colors.textMuted55} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher une pharmacie"
          placeholderTextColor={colors.textMuted55}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="never"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color={colors.textMuted50} />
          </Pressable>
        )}
      </View>

      {isOffline && cachedAt && (
        <OfflineBanner
          message={`Données enregistrées à ${new Date(cachedAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })} · garde peut-être obsolète`}
        />
      )}

      <MapStrip
        onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
        label={viewMode === "list" ? "aperçu carte" : "Voir la liste"}
        icon={viewMode === "list" ? "map-outline" : "list"}
      />

      <View style={styles.filterRow}>
        <Pressable
          style={
            filter === "garde" ? styles.gardeChipActive : styles.chipInactive
          }
          onPress={() => setFilter("garde")}
        >
          <Ionicons
            name="moon"
            size={13}
            color={filter === "garde" ? colors.white : colors.garde}
          />
          <Text
            style={
              filter === "garde"
                ? styles.chipActiveText
                : styles.chipInactiveText
            }
          >
            De garde
          </Text>
        </Pressable>
        <Pressable
          style={filter === "all" ? styles.allChipActive : styles.chipInactive}
          onPress={() => setFilter("all")}
        >
          <Text
            style={
              filter === "all" ? styles.chipActiveText : styles.chipInactiveText
            }
          >
            Toutes
          </Text>
        </Pressable>
        <View style={styles.viewToggle}>
          <Pressable onPress={() => setViewMode("list")} hitSlop={8}>
            <Ionicons
              name="list"
              size={15}
              color={viewMode === "list" ? colors.accent : colors.textMuted50}
            />
          </Pressable>
          <Text style={styles.viewToggleSlash}>/</Text>
          <Pressable onPress={() => setViewMode("map")} hitSlop={8}>
            <Ionicons
              name="map-outline"
              size={15}
              color={viewMode === "map" ? colors.accent : colors.textMuted50}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.majorDivider} />

      {status === "loading" && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}

      {status === "error" && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Une erreur est survenue lors du chargement des pharmacies.
          </Text>
          {error && <Text style={styles.errorDetail}>{error}</Text>}
          <Pressable style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}

      {status === "empty" && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aucune pharmacie à proximité</Text>
        </View>
      )}

      {status === "success" && filteredPharmacies.length === 0 && query.trim().length > 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Aucun résultat pour « {query.trim()} »
          </Text>
          <Pressable style={styles.retryButton} onPress={() => setQuery("")}>
            <Text style={styles.retryText}>Effacer la recherche</Text>
          </Pressable>
        </View>
      )}

      {status === "success" && filteredPharmacies.length === 0 && query.trim().length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Aucune pharmacie de garde à proximité
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => setFilter("all")}
          >
            <Text style={styles.retryText}>Afficher toutes les pharmacies</Text>
          </Pressable>
        </View>
      )}

      {status === "success" && filteredPharmacies.length > 0 && viewMode === "list" && (
        <FlatList
          data={filteredPharmacies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PharmacyRow pharmacy={item} isShowingCachedData={isShowingCachedData} />
          )}
        />
      )}

      {status === "success" && filteredPharmacies.length > 0 && viewMode === "map" && (
        <PharmacyMap
          pharmacies={filteredPharmacies}
          userLocation={userLocation}
          onMarkerPress={(pharmacy) =>
            navigation.navigate("PharmacyDetail", { pharmacy })
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.s4 + 2,
    paddingTop: spacing.s3,
  },
  locationText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted60,
  },
  locationChevron: {
    marginLeft: "auto",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s2,
    marginHorizontal: spacing.s4 + 2,
    marginTop: spacing.s3,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: 11,
    paddingHorizontal: spacing.s4,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.text,
    padding: 0,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s2,
    paddingHorizontal: spacing.s4 + 2,
    paddingVertical: spacing.s3 + 2,
  },
  gardeChipActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.garde,
    borderRadius: radii.pill,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s4,
  },
  allChipActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s4,
  },
  chipInactive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.pill,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s4,
  },
  chipActiveText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  chipInactiveText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted60,
  },
  viewToggle: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  viewToggleSlash: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted50,
  },
  majorDivider: {
    borderTopWidth: 2,
    borderTopColor: colors.divider,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.s6,
  },
  errorText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.smd,
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  errorDetail: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colors.textMuted55,
    textAlign: "center",
    marginBottom: spacing.s4,
  },
  retryButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s3,
  },
  retryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.smd,
    color: colors.textMuted60,
    textAlign: "center",
    marginBottom: spacing.s4,
  },
});
