import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={"house.fill"} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Label>Search</Label>
        <Icon sf={"magnifyingglass"} />
      </NativeTabs.Trigger>

      {/* Create Property */}

      <NativeTabs.Trigger name="saved">
        <Label>Saved</Label>
        <Icon sf={"heart.fill"} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={"person.fill"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
