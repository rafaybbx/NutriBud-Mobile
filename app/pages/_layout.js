import { Stack, useLocalSearchParams } from "expo-router";
import CustomPageHeader from "../../components/headerpage";

export default function PagesLayout() {
  const params = useLocalSearchParams();
  const pageTitle = params.title || "Default Title"; 

  return (
    <Stack
      screenOptions={{
        header: () => <CustomPageHeader pageTitle={pageTitle} />,
      }}
    >
      <Stack.Screen name="notifications" />
      <Stack.Screen name="mealdetails" />
    </Stack>
  );
}
